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
exports.MessageHandler = void 0;
const whatsapp_1 = require("../../../utils/whatsapp");
const types_1 = require("../../../entities/types");
const parameterService_1 = __importDefault(require("../../autoResponse/services/parameterService"));
const date_1 = require("../../../utils/date");
const resellerService_1 = __importDefault(require("../../reseller/resellerService"));
const imcenterLogs_1 = require("../../../entities/imcenterLogs");
const inboxService_1 = __importDefault(require("../../griyabayar/services/inboxService"));
class MessageHandler {
    constructor(props) {
        this.props = props;
        this.parameterService = new parameterService_1.default();
        this.resellerService = new resellerService_1.default();
        this.inboxService = new inboxService_1.default();
        this.socket = props.socket;
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jid = (0, whatsapp_1.numberToJid)(message.receiver);
                var messageSend;
                if (message.raw_message != null) {
                    var msg = JSON.parse(message.raw_message);
                    messageSend = {
                        text: message.message,
                        contextInfo: {
                            stanzaId: msg.key.id,
                            participant: msg.key.remoteJid,
                            quotedMessage: msg.message
                        }
                    };
                }
                else {
                    messageSend = {
                        text: message.message
                    };
                    message.raw_message = JSON.stringify(messageSend);
                }
                const response = yield this.socket.sendMessage(jid, messageSend);
                yield this.props.messageService.saveMessage(response, types_1.TIPE_LOG.OUTBOX);
                console.log(`Pesan terkirim ke ${jid}: ${message.message}`);
            }
            catch (error) {
                console.error(`Gagal mengirim pesan ke ${message.receiver}:`, error);
                this.props.messageService.saveLog(`Gagal mengirim pesan ke ${message.receiver}`, types_1.TIPE_LOG.ERROR);
            }
        });
    }
    listenForMessages() {
        this.socket.ev.on("messages.upsert", (msg) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            for (const message of msg.messages) {
                const jid = message.key.remoteJid;
                const content = ((_a = message.message) === null || _a === void 0 ? void 0 : _a.conversation) || "Pesan tidak memiliki teks";
                console.log(`Pesan diterima dari ${jid}: ${content}`);
            }
            const imcenterLogs = yield this.inboxValidation(msg.messages);
            // if (imcenterLogs.length > 0) await this.props.messageService.saveMultipleMessage(imcenterLogs);
        }));
        this.socket.ev.on("messaging-history.set", (msg) => __awaiter(this, void 0, void 0, function* () {
            const imcenterLogs = yield this.inboxValidation(msg.messages);
            // if (imcenterLogs.length > 0) await this.props.messageService.saveMultipleMessage(imcenterLogs);
        }));
    }
    validationImageMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const jid = message.key.remoteJid;
            if ((0, whatsapp_1.isFromBroadcast)(jid) || (0, whatsapp_1.isFromGroup)(jid) || (0, whatsapp_1.isFromMe)(message)) {
                return;
            }
            // set read message
            yield this.markAsRead(message.key);
            // compare date message with datenow + 120 seconds
            const messageTimestamp = Number(message.messageTimestamp);
            const dateNow = new Date();
            const messageDate = (0, date_1.timeToDate)(messageTimestamp);
            // date diff less than 120 seconds
            if ((dateNow.getTime() - messageDate.getTime()) > 120000) {
                return;
            }
            this.sendMessage({
                receiver: message.key.remoteJid,
                message: "Pesan ini berisi gambar, mohon maaf kami tidak bisa menerima pesan berupa gambar.",
                raw_message: JSON.stringify(message)
            });
        });
    }
    validationIsEditMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            // compare date message with datenow + 120 seconds
            const messageTimestamp = Number(message.messageTimestamp);
            const dateNow = new Date();
            const messageDate = (0, date_1.timeToDate)(messageTimestamp);
            // date diff less than 120 seconds
            if ((dateNow.getTime() - messageDate.getTime()) > 120000) {
                return;
            }
            yield this.sendMessage({
                receiver: message.key.remoteJid,
                message: `Pesan "${(_e = (_d = (_c = (_b = (_a = message.message) === null || _a === void 0 ? void 0 : _a.editedMessage) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.protocolMessage) === null || _d === void 0 ? void 0 : _d.editedMessage) === null || _e === void 0 ? void 0 : _e.conversation}" TIDAK DIPROSES. Edit Pesan tidak diizinkan.`,
                raw_message: JSON.stringify(message)
            });
        });
    }
    inboxValidation(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            for (const message of messages) {
                const flagImageMedia = ((_b = (_a = message.message) === null || _a === void 0 ? void 0 : _a.imageMessage) === null || _b === void 0 ? void 0 : _b.url) != null;
                const flagValidationIsEditMessage = ((_e = (_d = (_c = message.message) === null || _c === void 0 ? void 0 : _c.editedMessage) === null || _d === void 0 ? void 0 : _d.message) === null || _e === void 0 ? void 0 : _e.protocolMessage) != null && ((_k = (_j = (_h = (_g = (_f = message.message) === null || _f === void 0 ? void 0 : _f.editedMessage) === null || _g === void 0 ? void 0 : _g.message) === null || _h === void 0 ? void 0 : _h.protocolMessage) === null || _j === void 0 ? void 0 : _j.editedMessage) === null || _k === void 0 ? void 0 : _k.conversation) != null && !message.key.fromMe;
                // is image message
                switch (true) {
                    // send message extended
                    case (flagImageMedia):
                        yield this.validationImageMessage(message);
                        continue;
                        break;
                    case (flagValidationIsEditMessage):
                        yield this.validationIsEditMessage(message);
                        continue;
                        break;
                    case ((0, whatsapp_1.isFromBroadcast)(message.key.remoteJid) || (0, whatsapp_1.isFromGroup)(message.key.remoteJid) || (0, whatsapp_1.isFromMe)(message)):
                        continue;
                        break;
                }
                // save to imcenter_logs
                yield this.saveImcenterLogs(message);
                // save to inbox / inbox griya bayar
                yield this.saveInbox(message);
            }
        });
    }
    saveInbox(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const imcenter = yield this.props.imcenterService.getImcenterById(this.props.imcenter_id);
                if (!imcenter)
                    throw new Error(`imcenter with key "${message.key.remoteJid}" not found.`);
                var messageText;
                if (((_a = message.message) === null || _a === void 0 ? void 0 : _a.conversation) != null) {
                    messageText = message.message.conversation;
                }
                else if (((_c = (_b = message.message) === null || _b === void 0 ? void 0 : _b.extendedTextMessage) === null || _c === void 0 ? void 0 : _c.text) != null) {
                    messageText = message.message.extendedTextMessage.text;
                }
                const pengirim = (0, whatsapp_1.jidToNumber)(message.key.remoteJid);
                var kode_reseller = null;
                var idReseller, idMerchant = null;
                if (!pengirim)
                    throw new Error(`Pengirim tidak ditemukan`);
                yield this.props.imcenterService.updateActivity(this.props.imcenter_id);
                const reseller = yield this.resellerService.findByPhoneNumber(pengirim, imcenter.griyabayar, types_1.TIPE_PENGIRIM.WHATSAPP);
                if (reseller == null) {
                    const waSetting = yield this.parameterService.findByGroupAndKey(types_1.PARAMETER_GROUP.SETTING, "NomorHp=WhatsApp", imcenter.griyabayar);
                    if (waSetting != null && waSetting.value == "1") {
                        const reseller = yield this.resellerService.findByPhoneNumber(pengirim, imcenter.griyabayar, types_1.TIPE_PENGIRIM.NOMOR_HP);
                        if (reseller) {
                            kode_reseller = reseller.kode;
                            idReseller = reseller.id;
                            idMerchant = reseller.id_merchant;
                        }
                    }
                }
                else {
                    kode_reseller = reseller.kode;
                    idReseller = reseller.id;
                    idMerchant = reseller.id_merchant;
                }
                const listStatusActive = [types_1.STATUS_LOGIN.MENGIRIM_PESAN, types_1.STATUS_LOGIN.SUDAH_LOGIN];
                if (listStatusActive.find(status => status == imcenter.status_login) != null) {
                    console.debug("Imcenter tidak aktif");
                    // set read message
                    yield this.markAsRead(message.key);
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
                        yield this.inboxService.createInbox(inboxModel);
                    }
                    else {
                        const inboxStatus = types_1.STATUS_INBOX.BELUM_DIPROSES;
                    }
                }
                else {
                    console.debug("Imcenter aktif");
                }
            }
            catch (error) {
                console.error(`Gagal menyimpan pesan dari ${message.key.remoteJid}:`, error);
                this.props.messageService.saveLog(`Gagal menyimpan pesan dari ${message.key.remoteJid}`, types_1.TIPE_LOG.ERROR);
            }
        });
    }
    saveImcenterLogs(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const imcenter = yield this.props.imcenterService.getImcenterById(this.props.imcenter_id);
                if (!imcenter)
                    throw new Error(`imcenter with key "${message.key.remoteJid}" not found.`);
                var messageText;
                if (((_a = message.message) === null || _a === void 0 ? void 0 : _a.conversation) != null) {
                    messageText = message.message.conversation;
                }
                else if (((_c = (_b = message.message) === null || _b === void 0 ? void 0 : _b.extendedTextMessage) === null || _c === void 0 ? void 0 : _c.text) != null) {
                    messageText = message.message.extendedTextMessage.text;
                }
                const pengirim = (0, whatsapp_1.jidToNumber)(message.key.remoteJid);
                var kode_reseller = null;
                var idReseller, idMerchant = null;
                if (!pengirim)
                    throw new Error(`Pengirim tidak ditemukan`);
                yield this.props.imcenterService.updateActivity(this.props.imcenter_id);
                const reseller = yield this.resellerService.findByPhoneNumber(pengirim, imcenter.griyabayar, types_1.TIPE_PENGIRIM.WHATSAPP);
                if (reseller == null) {
                    const waSetting = yield this.parameterService.findByGroupAndKey(types_1.PARAMETER_GROUP.SETTING, "NomorHp=WhatsApp", imcenter.griyabayar);
                    if (waSetting != null && waSetting.value == "1") {
                        const reseller = yield this.resellerService.findByPhoneNumber(pengirim, imcenter.griyabayar, types_1.TIPE_PENGIRIM.NOMOR_HP);
                        if (reseller) {
                            kode_reseller = reseller.kode;
                            idReseller = reseller.id;
                            idMerchant = reseller.id_merchant;
                        }
                    }
                }
                else {
                    kode_reseller = reseller.kode;
                    idReseller = reseller.id;
                    idMerchant = reseller.id_merchant;
                }
                var imcenterLog = new imcenterLogs_1.ImcenterLogs();
                imcenterLog.tgl_entri = new Date(),
                    imcenterLog.imcenter_id = this.props.imcenter_id,
                    imcenterLog.message_id = message.key.id,
                    imcenterLog.pengirim = pengirim,
                    imcenterLog.aplikasi = types_1.TIPE_APLIKASI.NODEJS,
                    imcenterLog.tipe = types_1.TIPE_LOG.INBOX,
                    imcenterLog.keterangan = messageText,
                    imcenterLog.kode_reseller = kode_reseller,
                    imcenterLog.sender_timestamp = (0, date_1.timeToDate)(Number(message.messageTimestamp));
                return yield this.props.messageService.createLog(imcenterLog);
            }
            catch (error) {
                console.error(`Gagal menyimpan pesan dari ${message.key.remoteJid}:`, error);
                this.props.messageService.saveLog(`Gagal menyimpan pesan dari ${message.key.remoteJid}`, types_1.TIPE_LOG.ERROR);
            }
        });
    }
    markAsRead(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield this.props.messageService.getMessageByMessageId(messageId.id);
                if (message) {
                    yield this.socket.readMessages([messageId]);
                    // await this.sendMessage(messageId.remoteJid, `Pesan "${message.keterangan}" telah diterima dan akan segera diproses.`);
                    yield this.props.messageService.updateStatus(messageId.id, types_1.STATUS_LOG.DIBACA);
                    console.log(`Pesan dari ${messageId.remoteJid} telah dibaca`);
                }
            }
            catch (error) {
                console.error(`Gagal membaca pesan dari ${messageId.remoteJid}:`, error);
                this.props.messageService.saveLog(`Gagal membaca pesan dari ${messageId.remoteJid}`, types_1.TIPE_LOG.ERROR);
            }
        });
    }
    broadcastMessage(jids, content) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const jid of jids) {
                // await this.sendMessage(jid, content);
                yield new Promise((resolve) => setTimeout(resolve, 1000));
            }
        });
    }
}
exports.MessageHandler = MessageHandler;
//# sourceMappingURL=messageHandler.js.map