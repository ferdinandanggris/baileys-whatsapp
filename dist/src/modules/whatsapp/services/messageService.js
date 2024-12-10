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
exports.MessageService = void 0;
const db_1 = require("../../../configs/db");
const imcenterLogs_1 = require("../../../entities/imcenterLogs");
class MessageService {
    constructor(imcenter_id) {
        this.imcenter_id = imcenter_id;
        this.repository = db_1.AppDataSource.getRepository(imcenterLogs_1.ImcenterLogs);
    }
    insertData(message_1) {
        return __awaiter(this, arguments, void 0, function* (message, type = "inbox") {
            switch (type) {
                case "inbox":
                    yield this.createInbox(message);
                    break;
                case "outbox":
                    yield this.createOutbox(message);
                    break;
            }
        });
    }
    createInbox(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.repository.save({ imcenter_id: this.imcenter_id, message_id: message.key.id, type: "inbox", keterangan: ((_a = message.message) === null || _a === void 0 ? void 0 : _a.conversation) || null, raw_message: JSON.stringify(message), pengirim: message.key.remoteJid });
        });
    }
    createOutbox(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.repository.save({ imcenter_id: this.imcenter_id, message_id: message.key.id, type: "outbox", keterangan: ((_a = message.message) === null || _a === void 0 ? void 0 : _a.conversation) || null, raw_message: JSON.stringify(message), pengirim: message.key.remoteJid });
        });
    }
    createLog(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.save({ imcenter_id: this.imcenter_id, type: "log", keterangan: message || null });
        });
    }
}
exports.MessageService = MessageService;
//# sourceMappingURL=messageService.js.map