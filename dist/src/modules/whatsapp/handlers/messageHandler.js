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
exports.MessageHandler = void 0;
const baileys_1 = require("baileys");
const whatsapp_1 = require("../../../utils/whatsapp");
const types_1 = require("../../../entities/types");
class MessageHandler {
    constructor(props) {
        this.props = props;
        this.socket = props.socket;
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jid = (0, whatsapp_1.numberToJid)(message.receiver);
                var messageSend = this.constructSendMessage(message);
                if (yield this.checkNumberIsRegistered(jid)) {
                    const response = yield this.socket.sendMessage(jid, messageSend);
                    yield this.props.messageService.processMessageSend(response, message);
                    console.log(`Pesan terkirim ke ${jid}: ${message.message}`);
                }
                else {
                    console.log(`Nomor ${message.receiver} tidak terdaftar di WhatsApp`);
                    this.props.messageService.saveLog(`Nomor ${message.receiver} tidak terdaftar di WhatsApp`, types_1.TIPE_LOG.ERROR);
                }
            }
            catch (error) {
                console.error(`Gagal mengirim pesan ke ${message.receiver}:`, error);
                this.props.messageService.saveLog(`Gagal mengirim pesan ke ${message.receiver}`, types_1.TIPE_LOG.ERROR);
            }
        });
    }
    sendOTP(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.props.messageService.processMessageOTPSend(otp);
            }
            catch (error) {
                console.error(`Gagal mengirim OTP ke ${otp.nomorhp}:`, error);
                this.props.messageService.saveLog(`Gagal mengirim OTP ke ${otp.nomorhp}`, types_1.TIPE_LOG.ERROR);
            }
        });
    }
    constructSendMessage(message) {
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
        return messageSend;
    }
    listenForMessages() {
        this.socket.ev.on("messages.upsert", (msg) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            for (const message of msg.messages) {
                const jid = message.key.remoteJid;
                const content = ((_a = message.message) === null || _a === void 0 ? void 0 : _a.conversation) || "Pesan tidak memiliki teks";
                console.log(`Pesan diterima dari ${jid}: ${content}`);
            }
            this.props.messageService.processMessagesFromUpsert(msg.messages);
        }));
        this.socket.ev.on("messaging-history.set", (msg) => __awaiter(this, void 0, void 0, function* () {
            if (msg.progress == 100 && msg.syncType == baileys_1.proto.HistorySync.HistorySyncType.RECENT) {
                yield this.props.messageService.processMessagesFromHistory(msg.messages);
            }
        }));
        this.socket.ev.on("message-receipt.update", (msg) => __awaiter(this, void 0, void 0, function* () {
            for (const message of msg) {
                const jid = message.key.remoteJid;
                console.log(`Pesan dari ${jid} telah dibaca`);
                console.log("Message Receipt", message);
            }
            yield this.props.messageService.processMessageUpdateReceipt(msg);
        }));
    }
    checkNumberIsRegistered(number) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jid = (0, whatsapp_1.numberToJid)(number);
                const response = yield this.socket.onWhatsApp(jid);
                console.log(`Nomor ${number} terdaftar di WhatsApp`);
                return response.at(0).exists;
            }
            catch (error) {
                console.error(`Gagal mengecek nomor ${number}:`, error);
                this.props.messageService.saveLog(`Gagal mengecek nomor ${number}`, types_1.TIPE_LOG.ERROR);
            }
        });
    }
    validationImageMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const jid = message.key.remoteJid;
            if ((0, whatsapp_1.isFromBroadcast)(jid) || (0, whatsapp_1.isFromGroup)(jid) || (0, whatsapp_1.isFromMe)(message)) {
                return;
            }
            // set read message
            yield this.markAsRead(message.key);
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
            yield this.sendMessage({
                receiver: message.key.remoteJid,
                message: `Pesan "${(_e = (_d = (_c = (_b = (_a = message.message) === null || _a === void 0 ? void 0 : _a.editedMessage) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.protocolMessage) === null || _d === void 0 ? void 0 : _d.editedMessage) === null || _e === void 0 ? void 0 : _e.conversation}" TIDAK DIPROSES. Edit Pesan tidak diizinkan.`,
                raw_message: JSON.stringify(message)
            });
        });
    }
    markAsRead(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.socket.readMessages([messageId]);
                yield this.props.messageService.processMessageMarkAsRead(messageId.id);
                console.log(`Pesan dari ${messageId.id} telah dibaca`);
            }
            catch (error) {
                console.error(`Gagal membaca pesan dari ${messageId.id}:`, error);
                this.props.messageService.saveLog(`Gagal membaca pesan dari ${messageId.id}`, types_1.TIPE_LOG.ERROR);
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