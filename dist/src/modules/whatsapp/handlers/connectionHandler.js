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
exports.ConnectionHandler = void 0;
const baileys_1 = require("baileys");
const stream_1 = require("stream");
const whatsapp_1 = require("../../../utils/whatsapp");
const fs_1 = __importDefault(require("fs"));
class ConnectionHandler extends stream_1.EventEmitter {
    constructor(imcenter_id, socket, sessionService, imcenterService) {
        super();
        this.imcenter_id = imcenter_id;
        this.socket = socket;
        this.sessionService = sessionService;
        this.imcenterService = imcenterService;
        this.socket = socket;
    }
    handleConnectionEvents() {
        this.socket.ev.on("connection.update", (update) => __awaiter(this, void 0, void 0, function* () {
            const { connection, lastDisconnect } = update;
            switch (connection) {
                case "close":
                    this.handleConnectionClose(lastDisconnect);
                    break;
                case "open":
                    this.handleConnectionOpen();
                    break;
                default:
                    if (update.qr)
                        yield this.handleQRUpdate(update);
                    break;
            }
        }));
    }
    handleQRUpdate(update) {
        return __awaiter(this, void 0, void 0, function* () {
            this.changeEventStatus("qr", yield (0, whatsapp_1.qrCodeToBase64)(update.qr));
            console.log("QR Code tersedia. Silakan scan! ", this.imcenter_id);
            this.imcenterService.updateQRCode(this.imcenter_id, update.qr);
        });
    }
    handleConnectionOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            // check scanner
            const flagScannerValid = yield this.imcenterService.checkScannerIsValid(this.imcenter_id, (0, whatsapp_1.getSocketNumber)(this.socket));
            if (!flagScannerValid) {
                console.log("Scanner tidak valid, silakan logout");
                this.socket.logout();
            }
            console.log("Koneksi berhasil dibuka!");
            this.changeEventStatus("connected");
            this.sessionService.saveSession((0, whatsapp_1.getSocketNumber)(this.socket), this.socket);
        });
    }
    handleConnectionClose(lastDisconnect) {
        var _a, _b, _c, _d, _e;
        const reason = ((_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.toString()) || "Unknown reason";
        console.log(`Koneksi tertutup: ${reason}`);
        const shouldReconnect = ((_c = (_b = lastDisconnect.error) === null || _b === void 0 ? void 0 : _b.output) === null || _c === void 0 ? void 0 : _c.statusCode) !== baileys_1.DisconnectReason.loggedOut;
        console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
        switch ((_e = (_d = lastDisconnect.error) === null || _d === void 0 ? void 0 : _d.output) === null || _e === void 0 ? void 0 : _e.statusCode) {
            case baileys_1.DisconnectReason.loggedOut:
                this.removeSessionDirectory(this.imcenter_id);
                break;
            default:
                if (shouldReconnect)
                    this.socket.ws.emit("reconnect");
                break;
        }
    }
    removeSessionDirectory(imcenter_id) {
        this.sessionService.removeSession((0, whatsapp_1.getSocketNumber)(this.socket));
        fs_1.default.rmdirSync((0, whatsapp_1.directoryPathSession)(imcenter_id), { recursive: true });
    }
    changeEventStatus(status, value) {
        this.socket.ws.emit(status, value);
    }
    Logout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.socket) {
                yield this.socket.logout();
                this.socket = null;
                this.sessionService.removeSession((0, whatsapp_1.getSocketNumber)(this.socket));
            }
        });
    }
    updateModeStandby(standby) {
        return __awaiter(this, void 0, void 0, function* () {
            this.imcenterService.updateModeStandby(standby, this.imcenter_id);
        });
    }
    waitingQRCode() {
        return __awaiter(this, void 0, void 0, function* () {
            const qrCodePromise = new Promise((resolve) => {
                this.socket.ev.on("connection.update", (update) => __awaiter(this, void 0, void 0, function* () {
                    const { connection, qr } = update;
                    if (connection === "open") {
                        resolve(null);
                    }
                    if (qr) {
                        resolve(qr);
                    }
                }));
            });
            const qrCodeValue = yield qrCodePromise;
            if (qrCodeValue) {
                return (0, whatsapp_1.qrCodeToBase64)(qrCodeValue);
            }
            return null;
        });
    }
}
exports.ConnectionHandler = ConnectionHandler;
//# sourceMappingURL=connectionHandler.js.map