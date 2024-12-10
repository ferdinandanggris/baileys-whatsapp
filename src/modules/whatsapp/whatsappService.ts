import makeWASocket, { useMultiFileAuthState } from "baileys";
import { MessageHandler } from "./handlers/messageHandler";
import { ConnectionHandler } from "./handlers/connectionHandler";
import SessionService from "./services/sessionService";
import { ImCenterService } from "./services/imcenterService";
import { EventEmitter } from "stream";
import { directoryPathSession } from "../../utils/whatsapp";
import { MessageService } from "./services/messageService";
export class WhatsappService {
    private socket: ReturnType<typeof makeWASocket>;
    private messageHandler: MessageHandler;
    private connectionHandler: ConnectionHandler;

    constructor(private imcenter_id: number) {}

    async init(): Promise<string> {

        // Tentukan folder untuk setiap instance
        const sessionPath = directoryPathSession(this.imcenter_id);

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        this.socket = makeWASocket({ 
            auth: state, printQRInTerminal: true });

        // Inisialisasi MessageHandler dan ConnectionHandler
        this.messageHandler = new MessageHandler(this.socket, new MessageService(this.imcenter_id));
        this.connectionHandler = new ConnectionHandler(this.imcenter_id,this.socket, new SessionService(), new ImCenterService(), new MessageService(this.imcenter_id));

        // Tangani event koneksi
        this.connectionHandler.handleConnectionEvents();

        // Tangani pesan
        this.messageHandler.listenForMessages();

        // Simpan kredensial secara otomatis
        this.socket.ev.on("creds.update", saveCreds);

        // reconnection
        this.socket.ws.on("reconnect", () => {
            console.log("Reconnecting...");
            return this.init();
        });

        return await this.waitingQRCode();
    }

    async connect() : Promise<string> {
        // check if service is ready
        if (this.socket) {
            return await this.connectionHandler.getImcenterQRCode();
        }
        return await this.init();
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