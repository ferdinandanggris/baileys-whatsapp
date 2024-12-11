import { ConnectionState, DisconnectReason, WASocket } from "baileys";
import SessionService from "../services/sessionService";
import { ImCenterService } from "../services/imcenterService";
import { Boom } from '@hapi/boom'
import { getSocketJid, getSocketNumber, qrCodeToBase64 } from "../../../utils/whatsapp";
import { MessageService } from "../services/messageService";
import { STATUS_LOGIN, TIPE_LOG } from "../../../entities/types";

export class ConnectionHandler{
    constructor(private imcenter_id: number,private socket: WASocket, private sessionService : SessionService, private imcenterService: ImCenterService, private messageService : MessageService) {

    }

    handleConnectionEvents() {
        this.socket.ev.on("connection.update", async (update : Partial<ConnectionState>) => {
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
            console.log("QR Code tersedia. Silakan scan! ", this.imcenter_id);
            this.imcenterService.updateStatus(this.imcenter_id, STATUS_LOGIN.PROSES_LOGIN);
            this.imcenterService.updateQRCode(this.imcenter_id,update.qr);
            this.messageService.saveLog("QR Code tersedia. Silakan scan!",TIPE_LOG.LOG);
        }catch(error) {
            console.error("Gagal update QR Code", error);
            this.messageService.saveLog("Gagal update QR Code", TIPE_LOG.ERROR);
        }
    }

    async getImcenterQRCode() {
        const imcenter = await this.imcenterService.getImcenterById(this.imcenter_id);
        if (!imcenter) {
            throw new Error("Imcenter not found");
        }

        switch(imcenter.status_login) {
            case STATUS_LOGIN.SUDAH_LOGIN:
                return null;
            case STATUS_LOGIN.PROSES_LOGIN:
                return await qrCodeToBase64(imcenter.qr);
            case STATUS_LOGIN.DISABLE_QR:
                this.socket.ws.emit("reconnect");
                // throw new Error("Please wait for a seconds and try again");
                break;
            case STATUS_LOGIN.BELUM_LOGIN:
                this.socket.ws.emit("reconnect");
                // throw new Error("Please wait for a seconds and try again");
                break;

        }
    }

    private async  handleConnectionOpen() {
        try{
            // check scanner
            const flagScannerValid = await this.imcenterService.checkScannerIsValid(this.imcenter_id,getSocketNumber(this.socket));
                if (!flagScannerValid) {
                console.log("Scanner tidak valid, silakan logout");
                this.socket.logout();
                this.removeSession();
                this.imcenterService.updateQRCode(this.imcenter_id, null);
                this.messageService.saveLog("[GAGAL SCAN QR] Nomor Whatsapp tidak cocok dengan yang terdaftar", TIPE_LOG.LOG);
                return;
            }

            console.log("Koneksi berhasil dibuka!");
            this.imcenterService.updateStatus(this.imcenter_id, STATUS_LOGIN.SUDAH_LOGIN);
            this.imcenterService.updateQRCode(this.imcenter_id, null);
            this.messageService.saveLog("Login Berhasil", TIPE_LOG.LOG);
        }catch (error) {
            console.error("Gagal memproses koneksi", error);
            this.messageService.saveLog("Gagal memproses koneksi", TIPE_LOG.ERROR);
        }
    }

    private handleConnectionClose(lastDisconnect: { error: Error | undefined; date: Date; }) {
        try{
            const reason = lastDisconnect?.error?.toString() || "Unknown reason";
            console.log(`Koneksi tertutup: ${reason}`);
    
            const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            switch((lastDisconnect.error as Boom)?.output?.statusCode){
                case DisconnectReason.loggedOut:
                    this.removeSession();
                    this.imcenterService.updateStatus(this.imcenter_id, STATUS_LOGIN.BELUM_LOGIN);
                    break;
                case DisconnectReason.timedOut:
                    this.messageService.saveLog("QR Code telah kedaluwarsa, silakan aktifkan ulang", TIPE_LOG.LOG);
                    this.imcenterService.updateStatus(this.imcenter_id, STATUS_LOGIN.BELUM_LOGIN);
                    break;
                default:
                    if(shouldReconnect) {
                        this.socket.ws.emit("reconnect")
                        this.imcenterService.updateStatus(this.imcenter_id, STATUS_LOGIN.BELUM_LOGIN);
                    };
                    break;
            }
        }catch (error) {
            console.error("Gagal memproses koneksi", error);
            this.messageService.saveLog("Gagal memproses koneksi", TIPE_LOG.ERROR);
        }

    }

    private removeSession() {
        try{
            this.sessionService.removeSession(getSocketJid(this.socket));
        }catch(error) {
            console.error("Gagal menghapus session", error);
            this.messageService.saveLog("Gagal menghapus session", TIPE_LOG.ERROR);
        }
    }

    private changeEventStatus(status : "qr" , value?: string) {
        this.socket.ws.emit(status, value);
    }

    async Logout() {
        try{
            if (this.socket) {
                await this.socket.logout();
                this.socket = null;
                this.sessionService.removeSession(getSocketNumber(this.socket));
            }
        }catch(error) {
            console.error("Gagal logout", error);
            this.messageService.saveLog("Gagal Logout", TIPE_LOG.ERROR);
        }
       
    }

    async waitingQRCode(): Promise<string> {
        const qrCodePromise = new Promise((resolve) => {
            this.socket.ev.on("connection.update", async (update) => {
                const { connection, qr } = update;
                if (connection === "open") {
                    resolve(null);
                }
                if (qr) {
                    resolve(qr);
                }
            });
        }) as Promise<string>;

        const qrCodeValue = await qrCodePromise;
        if (qrCodeValue) {
            return qrCodeToBase64(qrCodeValue);
        }
        return null;
    } 
}