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
class WhatsappService {
    constructor(imcenter_id) {
        this.imcenter_id = imcenter_id;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const logger = logger_1.default.child({});
                logger.level = "silent";
                // Inisialisasi MessageHandler dan ConnectionHandler
                this.authHandler = new authHandler_1.default(this.imcenter_id);
                const { state, saveState } = yield this.authHandler.useAuthHandle();
                this.socket = (0, baileys_1.default)({
                    auth: state, printQRInTerminal: true, logger: logger
                });
                this.messageHandler = new messageHandler_1.MessageHandler(this.socket, new messageService_1.MessageService(this.imcenter_id));
                this.connectionHandler = new connectionHandler_1.ConnectionHandler(this.imcenter_id, this.socket, new sessionService_1.default(), new imcenterService_1.ImCenterService(), new messageService_1.MessageService(this.imcenter_id));
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
            }
            catch (error) {
                console.error("Gagal inisialisasi", error);
            }
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            // check if service is ready
            if (this.socket) {
                return yield this.connectionHandler.checkStatus();
            }
            yield this.init();
        });
    }
    sendMessage(number, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.messageHandler.sendMessage(number, message);
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield ((_a = this.connectionHandler) === null || _a === void 0 ? void 0 : _a.logout());
        });
    }
    broadcastMessage(jids, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.messageHandler.broadcastMessage(jids, message);
        });
    }
}
exports.WhatsappService = WhatsappService;
//# sourceMappingURL=whatsappService.js.map