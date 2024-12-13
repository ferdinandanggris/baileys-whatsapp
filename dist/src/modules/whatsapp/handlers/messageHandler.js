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
const imcenterLogs_1 = require("../../../entities/imcenterLogs");
const date_1 = require("../../../utils/date");
class MessageHandler {
    constructor(props) {
        this.props = props;
        this.parameterService = new parameterService_1.default();
        this.socket = props.socket;
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jid = (0, whatsapp_1.numberToJid)(message.receiver);
                const response = yield this.socket.sendMessage(jid, { text: message.message });
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
            if (imcenterLogs.length > 0)
                yield this.props.messageService.saveMultipleMessage(imcenterLogs);
        }));
        this.socket.ev.on("messaging-history.set", (msg) => __awaiter(this, void 0, void 0, function* () {
            const imcenterLogs = yield this.inboxValidation(msg.messages);
            if (imcenterLogs.length > 0)
                yield this.props.messageService.saveMultipleMessage(imcenterLogs);
        }));
    }
    inboxValidation(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const imcenterLogs = [];
            for (const message of messages) {
                const jid = message.key.remoteJid;
                // message validation not null conversation
                if (!((_a = message.message) === null || _a === void 0 ? void 0 : _a.conversation)) {
                    continue;
                }
                // get latest imcenter_log latest message, and compare with current message
                const latestMessage = yield this.props.messageService.getLatestMessageByImcenter();
                const messageTimestamp = Number(message.messageTimestamp);
                // compare with latest message
                if (latestMessage && (0, date_1.timeToDate)(messageTimestamp) <= latestMessage.sender_timestamp) {
                    continue;
                }
                if ((0, whatsapp_1.isFromBroadcast)(jid) || (0, whatsapp_1.isFromGroup)(jid)) {
                    continue;
                }
                var tipe_log = types_1.TIPE_LOG.INBOX;
                if ((0, whatsapp_1.isFromMe)(message)) {
                    tipe_log = types_1.TIPE_LOG.OUTBOX;
                }
                // check if this message is from reseller
                // TODO: check if this message is from reseller
                const imcenterLog = new imcenterLogs_1.ImcenterLogs();
                imcenterLog.keterangan = (_b = message.message) === null || _b === void 0 ? void 0 : _b.conversation;
                imcenterLog.tipe = tipe_log;
                imcenterLog.pengirim = jid;
                imcenterLog.message_id = message.key.id;
                imcenterLog.sender_timestamp = (0, date_1.timeToDate)(messageTimestamp);
                imcenterLog.raw_message = JSON.stringify(message);
                imcenterLog.tgl_entri = new Date();
                imcenterLog.aplikasi = types_1.TIPE_APLIKASI.NODEJS;
                imcenterLog.imcenter_id = this.props.messageService.getImcenterId();
                imcenterLogs.push(imcenterLog);
            }
            return imcenterLogs;
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