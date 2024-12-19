import { ConnectionState, DisconnectReason } from "baileys";
import { Boom } from '@hapi/boom'
import { getSocketJid, getSocketNumber } from "../../../utils/whatsapp";
import { STATUS_LOGIN, TIPE_LOG } from "../../../entities/types";
import { consumeImcenterSendMessageQueue, stopConsumeImcenterSendMessageQueue } from "../../../queues/consumers/imcenterConsumer";
import { WhatsappServiceProps } from "../../../interfaces/whatsapp";
import { WhatsappService } from "../whatsappService";

export class ConnectionHandler {
    constructor(private props: WhatsappServiceProps, private whatsappService: WhatsappService) {
    }

    handleConnectionEvents() {
        this.props.socket.ev.on("connection.update", async (update: Partial<ConnectionState>) => {
            const { connection, lastDisconnect } = update;
            if (connection) this.props.socket.ws.emit("connection", { connection: connection });
            switch (connection) {
                case "close":
                    this.handleConnectionClose(lastDisconnect);
                    break;
                case "open":
                    this.handleConnectionOpen();
                    break;
                default:
                    if (update.qr) {
                        await this.handleQRUpdate(update)
                    };
                    break;
            }
        });
    }

    private async handleQRUpdate(update: Partial<ConnectionState>) {
        try {
            console.log("QR Code tersedia. Silakan scan! ", this.props.imcenter_id);
            await this.props.sessionService.processUpdateQR(this.props.imcenter_id, update.qr);
            this.props.messageService.saveLog("QR Code tersedia. Silakan scan!", TIPE_LOG.LOG);
        } catch (error) {
            console.error("Gagal update QR Code", error);
            this.props.messageService.saveLog("Gagal update QR Code", TIPE_LOG.ERROR);
        }
    }

    async checkStatus() {
        this.whatsappService?.connectionState?.connection == 'close' ? this.props.socket.ws.emit("reconnect") : null;
    }

    private async handleConnectionOpen() {
        try {
            // check scanner
            const flagScannerValid = await this.props.imcenterService.checkScannerIsValid(this.props.imcenter_id, getSocketNumber(this.props.socket));
            if (!flagScannerValid) {
                console.log("Scanner tidak valid, silakan logout");
                this.logout();
                this.props.imcenterService.updateQRCode(this.props.imcenter_id, null);
                this.props.messageService.saveLog("[GAGAL SCAN QR] Nomor Whatsapp tidak cocok dengan yang terdaftar", TIPE_LOG.LOG);
                return;
            }

            console.log("Koneksi berhasil dibuka!");
            this.props.imcenterService.updateStatus(this.props.imcenter_id, STATUS_LOGIN.SUDAH_LOGIN);
            this.props.imcenterService.updateQRCode(this.props.imcenter_id, null);
            this.props.imcenterService.updateImJID(this.props.imcenter_id, getSocketJid(this.props.socket));
            this.props.messageService.saveLog("Login Berhasil", TIPE_LOG.LOG);

            // run consume imcenter consume
            await consumeImcenterSendMessageQueue(await this.props.imcenterService.getImcenterById(this.props.imcenter_id));
        } catch (error) {
            console.error("Gagal memproses koneksi", error);
            this.props.messageService.saveLog("Gagal memproses koneksi", TIPE_LOG.ERROR);
        }
    }

    private async handleConnectionClose(lastDisconnect: { error: Error | undefined; date: Date; }) {
        try {
            const reason = lastDisconnect?.error?.toString() || "Unknown reason";
            console.log(`Koneksi tertutup: ${reason}`);

            // stop consum imcenter
            await stopConsumeImcenterSendMessageQueue(await this.props.imcenterService.getImcenterById(this.props.imcenter_id));

            const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            switch ((lastDisconnect.error as Boom)?.output?.statusCode) {
                case DisconnectReason.loggedOut:
                    this.props.sessionService.removeSession(getSocketJid(this.props.socket));
                    this.props.imcenterService.updateStatus(this.props.imcenter_id, STATUS_LOGIN.BELUM_LOGIN);
                    break;
                case DisconnectReason.timedOut:
                    this.props.messageService.saveLog("QR Code telah kedaluwarsa, silakan aktifkan ulang", TIPE_LOG.LOG);
                    this.props.imcenterService.updateStatus(this.props.imcenter_id, STATUS_LOGIN.BELUM_LOGIN);
                    break;
                case DisconnectReason.connectionLost:
                    this.props.messageService.saveLog("Koneksi terputus, silakan coba lagi", TIPE_LOG.LOG);
                    this.props.socket.ws.emit("reconnect");
                    break;
                default:
                    if (shouldReconnect) {
                        this.props.socket.ws.emit("reconnect")
                        this.props.imcenterService.updateStatus(this.props.imcenter_id, STATUS_LOGIN.BELUM_LOGIN);
                    };
                    break;
            }
        } catch (error) {
            console.error("Gagal memproses koneksi", error);
            this.props.messageService.saveLog("Gagal memproses koneksi", TIPE_LOG.ERROR);
        }

    }

    async logout() {
        try {
            if (this.props.socket) {
                const jid = getSocketJid(this.props.socket);
                await this.props.sessionService.removeSession(jid);
                await this.props.socket.logout();
            }
        } catch (error) {
            console.error("Gagal logout", error);
            this.props.messageService.saveLog("Gagal Logout", TIPE_LOG.ERROR);
        }
    }
}