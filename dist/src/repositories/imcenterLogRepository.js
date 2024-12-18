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
exports.ImcenterLogRepository = void 0;
const typeorm_1 = require("typeorm");
const db_1 = require("../configs/db");
const imcenterLogs_1 = require("../entities/imcenterLogs");
class ImcenterLogRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(imcenterLogs_1.ImcenterLogs);
    }
    create(imcenterLog) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.save(imcenterLog);
        });
    }
    fetchLatest(imcenter_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findOne({ where: { imcenter_id: imcenter_id, sender_timestamp: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) }, order: { sender_timestamp: 'DESC' } });
        });
    }
    saveMultiple(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.save(messages);
        });
    }
    updateStatus(messageId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.update({ message_id: messageId }, { status });
        });
    }
    fetchByMessageId(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findOne({ where: { message_id: messageId } });
        });
    }
    fetchExpired(imcenter_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.find({ where: { raw_message: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()), imcenter_id } });
        });
    }
    removeRawMessage(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.update({ message_id: messageId }, { raw_message: null });
        });
    }
}
exports.ImcenterLogRepository = ImcenterLogRepository;
//# sourceMappingURL=imcenterLogRepository.js.map