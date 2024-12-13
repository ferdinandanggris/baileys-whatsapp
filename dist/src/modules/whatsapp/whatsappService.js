"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const baileys_1 = __importDefault(require("baileys"));
const messageHandler_1 = require("./handlers/messageHandler");
const connectionHandler_1 = require("./handlers/connectionHandler");
const sessionService_1 = __importDefault(require("./services/sessionService"));
const imcenterService_1 = require("./services/imcenterService");
const messageService_1 = require("./services/messageService");
const authHandler_1 = __importDefault(require("./handlers/authHandler"));
const logger_1 = __importDefault(require("baileys/lib/Utils/logger"));
const profileHandler_1 = require("./handlers/profileHandler");
const PlatformTools_1 = require("typeorm/platform/PlatformTools");
class WhatsappService extends PlatformTools_1.EventEmitter {
    constructor(imcenter_id) {
        super();
        this.imcenter_id = imcenter_id;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const logger = logger_1.default.child({});
                logger.level = "silent";
                this.authHandler = new authHandler_1.default(this.imcenter_id);
                const { state, saveState } = yield this.authHandler.useAuthHandle();
                this.socket = (0, baileys_1.default)({
                    auth: state, printQRInTerminal: true, logger: logger, syncFullHistory: true
                });
                this.setEventHandlers();
                // Simpan kredensial secara otomatis
                this.socket.ev.on("creds.update", saveState);
            }
            catch (error) {
                console.error("Gagal inisialisasi", error);
            }
        });
    }
    setEventHandlers() {
        const props = {
            imcenter_id: this.imcenter_id,
            socket: this.socket,
            sessionService: new sessionService_1.default(),
            imcenterService: new imcenterService_1.ImCenterService(),
            messageService: new messageService_1.MessageService(this.imcenter_id)
        };
        this.messageHandler = new messageHandler_1.MessageHandler(props);
        this.connectionHandler = new connectionHandler_1.ConnectionHandler(props);
        this.profileHandler = new profileHandler_1.ProfileHandler(props);
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
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            // check if service is ready
            if (this.socket) {
                yield this.connectionHandler.checkStatus();
            }
            yield this.init();
        });
    }
}
exports.WhatsappService = WhatsappService;
//# sourceMappingURL=whatsappService.js.map