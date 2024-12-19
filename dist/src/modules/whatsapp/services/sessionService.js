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
const db_1 = require("../../../configs/db");
const whatsappSession_1 = require("../../../entities/whatsappSession");
const typeorm_1 = require("typeorm");
const imcenterRepository_1 = require("../../../repositories/imcenterRepository");
const types_1 = require("../../../entities/types");
const imcenterLogRepository_1 = require("../../../repositories/imcenterLogRepository");
class SessionService {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(whatsappSession_1.WhatsappSession);
        this.repositories = {
            imcenter: new imcenterRepository_1.ImcenterRepository(),
            imcenterLog: new imcenterLogRepository_1.ImcenterLogRepository()
        };
    }
    getSession(imcenter_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findOneBy({ imcenter_id });
        });
    }
    saveUpsertSession(imcenter_id, jid, auth) {
        return this.repository.upsert({ imcenter_id, jid, auth }, { conflictPaths: ["imcenter_id"] });
    }
    removeSession(jid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.delete({ jid });
        });
    }
    getSessionByListImcenterId(listImcenterId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.find({ where: { imcenter_id: (0, typeorm_1.In)(listImcenterId) } });
        });
    }
    getAllSession() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.find();
        });
    }
    processUpdateQR(imcenter_id, qrcode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.repositories.imcenter.updateStatus(imcenter_id, types_1.STATUS_LOGIN.PROSES_LOGIN);
                yield this.repositories.imcenter.updateQRCode(imcenter_id, qrcode);
            }
            catch (error) {
                console.error("Gagal update QR Code", error);
                throw new Error(error);
            }
        });
    }
}
exports.default = SessionService;
//# sourceMappingURL=sessionService.js.map