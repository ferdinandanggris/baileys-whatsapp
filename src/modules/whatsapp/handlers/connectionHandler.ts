import { ConnectionState, DisconnectReason, WASocket } from "baileys";
import SessionService from "../services/sessionService";
import { ImCenterService } from "../../../services/imcenterService"
import { Boom } from '@hapi/boom'
import { EventEmitter } from "stream";
import { directoryPathSession, getSocketNumber, qrCodeToBase64 } from "../../../utils/whatsapp";
import fs from "fs";

export class ConnectionHandler extends EventEmitter{
    constructor(private imcenter_id: number,private socket: WASocket, private sessionService : SessionService, private imcenterService: ImCenterService) {
        super();
        this.socket = socket;
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
        this.changeEventStatus("qr", await qrCodeToBase64(update.qr));
        console.log("QR Code tersedia. Silakan scan! ", this.imcenter_id);
        this.imcenterService.updateQRCode(this.imcenter_id, update.qr);
    }

    private async  handleConnectionOpen() {

        // check scanner
        const flagScannerValid = await this.imcenterService.checkScannerIsValid(this.imcenter_id,getSocketNumber(this.socket));
        if (!flagScannerValid) {
            console.log("Scanner tidak valid, silakan logout");
            this.socket.logout();
        }

        console.log("Koneksi berhasil dibuka!");
        this.changeEventStatus("connected");
        this.sessionService.saveSession(getSocketNumber(this.socket), this.socket);
    }

    private handleConnectionClose(lastDisconnect: { error: Error | undefined; date: Date; }) {
        const reason = lastDisconnect?.error?.toString() || "Unknown reason";
        console.log(`Koneksi tertutup: ${reason}`);

        const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);

        switch((lastDisconnect.error as Boom)?.output?.statusCode){
            case DisconnectReason.loggedOut:
                this.removeSessionDirectory(this.imcenter_id);
                break;
            default:
                if(shouldReconnect) this.socket.ws.emit("reconnect");
                break;
            
        }
    }

    private removeSessionDirectory(imcenter_id) {
        this.sessionService.removeSession(getSocketNumber(this.socket));
        fs.rmdirSync(directoryPathSession(imcenter_id), { recursive: true });
    }

    private changeEventStatus(status : "start" | "qr" | "connected" | "closed", value?: string) {
        this.socket.ws.emit(status, value);
    }

    async Logout() {
        if (this.socket) {
            await this.socket.logout();
            this.socket = null;
            this.sessionService.removeSession(getSocketNumber(this.socket));
        }
    }

    async updateModeStandby(standby: boolean) {
        this.imcenterService.updateModeStandby(standby, this.imcenter_id);
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