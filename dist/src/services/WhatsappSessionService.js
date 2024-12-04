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
exports.WhatsappSessionService = void 0;
const baileys_1 = require("baileys");
const Db_1 = require("../configs/Db");
const WhatsappSession_1 = require("../entities/WhatsappSession");
const qrcode_1 = __importDefault(require("qrcode"));
const pino_1 = __importDefault(require("pino"));
const fs_1 = __importDefault(require("fs"));
class WhatsappSessionService {
    constructor() {
        this.repository = Db_1.AppDataSource.getRepository(WhatsappSession_1.WhatsappSession);
        this.qrCodes = new Map();
    }
    // Membuat sesi baru
    createSession(nomorhp) {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = (0, pino_1.default)({ timestamp: () => `,"time":"${new Date().toJSON()}"` }, pino_1.default.destination('./wa-logs.txt'));
            // Check pada folder auth_info_baileys
            const { state, saveCreds } = yield (0, baileys_1.useMultiFileAuthState)('auth_info_baileys' + nomorhp); // Cek apakah ada sesi yang tersimpan
            // jika sesi ada maka akan mengembalikan pesan
            if (state.creds) {
                var sock = (0, baileys_1.makeWASocket)({
                    auth: {
                        creds: state.creds,
                        keys: state.keys,
                    },
                    printQRInTerminal: true
                });
                sock.ev.on('connection.update', (update) => {
                    var _a, _b;
                    const { connection, qr, lastDisconnect } = update;
                    if (connection === 'close') {
                        const error = (_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode;
                        if (error === baileys_1.DisconnectReason.loggedOut) {
                            console.log(`Session "${nomorhp}" logged out. Clearing data.`);
                            this.clearSessionData(nomorhp); // Hapus data sesi dari database
                            //remove directory auth_info_baileys + nomorhp
                            fs_1.default.rmdirSync('auth_info_baileys' + nomorhp, { recursive: true });
                            //reconnect
                            this.createSession(nomorhp);
                            // clear from file 'auth_info_baileys'
                        }
                        else if (baileys_1.DisconnectReason.connectionLost) {
                            console.log(`Session "${nomorhp}" connection lost. Reconnecting...`);
                            this.createSession(nomorhp);
                        }
                        else {
                            console.log(`Session "${nomorhp}" connection closed due to error ${error}. Reconnecting...`);
                            this.createSession(nomorhp);
                        }
                    }
                    if (qr) {
                        console.log(`Generated QR for session "${nomorhp}":`, qr);
                        this.qrCodes.set(nomorhp, qr); // Simpan QR baru
                    }
                    if (connection === 'open') {
                        console.log(`Session "${nomorhp}" connected.`);
                        this.qrCodes.delete(nomorhp); // QR berhasil digunakan
                    }
                    sock.ev.on('messages.upsert', (m) => __awaiter(this, void 0, void 0, function* () {
                        console.log(JSON.stringify(m, undefined, 2));
                        console.log(m);
                        console.log('replying to', m.messages[0].key.remoteJid);
                        yield sock.sendMessage(m.messages[0].key.remoteJid, { text: 'Hello there!' });
                    }));
                });
            }
            else {
                var sock = (0, baileys_1.makeWASocket)({
                    auth: {
                        creds: state.creds,
                        keys: state.keys,
                    },
                    printQRInTerminal: true
                });
                sock.ev.on('connection.update', (update) => {
                    var _a, _b;
                    const { connection, qr, lastDisconnect } = update;
                    if (connection === 'close') {
                        const error = (_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode;
                        if (error === baileys_1.DisconnectReason.loggedOut) {
                            console.log(`Session "${nomorhp}" logged out. Clearing data.`);
                            this.clearSessionData(nomorhp); // Hapus data sesi dari database
                            // clear from file 'auth_info_baileys'
                        }
                        else if (baileys_1.DisconnectReason.connectionLost) {
                            console.log(`Session "${nomorhp}" connection lost. Reconnecting...`);
                            this.createSession(nomorhp);
                        }
                        else {
                            console.log(`Session "${nomorhp}" connection closed due to error ${error}. Reconnecting...`);
                            this.createSession(nomorhp);
                        }
                    }
                    if (qr) {
                        console.log(`Generated QR for session "${nomorhp}":`, qr);
                        this.qrCodes.set(nomorhp, qr); // Simpan QR baru
                    }
                    if (connection === 'open') {
                        console.log(`Session "${nomorhp}" connected.`);
                        this.qrCodes.delete(nomorhp); // QR berhasil digunakan
                    }
                });
                sock.ev.on('creds.update', () => __awaiter(this, void 0, void 0, function* () {
                    yield this.saveSessionData(nomorhp, state.creds);
                    saveCreds();
                }));
            }
        });
    }
    // Hapus data sesi jika pengguna logout
    clearSessionData(sessionKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.repository.findOneBy({ sessionKey });
            if (session) {
                session.sessionData = null;
                yield this.repository.save(session);
            }
        });
    }
    // Menyimpan data sesi
    saveSessionData(sessionKey, sessionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.repository.findOneBy({ sessionKey });
            if (session) {
                session.sessionData = sessionData;
                yield this.repository.save(session);
            }
            else {
                yield this.repository.save({ sessionKey, sessionData });
            }
        });
    }
    // Mendapatkan QR Code terbaru
    getQRCode(sessionKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.qrCodes.has(sessionKey)) {
                return yield qrcode_1.default.toDataURL(this.qrCodes.get(sessionKey));
            }
        });
    }
}
exports.WhatsappSessionService = WhatsappSessionService;
//# sourceMappingURL=WhatsappSessionService.js.map