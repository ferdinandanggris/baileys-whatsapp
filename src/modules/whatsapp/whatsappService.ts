import makeWASocket, { proto, useMultiFileAuthState } from "baileys";
import { MessageHandler } from "./handlers/messageHandler";
import { ConnectionHandler } from "./handlers/connectionHandler";
import SessionService from "./services/sessionService";
import { ImCenterService } from "./services/imcenterService";
import { MessageService } from "./services/messageService";
import AuthHandler from "./handlers/authHandler";
import log from "baileys/lib/Utils/logger";
import { ProfileHandler } from "./handlers/profileHandler";
import { IWhatsappService, SendWhatsappMessage } from "../../interfaces/whatsapp";
import { EventEmitter } from "typeorm/platform/PlatformTools";

export class WhatsappService extends EventEmitter implements IWhatsappService {
    private socket: ReturnType<typeof makeWASocket>;
    public messageHandler: MessageHandler;
    public connectionHandler: ConnectionHandler;
    public authHandler: AuthHandler;
    public profileHandler: ProfileHandler;

    constructor(private imcenter_id: number) {
        super();
    }

    private async init() {
        try {

            const logger = log.child({});
            logger.level = "silent";

            this.authHandler = new AuthHandler(this.imcenter_id);
            const { state, saveState } = await this.authHandler.useAuthHandle();

            this.socket = makeWASocket({
                auth: state, printQRInTerminal: true, logger: logger, syncFullHistory: true
            });

            this.setEventHandlers();

            // Simpan kredensial secara otomatis
            this.socket.ev.on("creds.update", saveState);

        } catch (error) {
            console.error("Gagal inisialisasi", error);
        }
    }

    setEventHandlers() {
        const props = {
            imcenter_id: this.imcenter_id,
            socket: this.socket,
            sessionService  : new SessionService(),
            imcenterService: new ImCenterService(),
            messageService: new MessageService(this.imcenter_id)
        }

        this.messageHandler = new MessageHandler(props);
        this.connectionHandler = new ConnectionHandler(props);
        this.profileHandler = new ProfileHandler(props);

        // Tangani event koneksi
        this.connectionHandler.handleConnectionEvents();

        // Tangani pesan
        this.messageHandler.listenForMessages();

        // reconnection
        this.socket.ws.on("reconnect", () => {
            console.log("Reconnecting...");
            return this.init();
        });
    }

    async connect(): Promise<void> {
        // check if service is ready
        if (this.socket) {
            await this.connectionHandler.checkStatus();
        }
        await this.init();
    }
}