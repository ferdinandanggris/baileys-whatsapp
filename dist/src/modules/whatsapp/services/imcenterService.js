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
exports.ImCenterService = void 0;
const db_1 = require("../../../configs/db");
const imcenter_1 = __importDefault(require("../../../entities/imcenter"));
const types_1 = require("../../../entities/types");
class ImCenterService {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(imcenter_1.default);
    }
    queryAdditionalForWhatsappNodejs(query) {
        return query.where('tipe = :whatsapp AND aplikasi = :nodejs', { whatsapp: types_1.IMCENTER_TYPE.WHATSAPP, nodejs: types_1.TIPE_APLIKASI.NODEJS });
    }
    createImcenter(numberPhone) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingSession = yield this.repository.findOneBy({ username: numberPhone });
            if (existingSession) {
                return `Imcenter with numberPhone "${numberPhone}" already exists.`;
            }
            yield this.repository.save({ username: numberPhone, aktif: false, standby: false });
        });
    }
    checkScannerIsValid(imcenter_id, numberPhone) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.repository.findOneBy({ id: imcenter_id, username: numberPhone });
            if (!session) {
                return false;
            }
            return true;
        });
    }
    getAllSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.queryAdditionalForWhatsappNodejs(this.repository.createQueryBuilder('imcenter')).getMany();
        });
    }
    getImcenterByJID(jid) {
        return __awaiter(this, void 0, void 0, function* () {
            const imcenter = yield this.repository.findOneBy({ im_jid: jid });
            if (!imcenter) {
                throw new Error(`imcenter with key "${jid}" not found.`);
            }
            return imcenter;
        });
    }
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
            session.qr = qrcode;
            yield this.repository.save(session);
            return `Session "${session.username}" QR Code updated.`;
        });
    }
    updateActivity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const imcenter = yield this.repository.findOneBy({ id });
            if (!imcenter) {
                return false;
            }
            imcenter.tgl_aktivitas = new Date();
            yield this.repository.save(imcenter);
            return true;
        });
    }
    getQRCode(numberPhone) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.repository.findOneBy({ username: numberPhone });
            if (!session) {
                throw new Error(`Session with key "${numberPhone}" not found.`);
            }
            return session.qr;
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
    getImcenterByNumberPhone(numberPhone) {
        return __awaiter(this, void 0, void 0, function* () {
            const imcenter = yield this.repository.findOneBy({ username: numberPhone });
            if (!imcenter) {
                throw new Error(`imcenter with key "${numberPhone}" not found.`);
            }
            return imcenter;
        });
    }
    getAutoActiveSession() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findBy({ aktif: true });
        });
    }
    getNotHaveLoginStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.queryAdditionalForWhatsappNodejs(this.repository.createQueryBuilder('imcenter'))
                .andWhere('status_login != :status', { status }).getMany();
        });
    }
    updateStatus(imcenter_id, status_login) {
        return __awaiter(this, void 0, void 0, function* () {
            const imcenter = yield this.repository.findOneBy({ id: imcenter_id });
            if (!imcenter) {
                throw new Error(`Session with key "${imcenter_id}" not found.`);
            }
            imcenter.status_login = status_login;
            yield this.repository.save(imcenter);
            return `Session "${imcenter_id}" status updated.`;
        });
    }
    fetchImcenterHasLoginAndIsGriyabayar(griyabayar) {
        return __awaiter(this, void 0, void 0, function* () {
            const imcenter = yield this.repository.findBy({ griyabayar, status_login: types_1.STATUS_LOGIN.SUDAH_LOGIN });
            if (!imcenter) {
                throw new Error(`imcenter with key "${griyabayar}" not found.`);
            }
            return imcenter;
        });
    }
}
exports.ImCenterService = ImCenterService;
//# sourceMappingURL=imcenterService.js.map