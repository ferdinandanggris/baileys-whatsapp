import { ConnectionState, DisconnectReason, WASocket } from "baileys";
import { ImCenterService } from "../services/imcenterService";
import { Boom } from '@hapi/boom'
import { getSocketJid, getSocketNumber, qrCodeToBase64 } from "../../../utils/whatsapp";
import { MessageService } from "../services/messageService";
import { STATUS_LOGIN, TIPE_LOG } from "../../../entities/types";
import { consumeImcenterSendMessageQueue, stopConsumeImcenterSendMessageQueue } from "../../../queues/consumers/imcenterConsumer";
import { WhatsappServiceProps } from "../../../interfaces/whatsapp";

export class ConnectionHandler{
    constructor(private props : WhatsappServiceProps) {
    }

    handleConnectionEvents() {
        this.props.socket.ev.on("connection.update", async (update : Partial<ConnectionState>) => {
            const { connection, lastDisconnect } = update;

            switch (connection) {
                case "close":
                    this.handleConnectionClose(lastDisconnect);
                    break;
                case "open":
                    this.handleConnectionOpen();
                    break;
                default:
                    if(update.qr) await this.handleQRUpdate(update);
                    break;
            }
        });
    }

    private async handleQRUpdate(update : Partial<ConnectionState>) {
        try{
            this.changeEventStatus("qr", await qrCodeToBase64(update.qr));
            console.log("QR Code tersedia. Silakan scan! ", this.props.imcenter_id);
            this.props.imcenterService.updateStatus(this.props.imcenter_id, STATUS_LOGIN.PROSES_LOGIN);
            this.props.imcenterService.updateQRCode(this.props.imcenter_id,update.qr);
            this.props.messageService.saveLog("QR Code tersedia. Silakan scan!",TIPE_LOG.LOG);
        }catch(error) {
            console.error("Gagal update QR Code", error);
            this.props.messageService.saveLog("Gagal update QR Code", TIPE_LOG.ERROR);
        }
    }

    async checkStatus() {
        const imcenter = await this.props.imcenterService.getImcenterById(this.props.imcenter_id);
        if (!imcenter) {
            throw new Error("Imcenter not found");
        }

        switch(imcenter.status_login) {
            case STATUS_LOGIN.SUDAH_LOGIN:
                return null;
            case STATUS_LOGIN.PROSES_LOGIN:
                return await qrCodeToBase64(imcenter.qr);
            case STATUS_LOGIN.DISABLE_QR:
                this.props.socket.ws.emit("reconnect");
                // throw new Error("Please wait for a seconds and try again");
                break;
            case STATUS_LOGIN.BELUM_LOGIN:
                this.props.socket.ws.emit("reconnect");
                // throw new Error("Please wait for a seconds and try again");
                break;

        }
    }

    private async  handleConnectionOpen() {
        try{
            // check scanner
            const flagScannerValid = await this.props.imcenterService.checkScannerIsValid(this.props.imcenter_id,getSocketNumber(this.props.socket));
                if (!flagScannerValid) {
                console.log("Scanner tidak valid, silakan logout");
                this.props.socket.logout();
                this.props.imcenterService.updateQRCode(this.props.imcenter_id, null);
                this.props.messageService.saveLog("[GAGAL SCAN QR] Nomor Whatsapp tidak cocok dengan yang terdaftar", TIPE_LOG.LOG);
                return;
            }

            console.log("Koneksi berhasil dibuka!");
            this.props.imcenterService.updateStatus(this.props.imcenter_id, STATUS_LOGIN.SUDAH_LOGIN);
            this.props.imcenterService.updateQRCode(this.props.imcenter_id, null);
            this.props.messageService.saveLog("Login Berhasil", TIPE_LOG.LOG);

            // run consume imcenter consume
            await consumeImcenterSendMessageQueue(await this.props.imcenterService.getImcenterById(this.props.imcenter_id));
        }catch (error) {
            console.error("Gagal memproses koneksi", error);
            this.props.messageService.saveLog("Gagal memproses koneksi", TIPE_LOG.ERROR);
        }
    }

    private async handleConnectionClose(lastDisconnect: { error: Error | undefined; date: Date; }) {
        try{
            const reason = lastDisconnect?.error?.toString() || "Unknown reason";
            console.log(`Koneksi tertutup: ${reason}`);
    
            // stop consum imcenter
            await stopConsumeImcenterSendMessageQueue(await this.props.imcenterService.getImcenterById(this.props.imcenter_id));

            const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            switch((lastDisconnect.error as Boom)?.output?.statusCode){
                case DisconnectReason.loggedOut:
                    this.logout();
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
                    if(shouldReconnect) {
                        this.props.socket.ws.emit("reconnect")
                        this.props.imcenterService.updateStatus(this.props.imcenter_id, STATUS_LOGIN.BELUM_LOGIN);
                    };
                    break;
            }
        }catch (error) {
            console.error("Gagal memproses koneksi", error);
            this.props.messageService.saveLog("Gagal memproses koneksi", TIPE_LOG.ERROR);
        }

    }

    private changeEventStatus(status : "qr" , value?: string) {
        this.props.socket.ws.emit(status, value);
    }

    async logout() {
        try{
            if (this.props.socket) {
                const jid = getSocketJid(this.props.socket);
                await this.props.socket.logout();
                await this.props.sessionService.removeSession(jid);
                this.props.socket = null;
            }
        }catch(error) {
            console.error("Gagal logout", error);
            this.props.messageService.saveLog("Gagal Logout", TIPE_LOG.ERROR);
        }  
    }
}