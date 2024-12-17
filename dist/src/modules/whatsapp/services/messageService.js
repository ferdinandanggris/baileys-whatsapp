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
exports.MessageService = void 0;
const db_1 = require("../../../configs/db");
const imcenterLogs_1 = require("../../../entities/imcenterLogs");
const types_1 = require("../../../entities/types");
const date_1 = require("../../../utils/date");
const typeorm_1 = require("typeorm");
const imcenterRepository_1 = require("../../../repositories/imcenterRepository");
const whatsapp_1 = require("../../../utils/whatsapp");
const resellerRepository_1 = require("../../../repositories/resellerRepository");
const parameterService_1 = __importDefault(require("../../autoResponse/services/parameterService"));
const parameterGriyabayarRepository_1 = __importDefault(require("../../../repositories/parameterGriyabayarRepository"));
const resellerGriyabayarRepository_1 = require("../../../repositories/resellerGriyabayarRepository");
const imcenterLogRepository_1 = require("../../../repositories/imcenterLogRepository");
const inboxGriyabayarRepository_1 = __importDefault(require("../../../repositories/inboxGriyabayarRepository"));
const inboxRepository_1 = __importDefault(require("../../../repositories/inboxRepository"));
class MessageService {
    constructor(whatsappService, imcenter_id) {
        this.whatsappService = whatsappService;
        this.imcenter_id = imcenter_id;
        this.repository = db_1.AppDataSource.getRepository(imcenterLogs_1.ImcenterLogs);
        this.repositories = {
            imcenter: new imcenterRepository_1.ImcenterRepository(),
            reseller: new resellerRepository_1.ResellerRepository(),
            resellerGriyabayar: new resellerGriyabayarRepository_1.ResellerGriyabayarRepository(),
            parameter: new parameterService_1.default(),
            parameterGriyabayar: new parameterGriyabayarRepository_1.default(),
            imcenterLog: new imcenterLogRepository_1.ImcenterLogRepository(),
            inboxGriyabayar: new inboxGriyabayarRepository_1.default(),
            inbox: new inboxRepository_1.default()
        };
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
    createLog(messageLog) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.save(messageLog);
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
    processMessagesFromUpsert(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const message of messages) {
                    const imcenter = yield this.repositories.imcenter.fetchById(this.imcenter_id);
                    if (!imcenter)
                        throw new Error(`imcenter with key "${message.key.remoteJid}" not found.`);
                    var messageText = this.getMessageContent(message);
                    const pengirim = (0, whatsapp_1.jidToNumberPhone)(message.key.remoteJid);
                    yield this.repositories.imcenter.updateActivityById(this.imcenter_id);
                    var idReseller = null, idMerchant = null, kode_reseller = null;
                    var reseller = null;
                    switch (imcenter.griyabayar) {
                        case true:
                            console.log("Griyabayar");
                            const number_phone_local = this.convertInternationalToLocal(pengirim);
                            reseller = yield this.repositories.resellerGriyabayar.findByPhoneNumber(number_phone_local, types_1.TIPE_PENGIRIM.WHATSAPP);
                            var waSetting = yield this.repositories.parameterGriyabayar.findByGroupAndKey(types_1.PARAMETER_GROUP.SETTING, "NomorHp=WhatsApp");
                            if (waSetting != null && waSetting.value == "1") {
                                if (reseller == null) {
                                    reseller = yield this.repositories.resellerGriyabayar.findByPhoneNumber(number_phone_local, types_1.TIPE_PENGIRIM.NOMOR_HP);
                                    if (reseller) {
                                        kode_reseller = reseller.kode;
                                        idReseller = reseller.id_reseller;
                                        idMerchant = reseller.id_merchant;
                                    }
                                }
                            }
                            break;
                        default:
                            console.log("Bukan Griyabayar");
                            reseller = yield this.repositories.reseller.findByPhoneNumber(pengirim, types_1.TIPE_PENGIRIM.WHATSAPP);
                            var waSetting = yield this.repositories.parameter.findByGroupAndKey(types_1.PARAMETER_GROUP.SETTING, "NomorHp=WhatsApp");
                            if (waSetting != null && waSetting.value == "1") {
                                if (reseller == null) {
                                    reseller = yield this.repositories.reseller.findByPhoneNumber(pengirim, types_1.TIPE_PENGIRIM.NOMOR_HP);
                                    if (reseller) {
                                        kode_reseller = reseller.kode;
                                        idReseller = reseller.id_reseller;
                                        idMerchant = reseller.id_merchant;
                                    }
                                }
                            }
                            break;
                    }
                    var imcenterLog = new imcenterLogs_1.ImcenterLogs();
                    imcenterLog.tgl_entri = new Date(),
                        imcenterLog.imcenter_id = this.imcenter_id,
                        imcenterLog.message_id = message.key.id,
                        imcenterLog.pengirim = pengirim,
                        imcenterLog.aplikasi = types_1.TIPE_APLIKASI.NODEJS,
                        imcenterLog.tipe = types_1.TIPE_LOG.INBOX,
                        imcenterLog.keterangan = messageText,
                        imcenterLog.kode_reseller = kode_reseller,
                        imcenterLog.sender_timestamp = (0, date_1.timeToDate)(Number(message.messageTimestamp));
                    if (imcenter.status_login != types_1.STATUS_LOGIN.MENGIRIM_PESAN && imcenter.status_login != types_1.STATUS_LOGIN.SUDAH_LOGIN) {
                        imcenterLog.raw_message = JSON.stringify(message);
                    }
                    else {
                        yield this.saveInboxFromReceipt(message);
                    }
                    yield this.repositories.imcenterLog.create(imcenterLog);
                }
            }
            catch (error) {
                console.error(error);
                throw new Error(error);
            }
        });
    }
    saveInboxFromReceipt(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imcenter = yield this.repositories.imcenter.fetchById(this.imcenter_id);
                if (!imcenter)
                    throw new Error(`imcenter with key "${message.key.remoteJid}" not found.`);
                var messageText = this.getMessageContent(message);
                var { kode_reseller, pengirim, idReseller, idMerchant } = yield this.findResellerByPhone(message, imcenter);
                const listStatusActive = [types_1.STATUS_LOGIN.MENGIRIM_PESAN, types_1.STATUS_LOGIN.SUDAH_LOGIN];
                if (listStatusActive.find(status => status == imcenter.status_login) != null) {
                    console.debug("Imcenter aktif");
                    // set read message
                    this.whatsappService.messageHandler.markAsRead(message.key);
                    if (imcenter.griyabayar) {
                        console.debug("Simpan inbox Griya bayar : ", imcenter.griyabayar);
                        const inboxModel = {
                            kode_reseller: kode_reseller,
                            tgl_entri: new Date(),
                            pengirim: pengirim,
                            penerima: imcenter.username,
                            tipe: types_1.TIPE_PENGIRIM.WHATSAPP,
                            pesan: messageText,
                            status: types_1.STATUS_INBOX.BELUM_DIPROSES,
                            tgl_status: new Date(),
                            id_imcenter: imcenter.id,
                            sender_timestamp: (0, date_1.timeToDate)(Number(message.messageTimestamp)),
                            service_center: "WhatsApp",
                            raw_message: JSON.stringify(message)
                        };
                        yield this.repositories.inboxGriyabayar.createInbox(inboxModel);
                    }
                    else {
                        const inbox_status = types_1.STATUS_INBOX.DIABAIKAN;
                        const inbox = {
                            id_reseller: idReseller,
                            id_merchant: idMerchant,
                            tgl_entri: new Date(),
                            tipe: types_1.TIPE_PENGIRIM.WHATSAPP,
                            pengirim: pengirim,
                            penerima: imcenter.username,
                            pesan: messageText,
                            status: inbox_status,
                            tgl_status: new Date(),
                            id_imcenter: imcenter.id,
                            sender_timestamp: (0, date_1.timeToDate)(Number(message.messageTimestamp)),
                            service_center: "WhatsApp",
                            raw_message: JSON.stringify(message)
                        };
                        yield this.repositories.inbox.createInbox(inbox);
                    }
                }
                else {
                    console.debug("Imcenter belum aktif");
                }
            }
            catch (error) {
                console.error(error);
                throw new Error(error);
            }
        });
    }
    findResellerByPhone(message, imcenter) {
        return __awaiter(this, void 0, void 0, function* () {
            const pengirim = (0, whatsapp_1.jidToNumberPhone)(message.key.remoteJid);
            var idReseller = null, idMerchant = null, kode_reseller = null;
            var reseller = null;
            switch (imcenter.griyabayar) {
                case true:
                    console.log("Griyabayar");
                    const number_phone_local = this.convertInternationalToLocal(pengirim);
                    reseller = yield this.repositories.resellerGriyabayar.findByPhoneNumber(number_phone_local, types_1.TIPE_PENGIRIM.WHATSAPP);
                    var waSetting = yield this.repositories.parameterGriyabayar.findByGroupAndKey(types_1.PARAMETER_GROUP.SETTING, "NomorHp=WhatsApp");
                    if (waSetting != null && waSetting.value == "1") {
                        if (reseller == null) {
                            reseller = yield this.repositories.resellerGriyabayar.findByPhoneNumber(number_phone_local, types_1.TIPE_PENGIRIM.NOMOR_HP);
                            if (reseller) {
                                kode_reseller = reseller.kode;
                                idReseller = reseller.id_reseller;
                                idMerchant = reseller.id_merchant;
                            }
                        }
                    }
                    break;
                default:
                    console.log("Bukan Griyabayar");
                    reseller = yield this.repositories.reseller.findByPhoneNumber(pengirim, types_1.TIPE_PENGIRIM.WHATSAPP);
                    var waSetting = yield this.repositories.parameter.findByGroupAndKey(types_1.PARAMETER_GROUP.SETTING, "NomorHp=WhatsApp");
                    if (waSetting != null && waSetting.value == "1") {
                        if (reseller == null) {
                            reseller = yield this.repositories.reseller.findByPhoneNumber(pengirim, types_1.TIPE_PENGIRIM.NOMOR_HP);
                            if (reseller) {
                                kode_reseller = reseller.kode;
                                idReseller = reseller.id_reseller;
                                idMerchant = reseller.id_merchant;
                            }
                        }
                    }
                    break;
            }
            return { kode_reseller, pengirim, idReseller, idMerchant };
        });
    }
    convertInternationalToLocal(pengirim) {
        if (pengirim.startsWith('62')) {
            pengirim = pengirim.substring(2);
            pengirim = `0${pengirim}`;
        }
        return pengirim;
    }
    getMessageContent(message) {
        var _a, _b, _c;
        var messageText;
        if (((_a = message.message) === null || _a === void 0 ? void 0 : _a.conversation) != null) {
            messageText = message.message.conversation;
        }
        else if (((_c = (_b = message.message) === null || _b === void 0 ? void 0 : _b.extendedTextMessage) === null || _c === void 0 ? void 0 : _c.text) != null) {
            messageText = message.message.extendedTextMessage.text;
        }
        return messageText;
    }
}
exports.MessageService = MessageService;
//# sourceMappingURL=messageService.js.map