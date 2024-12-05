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
const baileys_1 = require("baileys");
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const Db_1 = require("../configs/Db");
const imcenter_1 = require("../entities/imcenter");
const qrcode_1 = __importDefault(require("qrcode"));
const imcenterLogs_1 = require("../entities/imcenterLogs");
class WhatsappService {
    constructor(sessionId, basePath = "sessions") {
        this.imcenterRepository = Db_1.AppDataSource.getRepository(imcenter_1.Imcenter);
        this.imcenterLogRepository = Db_1.AppDataSource.getRepository(imcenterLogs_1.ImcenterLogs);
        this.sessionId = sessionId;
        this.basePath = basePath;
        this.path = (0, path_1.join)(this.basePath, this.sessionId);
    }
    /**
     * Connect ke WhatsApp menggunakan MultiFileAuthState
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            // Tentukan folder untuk setiap instance
            const sessionPath = (0, path_1.join)(this.basePath, this.sessionId);
            // Gunakan useMultiFileAuthState untuk membuat state autentikasi per instance
            const { state, saveCreds } = yield (0, baileys_1.useMultiFileAuthState)(sessionPath);
            this.socket = (0, baileys_1.makeWASocket)({
                auth: state,
                printQRInTerminal: true,
                syncFullHistory: false,
                /** Default timeout for queries, undefined for no timeout */
                defaultQueryTimeoutMs: undefined,
            });
            this.socket.ev.on('connection.update', (update) => {
                this.handleConnectionUpdate(this.path, update);
            });
            this.handleReceiveMessage();
            this.socket.ev.on('creds.update', () => {
                saveCreds();
            });
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.socket) {
                yield this.socket.logout();
                this.socket = null;
            }
        });
    }
    handleReceiveMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket.ev.on('messages.update', (messageInfo) => {
                console.log(messageInfo);
            });
            this.socket.ev.on('messages.upsert', (messageInfoUpsert) => {
                console.log(messageInfoUpsert);
                this.SaveMessages(messageInfoUpsert);
            });
        });
    }
    handleConnectionUpdate(path, update) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { connection, qr, lastDisconnect } = update;
            if (connection === 'close') {
                const error = (_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode;
                if (error === baileys_1.DisconnectReason.loggedOut) {
                    console.log(`Session  logged out. Clearing data.`);
                    fs_1.default.rmSync(path, { recursive: true });
                }
                else if (baileys_1.DisconnectReason.connectionLost) {
                    console.log(`Session  connection lost. Reconnecting...`);
                    this.connect();
                }
                else if (error === baileys_1.DisconnectReason.restartRequired) {
                    console.log(`Session  restart required. Reconnecting...`);
                    this.connect();
                }
                else {
                    console.log(`Session  connection closed due to error ${error}. Reconnecting...`);
                    this.connect();
                }
            }
            if (connection === 'open') {
                this.saveQRCode(null);
                console.log(`Session  connected.`);
            }
            if (qr) {
                console.log(`Generated QR for session :`, qr);
                this.saveQRCode(qr);
            }
        });
    }
    saveQRCode(qr) {
        return __awaiter(this, void 0, void 0, function* () {
            var imcenter = yield this.imcenterRepository.findOneBy({ nomorhp: this.sessionId });
            if (imcenter) {
                if (qr)
                    imcenter.qrcode = yield qrcode_1.default.toDataURL(qr);
                yield this.imcenterRepository.save(imcenter);
            }
        });
    }
    SaveMessages(m) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(JSON.stringify(m.messages));
            console.log('from ', m.messages[0].key.remoteJid);
            // get message latest than data on imcenter_log
            // save to imcenter_log
            const imcenter = yield this.imcenterRepository.findOneBy({ nomorhp: this.sessionId });
            const latestImcenterLog = yield this.imcenterLogRepository.query(`SELECT * FROM imcenter_logs WHERE imcenter_id = ${imcenter.id} ORDER BY id DESC LIMIT 1`);
            if (latestImcenterLog.length > 0) {
                const lastMessageId = latestImcenterLog[0].tgl_entry;
                const messages = m.messages.filter((message) => Number(message.messageTimestamp) > Date.parse(lastMessageId.toUTCString()));
                for (const message of m.messages) {
                    yield this.imcenterLogRepository.save({ imcenter_id: imcenter.id, message_id: message.key.id, log: "log", keterangan: message.message.conversation, pengirim: message.key.remoteJid, raw_message: JSON.stringify(message) });
                }
            }
            else {
                for (const message of m.messages) {
                    yield this.imcenterLogRepository.save({ imcenter_id: imcenter.id, message_id: message.key.id, log: "log", keterangan: message.message.conversation, pengirim: message.key.remoteJid, message: JSON.stringify(message) });
                }
            }
        });
    }
    /**
    * Kirim pesan ke nomor tertentu
    */
    sendMessage(jid, text) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.socket)
                throw new Error("Socket belum terhubung!");
            const message = {
                text
            };
            yield this.socket.sendMessage(jid, message);
            console.log(`[${this.sessionId}] Pesan terkirim ke ${jid}`);
        });
    }
    /**
    * Logout dan hapus sesi
    */
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.socket) {
                yield this.socket.logout();
                console.log(`[${this.sessionId}] Logout berhasil.`);
            }
        });
    }
}
exports.WhatsappService = WhatsappService;
//# sourceMappingURL=whatsappService.js.map