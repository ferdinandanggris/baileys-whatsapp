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
exports.ImCenterService = void 0;
const db_1 = require("../../../configs/db");
const imcenter_1 = require("../../../entities/imcenter");
class ImCenterService {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(imcenter_1.Imcenter);
    }
    createImcenter(number) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingSession = yield this.repository.findOneBy({ nomorhp: number });
            if (existingSession) {
                return `Imcenter with number "${number}" already exists.`;
            }
            yield this.repository.save({ nomorhp: number, aktif: false, standby: false });
        });
    }
    checkScannerIsValid(imcenter_id, nomorhp) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.repository.findOneBy({ id: imcenter_id, nomorhp });
            if (!session) {
                return false;
            }
            return true;
        });
    }
    // Mendapatkan semua sesi
    getAllSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.find();
        });
    }
    // Menghapus sesi
    deleteSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.repository.findOneBy({ id });
            if (!session) {
                throw new Error(`Session with key "${id}" not found.`);
            }
            yield this.repository.delete({ id });
            return `Session "${id}" deleted.`;
        });
    }
    getSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.repository.findOneBy({ id });
            if (!session) {
                throw new Error(`Session with key "${id}" not found.`);
            }
            return session;
        });
    }
    updateQRCode(id, qrcode) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.repository.findOneBy({ id });
            if (!session) {
                throw new Error(`Session with key "${id}" not found.`);
            }
            session.qrcode = qrcode;
            yield this.repository.save(session);
            return `Session "${session.nomorhp}" QR Code updated.`;
        });
    }
    getQRCode(nomorhp) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.repository.findOneBy({ nomorhp });
            if (!session) {
                throw new Error(`Session with key "${nomorhp}" not found.`);
            }
            return session.qrcode;
        });
    }
    getImcenterById(imcenter_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const imcenter = yield this.repository.findOneBy({ id: imcenter_id });
            if (!imcenter) {
                throw new Error(`imcenter with key "${imcenter_id}" not found.`);
            }
            return imcenter;
        });
    }
    updateModeStandby(standby, imcenter_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const imcenter = yield this.repository.findOneBy({ id: imcenter_id });
            if (!imcenter) {
                throw new Error(`Session with key "${imcenter_id}" not found.`);
            }
            imcenter.standby = standby;
            yield this.repository.save(imcenter);
            return `Session "${imcenter_id}" standby mode updated.`;
        });
    }
    getAutoActiveSession() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findBy({ auto_aktif: true });
        });
    }
    updateStatus(imcenter_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const imcenter = yield this.repository.findOneBy({ id: imcenter_id });
            if (!imcenter) {
                throw new Error(`Session with key "${imcenter_id}" not found.`);
            }
            imcenter.status = status;
            yield this.repository.save(imcenter);
            return `Session "${imcenter_id}" status updated.`;
        });
    }
}
exports.ImCenterService = ImCenterService;
//# sourceMappingURL=imcenterService.js.map