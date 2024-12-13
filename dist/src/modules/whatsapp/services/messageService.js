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
const types_1 = require("../../../entities/types");
const date_1 = require("../../../utils/date");
const typeorm_1 = require("typeorm");
class MessageService {
    constructor(imcenter_id) {
        this.imcenter_id = imcenter_id;
        this.repository = db_1.AppDataSource.getRepository(imcenterLogs_1.ImcenterLogs);
    }
    getImcenterId() {
        return this.imcenter_id;
    }
    saveMessage(message, tipe) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const imcenterLog = this.getSkeletonLog();
            imcenterLog.keterangan = (_a = message === null || message === void 0 ? void 0 : message.message) === null || _a === void 0 ? void 0 : _a.conversation;
            imcenterLog.tipe = tipe;
            imcenterLog.pengirim = message.key.remoteJid;
            imcenterLog.message_id = message.key.id;
            imcenterLog.sender_timestamp = (0, date_1.timeToDate)(Number(message.messageTimestamp));
            imcenterLog.raw_message = JSON.stringify(message);
            yield this.repository.save(imcenterLog);
        });
    }
    saveLog(message, tipe) {
        return __awaiter(this, void 0, void 0, function* () {
            const imcenterLog = this.getSkeletonLog();
            imcenterLog.keterangan = message;
            imcenterLog.tipe = tipe;
            yield this.repository.save(imcenterLog);
        });
    }
    getSkeletonLog() {
        const imcenterLog = new imcenterLogs_1.ImcenterLogs();
        imcenterLog.aplikasi = types_1.TIPE_APLIKASI.NODEJS;
        imcenterLog.imcenter_id = this.imcenter_id;
        imcenterLog.tgl_entri = new Date();
        return imcenterLog;
    }
    getMessageByMessageId(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findOneBy({ message_id: messageId });
        });
    }
    updateStatus(messageId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.update({ message_id: messageId }, { status });
        });
    }
    getLatestMessageByImcenter() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findOne({ where: { imcenter_id: this.imcenter_id, sender_timestamp: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) }, order: { sender_timestamp: 'DESC' } });
        });
    }
    saveMultipleMessage(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.save(messages);
        });
    }
}
exports.MessageService = MessageService;
//# sourceMappingURL=messageService.js.map