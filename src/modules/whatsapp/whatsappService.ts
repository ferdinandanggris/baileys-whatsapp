import makeWASocket, { useMultiFileAuthState } from "baileys";
import { MessageHandler } from "./handlers/messageHandler";
import { ConnectionHandler } from "./handlers/connectionHandler";
import SessionService from "./services/sessionService";
import { ImCenterService } from "../../services/imcenterService";
import { join } from "path";
import { ImcenterLogService } from "../../services/imcenterLogService";

export class WhatsappService {
    private socket: ReturnType<typeof makeWASocket>;
    private messageHandler: MessageHandler;
    private connectionHandler: ConnectionHandler;

    constructor(private sessionPath: string,private basePath: string = "sessions") {}

    async init() {
        // Tentukan folder untuk setiap instance
        const sessionPath = join(this.basePath, this.sessionPath);

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        this.socket = makeWASocket({ auth: state, printQRInTerminal: true });

        // Inisialisasi MessageHandler dan ConnectionHandler
        this.messageHandler = new MessageHandler(this.socket, new ImcenterLogService());
        this.connectionHandler = new ConnectionHandler(this.socket, new SessionService(), new ImCenterService());

        // Tangani event koneksi
        this.connectionHandler.handleConnectionEvents();

        // Tangani pesan
        this.messageHandler.listenForMessages();

        // Simpan kredensial secara otomatis
        this.socket.ev.on("creds.update", saveCreds);

        return this.socket;
    }

    async sendMessage(jid: string, message: string) {
        await this.messageHandler.sendMessage(jid, message);
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