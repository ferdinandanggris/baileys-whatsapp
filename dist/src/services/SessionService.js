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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const baileys_1 = __importStar(require("baileys"));
const WhatsappSession_1 = require("../entities/WhatsappSession");
const Db_1 = require("../configs/Db");
class SessionService {
    constructor() {
        this.repository = Db_1.AppDataSource.getRepository(WhatsappSession_1.WhatsappSession);
        this.qrCodes = new Map();
    }
    createSession(sessionKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingSession = yield this.repository.findOneBy({ sessionKey });
            const { state, saveCreds } = yield (0, baileys_1.useMultiFileAuthState)(`./auth/${sessionKey}`);
            if (existingSession === null || existingSession === void 0 ? void 0 : existingSession.sessionData) {
                // state.creds = existingSession.sessionData; // Memuat sesi dari database
            }
            const sock = (0, baileys_1.default)({
                auth: state,
            });
            sock.ev.on('creds.update', () => __awaiter(this, void 0, void 0, function* () {
                yield this.saveSessionData(sessionKey, state.creds);
            }));
            sock.ev.on('connection.update', (update) => {
                var _a, _b;
                const { connection, qr, lastDisconnect } = update;
                if (connection === 'close') {
                    const error = (_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode;
                    if (error === baileys_1.DisconnectReason.loggedOut) {
                        console.log(`Session "${sessionKey}" logged out. Clearing data.`);
                        this.clearSessionData(sessionKey); // Hapus data sesi dari database
                    }
                    else {
                        console.log(`Reconnecting session "${sessionKey}"...`);
                        this.createSession(sessionKey); // Coba rekoneksi
                    }
                }
                if (qr) {
                    console.log(`Generated QR for session "${sessionKey}":`, qr);
                    this.qrCodes.set(sessionKey, qr); // Simpan QR baru
                }
                if (connection === 'open') {
                    console.log(`Session "${sessionKey}" connected.`);
                    this.qrCodes.delete(sessionKey); // QR berhasil digunakan
                }
            });
            return existingSession ? `Session "${sessionKey}" reloaded.` : `Session "${sessionKey}" created.`;
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
    // Menyimpan data sesi ke database
    saveSessionData(sessionKey, sessionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.repository.findOneBy({ sessionKey });
            if (session) {
                session.sessionData = sessionData;
                yield this.repository.save(session);
            }
        });
    }
    // Mendapatkan semua sesi
    getAllSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.find();
        });
    }
    // Menghapus sesi
    deleteSession(sessionKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.repository.findOneBy({ sessionKey });
            if (!session) {
                throw new Error(`Session with key "${sessionKey}" not found.`);
            }
            yield this.repository.delete({ sessionKey });
            return `Session "${sessionKey}" deleted.`;
        });
    }
}
exports.SessionService = SessionService;
//# sourceMappingURL=SessionService.js.map