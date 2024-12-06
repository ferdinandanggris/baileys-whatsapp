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
const db_1 = require("../configs/db");
const imcenter_1 = require("../entities/imcenter");
const qrcode_1 = __importDefault(require("qrcode"));
const imcenterLogs_1 = require("../entities/imcenterLogs");
const date_1 = require("../utils/date");
const whatsappSession_1 = require("../entities/whatsappSession");
class WhatsappService {
    constructor(sessionId, basePath = "sessions") {
        this.imcenterRepository = db_1.AppDataSource.getRepository(imcenter_1.Imcenter);
        this.imcenterLogRepository = db_1.AppDataSource.getRepository(imcenterLogs_1.ImcenterLogs);
        this.whatsappSessionRepository = db_1.AppDataSource.getRepository(whatsappSession_1.WhatsappSession);
        this.sessionId = sessionId;
        this.basePath = basePath;
        this.path = (0, path_1.join)(this.basePath, this.sessionId);
    }
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
                    this.imcenterRepository.update({ nomorhp: this.sessionId }, { qrcode: null, standby: false, aktif: false });
                    this.whatsappSessionRepository.delete({ nomorhp: this.sessionId });
                }
                else if (baileys_1.DisconnectReason.connectionLost) {
                    console.log(`Session  connection lost. Reconnecting...`);
                    this.imcenterRepository.update({ nomorhp: this.sessionId }, { standby: false, aktif: false });
                    this.whatsappSessionRepository.delete({ nomorhp: this.sessionId });
                    this.connect();
                }
                else if (error === baileys_1.DisconnectReason.restartRequired) {
                    console.log(`Session  restart required. Reconnecting...`);
                    this.imcenterRepository.update({ nomorhp: this.sessionId }, { standby: false, aktif: false });
                    this.whatsappSessionRepository.delete({ nomorhp: this.sessionId });
                    this.connect();
                }
                else {
                    console.log(`Session  connection closed due to error ${error}. Reconnecting...`);
                    this.imcenterRepository.update({ nomorhp: this.sessionId }, { standby: false, aktif: false });
                    this.whatsappSessionRepository.delete({ nomorhp: this.sessionId });
                    this.connect();
                }
            }
            if (connection === 'open') {
                this.saveQRCode(null);
                this.imcenterRepository.update({ nomorhp: this.sessionId }, { standby: true, aktif: true });
                const getSession = yield this.whatsappSessionRepository.findOneBy({ nomorhp: this.sessionId });
                if (!getSession) {
                    this.whatsappSessionRepository.save({ nomorhp: this.sessionId, sessionCred: this.socket.authState.creds, sessionKey: this.socket.authState.keys });
                }
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
    getQRCode() {
        return __awaiter(this, void 0, void 0, function* () {
            var imcenter = yield this.imcenterRepository.findOneBy({ nomorhp: this.sessionId });
            return imcenter.qrcode;
        });
    }
    SaveMessages(m) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            console.log(JSON.stringify(m.messages));
            // get message latest than data on imcenter_log
            const imcenter = yield this.imcenterRepository.findOneBy({ nomorhp: this.sessionId });
            const latestImcenterLog = yield this.imcenterLogRepository.query(`SELECT * FROM imcenter_logs WHERE imcenter_id = ${imcenter.id} ORDER BY id DESC LIMIT 1`);
            if (latestImcenterLog.length > 0) {
                const lastMessageId = latestImcenterLog[0].tgl_entry;
                const messages = m.messages.filter((message) => {
                    const date = (0, date_1.timeToDate)(Number(message.messageTimestamp));
                    if (date > lastMessageId)
                        return message;
                });
                for (const message of messages) {
                    if (message.key.fromMe || !((_a = message.key.remoteJid) === null || _a === void 0 ? void 0 : _a.endsWith("@s.whatsapp.net")))
                        continue;
                    // this.sendMessage(message.key.remoteJid, "Pesan telah diterima");
                    const imcenterLog = new imcenterLogs_1.ImcenterLogs();
                    imcenterLog.imcenter_id = imcenter.id;
                    imcenterLog.message_id = message.key.id;
                    imcenterLog.type = "inbox";
                    imcenterLog.keterangan = (_b = message.message) === null || _b === void 0 ? void 0 : _b.conversation;
                    imcenterLog.pengirim = message.key.remoteJid;
                    imcenterLog.tgl_entry = (0, date_1.timeToDate)(Number(message.messageTimestamp));
                    imcenterLog.status = "Diterima";
                    imcenterLog.raw_message = JSON.stringify({ key: message.key, message: message.message });
                    yield this.imcenterLogRepository.save(imcenterLog);
                }
            }
            else {
                for (const message of m.messages) {
                    if (message.key.fromMe || ((_c = message.key.remoteJid) === null || _c === void 0 ? void 0 : _c.endsWith("@s.whatsapp.net")))
                        continue;
                    // this.sendMessage(message.key.remoteJid, "Pesan telah diterima");
                    const imcenterLog = new imcenterLogs_1.ImcenterLogs();
                    imcenterLog.imcenter_id = imcenter.id;
                    imcenterLog.message_id = message.key.id;
                    imcenterLog.type = "inbox";
                    imcenterLog.keterangan = (_d = message.message) === null || _d === void 0 ? void 0 : _d.conversation;
                    imcenterLog.pengirim = message.key.remoteJid;
                    imcenterLog.tgl_entry = (0, date_1.timeToDate)(Number(message.messageTimestamp));
                    imcenterLog.status = "Diterima";
                    imcenterLog.raw_message = JSON.stringify({ key: message.key, message: message.message });
                    yield this.imcenterLogRepository.save(imcenterLog);
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
            jid = jid.includes('@') ? jid : `${jid}@s.whatsapp.net`;
            var response = yield this.socket.sendMessage(jid, { text: text });
            console.log(`[${this.sessionId}] Pesan terkirim ke ${jid}`);
        });
    }
    broadcastMessage(jids, messageContent) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const jid of jids) {
                try {
                    var jid_ = jid.includes('@') ? jid : `${jid}@s.whatsapp.net`;
                    yield this.socket.sendMessage(jid_, messageContent);
                    console.log(`Pesan terkirim ke ${jid}`);
                }
                catch (error) {
                    console.error(`Gagal mengirim pesan ke ${jid}:`, error);
                }
                // Tambahkan jeda untuk menghindari pemblokiran akun
                yield new Promise((resolve) => setTimeout(resolve, 1000)); // Jeda 1 detik
            }
        });
    }
    ;
    /**
    * Logout dan hapus sesi
    */
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.socket) {
                yield this.socket.logout();
                this.imcenterRepository.update({ nomorhp: this.sessionId }, { qrcode: null, standby: false, aktif: false });
                console.log(`[${this.sessionId}] Logout berhasil.`);
            }
        });
    }
    updateModeStandby(standby) {
        return __awaiter(this, void 0, void 0, function* () {
            const imcenter = yield this.imcenterRepository.findOneBy({ nomorhp: this.sessionId });
            if (imcenter) {
                imcenter.standby = standby;
                yield this.imcenterRepository.save(imcenter);
            }
        });
    }
}
exports.WhatsappService = WhatsappService;
//# sourceMappingURL=whatsappService.js.map