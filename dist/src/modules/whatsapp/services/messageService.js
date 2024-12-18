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
    saveLog(message, tipe) {
        return __awaiter(this, void 0, void 0, function* () {
            const imcenterLog = new imcenterLogs_1.ImcenterLogs();
            imcenterLog.aplikasi = types_1.TIPE_APLIKASI.NODEJS;
            imcenterLog.imcenter_id = this.imcenter_id;
            imcenterLog.tgl_entri = new Date();
            imcenterLog.keterangan = message;
            imcenterLog.tipe = tipe;
            yield this.repository.save(imcenterLog);
        });
    }
    processMessagesFromUpsert(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            try {
                for (const message of messages) {
                    const flagImageMedia = ((_b = (_a = message.message) === null || _a === void 0 ? void 0 : _a.imageMessage) === null || _b === void 0 ? void 0 : _b.url) != null;
                    const flagValidationIsEditMessage = ((_e = (_d = (_c = message.message) === null || _c === void 0 ? void 0 : _c.editedMessage) === null || _d === void 0 ? void 0 : _d.message) === null || _e === void 0 ? void 0 : _e.protocolMessage) != null && ((_k = (_j = (_h = (_g = (_f = message.message) === null || _f === void 0 ? void 0 : _f.editedMessage) === null || _g === void 0 ? void 0 : _g.message) === null || _h === void 0 ? void 0 : _h.protocolMessage) === null || _j === void 0 ? void 0 : _j.editedMessage) === null || _k === void 0 ? void 0 : _k.conversation) != null && !message.key.fromMe;
                    // compare date message with datenow + 120 seconds
                    const messageTimestamp = Number(message.messageTimestamp);
                    const dateNow = new Date();
                    const messageDate = (0, date_1.timeToDate)(messageTimestamp);
                    // date diff less than 120 seconds
                    if ((dateNow.getTime() - messageDate.getTime()) > 120000) {
                        continue;
                    }
                    switch (true) {
                        // send message extended
                        case (flagImageMedia):
                            yield this.whatsappService.messageHandler.validationImageMessage(message);
                            continue;
                            break;
                        case (flagValidationIsEditMessage):
                            yield this.whatsappService.messageHandler.validationIsEditMessage(message);
                            continue;
                            break;
                        case ((0, whatsapp_1.isFromBroadcast)(message.key.remoteJid) || (0, whatsapp_1.isFromGroup)(message.key.remoteJid) || (0, whatsapp_1.isFromMe)(message)):
                            continue;
                            break;
                    }
                    ;
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
    processMessageOTPSend(otpProps) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imcenter = yield this.repositories.imcenter.fetchById(this.imcenter_id);
                var source = null;
                switch (otpProps.griyabayar) {
                    case true:
                        source = "Griya Bayar";
                    default:
                        source = "Onpay";
                }
                const jid = (0, whatsapp_1.numberToJid)(this.convertLocalToInternational(otpProps.nomorhp));
                const message = `OTP Anda adalah *${otpProps.otp}*, digunakan untuk login ${source}`;
                const { kode_reseller } = yield this.findResellerByPhone(jid, imcenter);
                const payloadMessage = {
                    receiver: (0, whatsapp_1.numberToJid)(otpProps.nomorhp),
                    message: message,
                    raw_message: null,
                    imcenter_id: imcenter.id,
                    kode_reseller: kode_reseller
                };
                yield this.whatsappService.messageHandler.sendMessage(payloadMessage);
            }
            catch (error) {
                console.error(`Gagal mengirim OTP ke ${otpProps.nomorhp}:`, error);
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
                var { kode_reseller, pengirim, idReseller, idMerchant } = yield this.findResellerByPhone(message.key.remoteJid, imcenter);
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
    processMessagesFromHistory(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            try {
                const listMessage = [];
                const latestImcenterLogs = yield this.repositories.imcenterLog.fetchLatest(this.imcenter_id);
                const filterHasConversation = messages.filter(message => { var _a; return ((_a = message.message) === null || _a === void 0 ? void 0 : _a.conversation) != null; });
                const imcenter = yield this.repositories.imcenter.fetchById(this.imcenter_id);
                if (imcenter == null)
                    throw new Error(`Imcenter with id ${this.imcenter_id} not found`);
                for (const message of filterHasConversation) {
                    const messageTimestamp = Number(message.messageTimestamp);
                    const messageDate = (0, date_1.timeToDate)(messageTimestamp);
                    const dateNow = new Date();
                    if (latestImcenterLogs == null || latestImcenterLogs.sender_timestamp.getTime() < messageDate.getTime()) {
                        const flagImageMedia = ((_b = (_a = message.message) === null || _a === void 0 ? void 0 : _a.imageMessage) === null || _b === void 0 ? void 0 : _b.url) != null;
                        const flagValidationIsEditMessage = ((_e = (_d = (_c = message.message) === null || _c === void 0 ? void 0 : _c.editedMessage) === null || _d === void 0 ? void 0 : _d.message) === null || _e === void 0 ? void 0 : _e.protocolMessage) != null && ((_k = (_j = (_h = (_g = (_f = message.message) === null || _f === void 0 ? void 0 : _f.editedMessage) === null || _g === void 0 ? void 0 : _g.message) === null || _h === void 0 ? void 0 : _h.protocolMessage) === null || _j === void 0 ? void 0 : _j.editedMessage) === null || _k === void 0 ? void 0 : _k.conversation) != null && !message.key.fromMe;
                        // is image message
                        if ((dateNow.getTime() - messageDate.getTime()) > 120000) {
                            switch (true) {
                                // send message extended
                                case (flagImageMedia):
                                    yield this.whatsappService.messageHandler.validationImageMessage(message);
                                    continue;
                                case (flagValidationIsEditMessage):
                                    yield this.whatsappService.messageHandler.validationIsEditMessage(message);
                                    continue;
                                case ((0, whatsapp_1.isFromBroadcast)(message.key.remoteJid) || (0, whatsapp_1.isFromGroup)(message.key.remoteJid) || (0, whatsapp_1.isFromMe)(message)):
                                    continue;
                            }
                        }
                        const messageText = this.getMessageContent(message);
                        const { kode_reseller, pengirim } = yield this.findResellerByPhone(message.key.remoteJid, imcenter);
                        var imcenterLog = new imcenterLogs_1.ImcenterLogs();
                        imcenterLog.tgl_entri = new Date();
                        imcenterLog.imcenter_id = this.imcenter_id;
                        imcenterLog.message_id = message.key.id;
                        imcenterLog.pengirim = pengirim;
                        imcenterLog.aplikasi = types_1.TIPE_APLIKASI.NODEJS;
                        imcenterLog.tipe = types_1.TIPE_LOG.INBOX;
                        imcenterLog.keterangan = messageText;
                        imcenterLog.kode_reseller = kode_reseller;
                        imcenterLog.sender_timestamp = (0, date_1.timeToDate)(Number(message.messageTimestamp));
                        if (message.key.fromMe) {
                            imcenterLog.status = types_1.STATUS_LOG.DIBACA;
                        }
                        else {
                            imcenterLog.raw_message = JSON.stringify(message);
                        }
                        listMessage.push(imcenterLog);
                    }
                }
                if (listMessage.length > 0)
                    yield this.repositories.imcenterLog.saveMultiple(listMessage);
                // handle expired inbox
                yield this.handleExpiredMessage();
            }
            catch (error) {
                console.error(error);
                throw new Error(error);
            }
        });
    }
    handleExpiredMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            const expiredMessage = yield this.repositories.imcenterLog.fetchExpired(this.imcenter_id);
            if (expiredMessage.length > 0) {
                console.debug("Expired inbox found : ", expiredMessage.length);
                const imcenter = yield this.repositories.imcenter.fetchById(this.imcenter_id);
                if (imcenter == null)
                    throw new Error(`Imcenter with id ${this.imcenter_id} not found`);
                for (const message of expiredMessage) {
                    switch (imcenter.griyabayar) {
                        case true:
                            var inboxGriyabayar = {
                                tgl_entri: new Date(),
                                pengirim: message.pengirim,
                                penerima: imcenter.username,
                                tipe: types_1.TIPE_PENGIRIM.WHATSAPP,
                                pesan: message.keterangan,
                                status: types_1.STATUS_INBOX.BELUM_DIPROSES,
                                tgl_status: new Date(),
                                id_imcenter: imcenter.id,
                                sender_timestamp: message.sender_timestamp,
                                service_center: "WhatsApp",
                                kode_reseller: message.kode_reseller,
                                raw_message: message.raw_message
                            };
                            yield this.repositories.inboxGriyabayar.createInbox(inboxGriyabayar);
                        case false:
                            var inbox = {
                                tgl_entri: new Date(),
                                pengirim: message.pengirim,
                                penerima: imcenter.username,
                                tipe: types_1.TIPE_PENGIRIM.WHATSAPP,
                                pesan: message.keterangan,
                                status: types_1.STATUS_INBOX.DIABAIKAN,
                                tgl_status: new Date(),
                                id_imcenter: imcenter.id,
                                sender_timestamp: message.sender_timestamp,
                                service_center: "WhatsApp",
                                raw_message: message.raw_message
                            };
                            yield this.repositories.inbox.createInbox(inbox);
                    }
                    yield this.repositories.imcenterLog.removeRawMessage(message.message_id);
                    yield this.whatsappService.messageHandler.markAsRead({ id: message.message_id });
                }
            }
        });
    }
    processMessageMarkAsRead(message_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repositories.imcenterLog.updateStatus(message_id, types_1.STATUS_LOG.DIBACA);
        });
    }
    processMessageUpdateReceipt(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const message of msg) {
                    const imcenterLog = yield this.repositories.imcenterLog.fetchByMessageId(message.key.id);
                    if (imcenterLog) {
                        yield this.repositories.imcenterLog.updateStatus(message.key.id, types_1.STATUS_LOG.DIBACA);
                    }
                }
            }
            catch (error) {
                console.error(error);
                throw new Error(error);
            }
        });
    }
    processMessageSend(response, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imcenterLog = {
                    aplikasi: types_1.TIPE_APLIKASI.NODEJS,
                    imcenter_id: this.imcenter_id,
                    tgl_entri: new Date(),
                    keterangan: response.message.conversation,
                    tipe: types_1.TIPE_LOG.OUTBOX,
                    pengirim: response.key.remoteJid,
                    message_id: response.key.id,
                    sender_timestamp: (0, date_1.timeToDate)(Number(response.messageTimestamp)),
                    raw_message: JSON.stringify(response),
                    kode_reseller: message.kode_reseller
                };
                yield this.repositories.imcenterLog.create(imcenterLog);
            }
            catch (error) {
                console.error(error);
                throw new Error(error);
            }
        });
    }
    findResellerByPhone(jid, imcenter) {
        return __awaiter(this, void 0, void 0, function* () {
            const pengirim = (0, whatsapp_1.jidToNumberPhone)(jid);
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
    convertLocalToInternational(pengirim) {
        if (pengirim.startsWith('0')) {
            pengirim = pengirim.substring(1);
            pengirim = `62${pengirim}`;
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