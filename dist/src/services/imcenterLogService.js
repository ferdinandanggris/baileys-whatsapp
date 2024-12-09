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
exports.ImcenterLogService = void 0;
const db_1 = require("../configs/db");
const imcenter_1 = require("../entities/imcenter");
const imcenterLogs_1 = require("../entities/imcenterLogs");
const whatsapp_1 = require("../utils/whatsapp");
class ImcenterLogService {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(imcenterLogs_1.ImcenterLogs);
        this.imcenterRepository = db_1.AppDataSource.getRepository(imcenter_1.Imcenter);
    }
    insertData(jid_1, message_1) {
        return __awaiter(this, arguments, void 0, function* (jid, message, type = "inbox") {
            const number = (0, whatsapp_1.jidToNumber)(jid);
            const imcenter = yield this.imcenterRepository.findOneBy({ nomorhp: number });
            if (!imcenter)
                return;
            switch (type) {
                case "inbox":
                    yield this.createInbox(imcenter, message);
                    break;
                case "outbox":
                    yield this.createOutbox(imcenter, message);
                    break;
                case "log":
                    yield this.createLog(imcenter, message);
                    break;
            }
        });
    }
    createInbox(imcenter, message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.repository.save({ imcenter_id: imcenter.id, message_id: message.key.id, type: "inbox", keterangan: ((_a = message.message) === null || _a === void 0 ? void 0 : _a.conversation) || null, raw_message: JSON.stringify(message), pengirim: message.key.remoteJid });
        });
    }
    createOutbox(imcenter, message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.repository.save({ imcenter_id: imcenter.id, message_id: message.key.id, type: "outbox", keterangan: ((_a = message.message) === null || _a === void 0 ? void 0 : _a.conversation) || null, raw_message: JSON.stringify(message), pengirim: message.key.remoteJid });
        });
    }
    createLog(imcenter, message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.repository.save({ imcenter_id: imcenter.id, message_id: message.key.id, type: "inbox", keterangan: ((_a = message.message) === null || _a === void 0 ? void 0 : _a.conversation) || null, raw_message: JSON.stringify(message), pengirim: message.key.remoteJid });
        });
    }
}
exports.ImcenterLogService = ImcenterLogService;
//# sourceMappingURL=imcenterLogService.js.map