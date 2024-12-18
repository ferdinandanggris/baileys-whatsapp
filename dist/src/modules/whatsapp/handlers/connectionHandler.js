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
const imcenterConsumer_1 = require("../../../queues/consumers/imcenterConsumer");
class ConnectionHandler {
    constructor(props, whatsappService) {
        this.props = props;
        this.whatsappService = whatsappService;
    }
    handleConnectionEvents() {
        this.props.socket.ev.on("connection.update", (update) => __awaiter(this, void 0, void 0, function* () {
            const { connection, lastDisconnect } = update;
            if (connection)
                this.props.socket.ws.emit("connection", { connection: connection });
            switch (connection) {
                case "close":
                    this.handleConnectionClose(lastDisconnect);
                    break;
                case "open":
                    this.handleConnectionOpen();
                    break;
                default:
                    if (update.qr) {
                        yield this.handleQRUpdate(update);
                    }
                    ;
                    break;
            }
        }));
    }
    handleQRUpdate(update) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("QR Code tersedia. Silakan scan! ", this.props.imcenter_id);
                this.props.imcenterService.updateStatus(this.props.imcenter_id, types_1.STATUS_LOGIN.PROSES_LOGIN);
                this.props.imcenterService.updateQRCode(this.props.imcenter_id, update.qr);
                this.props.messageService.saveLog("QR Code tersedia. Silakan scan!", types_1.TIPE_LOG.LOG);
            }
            catch (error) {
                console.error("Gagal update QR Code", error);
                this.props.messageService.saveLog("Gagal update QR Code", types_1.TIPE_LOG.ERROR);
            }
        });
    }
    checkStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const imcenter = yield this.props.imcenterService.getImcenterById(this.props.imcenter_id);
            if (!imcenter) {
                throw new Error("Imcenter not found");
            }
            const connection = this.whatsappService.connectionState.connection;
            if (connection == 'close') {
                this.props.socket.ws.emit("reconnect");
            }
            else if (connection == 'connecting') {
                // return await qrCodeToBase64(imcenter.qr);
            }
            else if (connection == 'open') {
                return null;
            }
        });
    }
    handleConnectionOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check scanner
                const flagScannerValid = yield this.props.imcenterService.checkScannerIsValid(this.props.imcenter_id, (0, whatsapp_1.getSocketNumber)(this.props.socket));
                if (!flagScannerValid) {
                    console.log("Scanner tidak valid, silakan logout");
                    this.logout();
                    this.props.imcenterService.updateQRCode(this.props.imcenter_id, null);
                    this.props.messageService.saveLog("[GAGAL SCAN QR] Nomor Whatsapp tidak cocok dengan yang terdaftar", types_1.TIPE_LOG.LOG);
                    return;
                }
                console.log("Koneksi berhasil dibuka!");
                this.props.imcenterService.updateStatus(this.props.imcenter_id, types_1.STATUS_LOGIN.SUDAH_LOGIN);
                this.props.imcenterService.updateQRCode(this.props.imcenter_id, null);
                this.props.messageService.saveLog("Login Berhasil", types_1.TIPE_LOG.LOG);
                // run consume imcenter consume
                yield (0, imcenterConsumer_1.consumeImcenterSendMessageQueue)(yield this.props.imcenterService.getImcenterById(this.props.imcenter_id));
            }
            catch (error) {
                console.error("Gagal memproses koneksi", error);
                this.props.messageService.saveLog("Gagal memproses koneksi", types_1.TIPE_LOG.ERROR);
            }
        });
    }
    handleConnectionClose(lastDisconnect) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            try {
                const reason = ((_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.toString()) || "Unknown reason";
                console.log(`Koneksi tertutup: ${reason}`);
                // stop consum imcenter
                yield (0, imcenterConsumer_1.stopConsumeImcenterSendMessageQueue)(yield this.props.imcenterService.getImcenterById(this.props.imcenter_id));
                const shouldReconnect = ((_c = (_b = lastDisconnect.error) === null || _b === void 0 ? void 0 : _b.output) === null || _c === void 0 ? void 0 : _c.statusCode) !== baileys_1.DisconnectReason.loggedOut;
                switch ((_e = (_d = lastDisconnect.error) === null || _d === void 0 ? void 0 : _d.output) === null || _e === void 0 ? void 0 : _e.statusCode) {
                    case baileys_1.DisconnectReason.loggedOut:
                        this.props.sessionService.removeSession((0, whatsapp_1.getSocketJid)(this.props.socket));
                        this.props.imcenterService.updateStatus(this.props.imcenter_id, types_1.STATUS_LOGIN.BELUM_LOGIN);
                        break;
                    case baileys_1.DisconnectReason.timedOut:
                        this.props.messageService.saveLog("QR Code telah kedaluwarsa, silakan aktifkan ulang", types_1.TIPE_LOG.LOG);
                        this.props.imcenterService.updateStatus(this.props.imcenter_id, types_1.STATUS_LOGIN.BELUM_LOGIN);
                        break;
                    case baileys_1.DisconnectReason.connectionLost:
                        this.props.messageService.saveLog("Koneksi terputus, silakan coba lagi", types_1.TIPE_LOG.LOG);
                        this.props.socket.ws.emit("reconnect");
                        break;
                    default:
                        if (shouldReconnect) {
                            this.props.socket.ws.emit("reconnect");
                            this.props.imcenterService.updateStatus(this.props.imcenter_id, types_1.STATUS_LOGIN.BELUM_LOGIN);
                        }
                        ;
                        break;
                }
            }
            catch (error) {
                console.error("Gagal memproses koneksi", error);
                this.props.messageService.saveLog("Gagal memproses koneksi", types_1.TIPE_LOG.ERROR);
            }
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.props.socket) {
                    const jid = (0, whatsapp_1.getSocketJid)(this.props.socket);
                    yield this.props.sessionService.removeSession(jid);
                    yield this.props.socket.logout();
                }
            }
            catch (error) {
                console.error("Gagal logout", error);
                this.props.messageService.saveLog("Gagal Logout", types_1.TIPE_LOG.ERROR);
            }
        });
    }
}
exports.ConnectionHandler = ConnectionHandler;
//# sourceMappingURL=connectionHandler.js.map