import makeWASocket, { useMultiFileAuthState } from "baileys";
import { MessageHandler } from "./handlers/messageHandler";
import { ConnectionHandler } from "./handlers/connectionHandler";
import SessionService from "./services/sessionService";
import { ImCenterService } from "./services/imcenterService";
import { EventEmitter } from "stream";
import { directoryPathSession } from "../../utils/whatsapp";
import { MessageService } from "./services/messageService";
import AuthHandler from "./handlers/authHandler";
import { DataSource } from "typeorm";
import log from "baileys/lib/Utils/logger";
export class WhatsappService {
    private socket: ReturnType<typeof makeWASocket>;
    private messageHandler: MessageHandler;
    private connectionHandler: ConnectionHandler;
    private authHandler : AuthHandler;

    constructor(private imcenter_id: number) {}

    async init() {
        try{

            const logger = log.child({});
            logger.level = "silent";
    
            // Inisialisasi MessageHandler dan ConnectionHandler
            this.authHandler = new AuthHandler(this.imcenter_id);
            const { state, saveState } = await this.authHandler.useAuthHandle();
    
            this.socket = makeWASocket({ 
                auth: state, printQRInTerminal: true, logger : logger });
    
            this.messageHandler = new MessageHandler(this.socket, new MessageService(this.imcenter_id));
            this.connectionHandler = new ConnectionHandler(this.imcenter_id,this.socket, new SessionService(), new ImCenterService(), new MessageService(this.imcenter_id));
    
            // Tangani event koneksi
            this.connectionHandler.handleConnectionEvents();
    
            // Tangani pesan
            this.messageHandler.listenForMessages();
    
            // Simpan kredensial secara otomatis
            this.socket.ev.on("creds.update", saveState);
    
            // reconnection
            this.socket.ws.on("reconnect", () => {
                console.log("Reconnecting...");
                return this.init();
            });
        }catch(error) {
            console.error("Gagal inisialisasi", error);
        }
    }

    async connect() : Promise<string> {
        // check if service is ready
        if (this.socket) {
            return await this.connectionHandler.checkStatus();
        }
        await this.init();
    }

    async sendMessage(number: string, message: string) {
        await this.messageHandler.sendMessage(number, message);
    }

    async logout() {
        await this.connectionHandler?.logout();
    }
    async broadcastMessage(jids: string[], message: string) {
        await this.messageHandler.broadcastMessage(jids, message);
    }
}