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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionHandler = void 0;
const baileys_1 = require("baileys");
const whatsapp_1 = require("../../../utils/whatsapp");
const types_1 = require("../../../entities/types");
class ConnectionHandler {
    constructor(imcenter_id, socket, sessionService, imcenterService, messageService) {
        this.imcenter_id = imcenter_id;
        this.socket = socket;
        this.sessionService = sessionService;
        this.imcenterService = imcenterService;
        this.messageService = messageService;
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
            try {
                this.changeEventStatus("qr", yield (0, whatsapp_1.qrCodeToBase64)(update.qr));
                console.log("QR Code tersedia. Silakan scan! ", this.imcenter_id);
                this.imcenterService.updateStatus(this.imcenter_id, types_1.STATUS_LOGIN.PROSES_LOGIN);
                this.imcenterService.updateQRCode(this.imcenter_id, update.qr);
                this.messageService.saveLog("QR Code tersedia. Silakan scan!", types_1.TIPE_LOG.LOG);
            }
            catch (error) {
                console.error("Gagal update QR Code", error);
                this.messageService.saveLog("Gagal update QR Code", types_1.TIPE_LOG.ERROR);
            }
        });
    }
    getImcenterQRCode() {
        return __awaiter(this, void 0, void 0, function* () {
            const imcenter = yield this.imcenterService.getImcenterById(this.imcenter_id);
            if (!imcenter) {
                throw new Error("Imcenter not found");
            }
            switch (imcenter.status_login) {
                case types_1.STATUS_LOGIN.SUDAH_LOGIN:
                    return null;
                case types_1.STATUS_LOGIN.PROSES_LOGIN:
                    return yield (0, whatsapp_1.qrCodeToBase64)(imcenter.qr);
                case types_1.STATUS_LOGIN.DISABLE_QR:
                    this.socket.ws.emit("reconnect");
                    // throw new Error("Please wait for a seconds and try again");
                    break;
                case types_1.STATUS_LOGIN.BELUM_LOGIN:
                    this.socket.ws.emit("reconnect");
                    // throw new Error("Please wait for a seconds and try again");
                    break;
            }
        });
    }
    handleConnectionOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check scanner
                const flagScannerValid = yield this.imcenterService.checkScannerIsValid(this.imcenter_id, (0, whatsapp_1.getSocketNumber)(this.socket));
                if (!flagScannerValid) {
                    console.log("Scanner tidak valid, silakan logout");
                    this.socket.logout();
                    this.removeSession();
                    this.imcenterService.updateQRCode(this.imcenter_id, null);
                    this.messageService.saveLog("[GAGAL SCAN QR] Nomor Whatsapp tidak cocok dengan yang terdaftar", types_1.TIPE_LOG.LOG);
                    return;
                }
                console.log("Koneksi berhasil dibuka!");
                this.imcenterService.updateStatus(this.imcenter_id, types_1.STATUS_LOGIN.SUDAH_LOGIN);
                this.imcenterService.updateQRCode(this.imcenter_id, null);
                this.messageService.saveLog("Login Berhasil", types_1.TIPE_LOG.LOG);
            }
            catch (error) {
                console.error("Gagal memproses koneksi", error);
                this.messageService.saveLog("Gagal memproses koneksi", types_1.TIPE_LOG.ERROR);
            }
        });
    }
    handleConnectionClose(lastDisconnect) {
        var _a, _b, _c, _d, _e;
        try {
            const reason = ((_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.toString()) || "Unknown reason";
            console.log(`Koneksi tertutup: ${reason}`);
            const shouldReconnect = ((_c = (_b = lastDisconnect.error) === null || _b === void 0 ? void 0 : _b.output) === null || _c === void 0 ? void 0 : _c.statusCode) !== baileys_1.DisconnectReason.loggedOut;
            switch ((_e = (_d = lastDisconnect.error) === null || _d === void 0 ? void 0 : _d.output) === null || _e === void 0 ? void 0 : _e.statusCode) {
                case baileys_1.DisconnectReason.loggedOut:
                    this.removeSession();
                    this.imcenterService.updateStatus(this.imcenter_id, types_1.STATUS_LOGIN.BELUM_LOGIN);
                    break;
                case baileys_1.DisconnectReason.timedOut:
                    this.messageService.saveLog("QR Code telah kedaluwarsa, silakan aktifkan ulang", types_1.TIPE_LOG.LOG);
                    this.imcenterService.updateStatus(this.imcenter_id, types_1.STATUS_LOGIN.BELUM_LOGIN);
                    break;
                default:
                    if (shouldReconnect) {
                        this.socket.ws.emit("reconnect");
                        this.imcenterService.updateStatus(this.imcenter_id, types_1.STATUS_LOGIN.BELUM_LOGIN);
                    }
                    ;
                    break;
            }
        }
        catch (error) {
            console.error("Gagal memproses koneksi", error);
            this.messageService.saveLog("Gagal memproses koneksi", types_1.TIPE_LOG.ERROR);
        }
    }
    removeSession() {
        try {
            this.sessionService.removeSession((0, whatsapp_1.getSocketJid)(this.socket));
        }
        catch (error) {
            console.error("Gagal menghapus session", error);
            this.messageService.saveLog("Gagal menghapus session", types_1.TIPE_LOG.ERROR);
        }
    }
    changeEventStatus(status, value) {
        this.socket.ws.emit(status, value);
    }
    Logout() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.socket) {
                    yield this.socket.logout();
                    this.socket = null;
                    this.sessionService.removeSession((0, whatsapp_1.getSocketNumber)(this.socket));
                }
            }
            catch (error) {
                console.error("Gagal logout", error);
                this.messageService.saveLog("Gagal Logout", types_1.TIPE_LOG.ERROR);
            }
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