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
const whatsapp_1 = require("../../../utils/whatsapp");
class SessionService {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(whatsappSession_1.WhatsappSession);
    }
    saveSession(nomorhp, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            const jid = (0, whatsapp_1.numberToJid)(nomorhp);
            const whatsappSession = yield this.repository.findOneBy({ jid });
            if (!whatsappSession) {
                this.repository.save({ jid: jid, });
            }
        });
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
            this.repository.delete({ jid });
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
}
exports.default = SessionService;
//# sourceMappingURL=sessionService.js.map