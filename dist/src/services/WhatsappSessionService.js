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
exports.WhatsappSessionService = void 0;
const db_1 = require("../configs/db");
const whatsappSession_1 = require("../entities/whatsappSession");
const imcenterService_1 = require("./imcenterService");
const typeorm_1 = require("typeorm");
const imcenter_1 = require("../entities/imcenter");
const instanceManager = require("./instanceManagerService");
class WhatsappSessionService {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(whatsappSession_1.WhatsappSession);
        this.imcenterRepository = db_1.AppDataSource.getRepository(imcenter_1.Imcenter);
    }
    // Membuat sesi baru
    createSession(nomorhp) {
        return __awaiter(this, void 0, void 0, function* () {
            // const socket : WhatsappService = instanceManager.getInstance(nomorhp);
            // socket.connect();
        });
    }
    // remove data sesi jika pengguna logout
    removeSession(nomorhp) {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = instanceManager.getInstance(nomorhp);
            socket.disconnect();
            const session = yield this.repository.findOneBy({ nomorhp });
            if (session) {
                yield this.repository.delete({ nomorhp });
            }
        });
    }
    updateModeStandby(standby, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const imcenter = yield this.imcenterRepository.findOneBy({ nomorhp: sessionId });
            if (imcenter) {
                imcenter.standby = standby;
                yield this.imcenterRepository.save(imcenter);
            }
        });
    }
    // Mendapatkan QR Code terbaru
    getQRCode(sessionKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const imcenter = yield this.imcenterRepository.findOneBy({ nomorhp: sessionKey });
            if (!imcenter) {
                throw new Error(`Imcenter with key "${sessionKey}" not found.`);
            }
            return imcenter.qrcode;
        });
    }
    // Ambil sesi auto aktif dan cek apakah sesi masih aktif, jika tidak ubah status standby jadi false dan sebaliknya
    checkAutoActiveSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            const imcentersService = new imcenterService_1.ImCenterService();
            const imcenters = yield imcentersService.getAutoActiveSession();
            const sessions = yield this.repository.find({ where: { nomorhp: (0, typeorm_1.In)(imcenters.map(imcenter => imcenter.nomorhp)) } });
            for (const session of sessions) {
                const socket = instanceManager.getInstance(session.nomorhp);
                socket.connect();
            }
        });
    }
    sendMessage(sessionId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = instanceManager.getInstance(sessionId);
            return socket.sendMessage(sessionId, message);
        });
    }
}
exports.WhatsappSessionService = WhatsappSessionService;
//# sourceMappingURL=whatsappSessionService.js.map