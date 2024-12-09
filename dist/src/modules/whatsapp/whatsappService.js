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
const imcenterLogService_1 = require("../../services/imcenterLogService");
const stream_1 = require("stream");
const whatsapp_1 = require("../../utils/whatsapp");
class WhatsappService extends stream_1.EventEmitter {
    // private sessionPath : string = "+6282131955087";
    constructor(imcenter_id, basePath = "sessions") {
        super();
        this.imcenter_id = imcenter_id;
        this.basePath = basePath;
        this.status = "start";
        this.qrcode = null;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Tentukan folder untuk setiap instance
            const sessionPath = (0, whatsapp_1.directoryPathSession)(this.imcenter_id);
            const { state, saveCreds } = yield (0, baileys_1.useMultiFileAuthState)(sessionPath);
            this.socket = (0, baileys_1.default)({
                auth: state, printQRInTerminal: true
            });
            // Inisialisasi MessageHandler dan ConnectionHandler
            this.messageHandler = new messageHandler_1.MessageHandler(this.socket, new imcenterLogService_1.ImcenterLogService());
            this.connectionHandler = new connectionHandler_1.ConnectionHandler(this.imcenter_id, this.socket, new sessionService_1.default(), new imcenterService_1.ImCenterService());
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
            this.socket.ws.on("qr", (qrcode) => __awaiter(this, void 0, void 0, function* () {
                this.qrcode = qrcode;
                this.status = "qr";
            }));
            return null;
        });
    }
    serviceIsReady() {
        var _a, _b, _c, _d;
        if ((_d = (_c = (_b = (_a = this.socket) === null || _a === void 0 ? void 0 : _a.authState) === null || _b === void 0 ? void 0 : _b.creds) === null || _c === void 0 ? void 0 : _c.me) === null || _d === void 0 ? void 0 : _d.id)
            return true;
        return false;
    }
    waitingQRCode() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.connectionHandler.waitingQRCode();
        });
    }
    sendMessage(number, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.messageHandler.sendMessage(number, message);
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectionHandler.Logout();
        });
    }
    updateModeStandby(standby) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectionHandler.updateModeStandby(standby);
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