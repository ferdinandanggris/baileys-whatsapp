import makeWASocket, { useMultiFileAuthState } from "baileys";
import { MessageHandler } from "./handlers/messageHandler";
import { ConnectionHandler } from "./handlers/connectionHandler";
import SessionService from "./services/sessionService";
import { ImCenterService } from "../../services/imcenterService";
import { join } from "path";
import { ImcenterLogService } from "../../services/imcenterLogService";
import { EventEmitter } from "stream";
import { QRCode } from "qrcode";
import { directoryPathSession, qrCodeToBase64 } from "../../utils/whatsapp";

type WhatsappServiceStatus = "start" | "qr" | "connected" | "closed";

export class WhatsappService extends EventEmitter {
    private socket: ReturnType<typeof makeWASocket>;
    private messageHandler: MessageHandler;
    private connectionHandler: ConnectionHandler;
    private status: WhatsappServiceStatus = "start";
    private qrcode: string = null;
    // private sessionPath : string = "+6282131955087";


    constructor(private imcenter_id: number, private basePath: string = "sessions") {
        super();
    }

    async init(): Promise<string> {

        // Tentukan folder untuk setiap instance
        const sessionPath = directoryPathSession(this.imcenter_id);

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        this.socket = makeWASocket({ 
            auth: state, printQRInTerminal: true });

        // Inisialisasi MessageHandler dan ConnectionHandler
        this.messageHandler = new MessageHandler(this.socket, new ImcenterLogService());
        this.connectionHandler = new ConnectionHandler(this.imcenter_id,this.socket, new SessionService(), new ImCenterService());

        // Tangani event koneksi
        this.connectionHandler.handleConnectionEvents();

        // Tangani pesan
        this.messageHandler.listenForMessages();

        // Simpan kredensial secara otomatis
        this.socket.ev.on("creds.update", saveCreds);

        // reconnection
        this.socket.ws.on("reconnect", () => {
            this.init();
            this.status = "start";
            console.log("Reconnecting...");
        });

        // change status to closed
        this.socket.ws.on("close", () => {
            this.status = "closed";
        });

        // change status to qr
        this.socket.ws.on("qr", async (qrcode) => {
            this.qrcode = qrcode;
            this.status = "qr";
        });

        return null;
    }

    private serviceIsReady() : boolean {
        if (this.socket?.authState?.creds?.me?.id) return true;
        return false;
    }


    private async waitingQRCode(): Promise<string> {
        return await this.connectionHandler.waitingQRCode();
    }

    async sendMessage(number: string, message: string) {
        await this.messageHandler.sendMessage(number, message);
    }

    async logout() {
        await this.connectionHandler.Logout();
    }

    async updateModeStandby(standby: boolean) {
        await this.connectionHandler.updateModeStandby(standby);
    }

    async broadcastMessage(jids: string[], message: string) {
        await this.messageHandler.broadcastMessage(jids, message);
    }
}