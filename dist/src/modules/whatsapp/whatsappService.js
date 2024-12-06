"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const baileys_1 = __importStar(require("baileys"));
const messageHandler_1 = require("./handlers/messageHandler");
const connectionHandler_1 = require("./handlers/connectionHandler");
const sessionService_1 = __importDefault(require("./services/sessionService"));
const imcenterService_1 = require("../../services/imcenterService");
const path_1 = require("path");
class WhatsappService {
    constructor(sessionPath, basePath = "sessions") {
        this.sessionPath = sessionPath;
        this.basePath = basePath;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Tentukan folder untuk setiap instance
            const sessionPath = (0, path_1.join)(this.basePath, this.sessionPath);
            const { state, saveCreds } = yield (0, baileys_1.useMultiFileAuthState)(sessionPath);
            this.socket = (0, baileys_1.default)({ auth: state, printQRInTerminal: true });
            // Inisialisasi MessageHandler dan ConnectionHandler
            this.messageHandler = new messageHandler_1.MessageHandler(this.socket);
            this.connectionHandler = new connectionHandler_1.ConnectionHandler(this.socket, new sessionService_1.default(), new imcenterService_1.ImCenterService());
            // Tangani event koneksi
            this.connectionHandler.handleConnectionEvents();
            // Tangani pesan
            this.messageHandler.listenForMessages();
            // Simpan kredensial secara otomatis
            this.socket.ev.on("creds.update", saveCreds);
            return this.socket;
        });
    }
    sendMessage(jid, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.messageHandler.sendMessage(jid, message);
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.socket) {
                yield this.socket.logout();
                this.socket = null;
            }
        });
    }
}
exports.WhatsappService = WhatsappService;
//# sourceMappingURL=whatsappService.js.map