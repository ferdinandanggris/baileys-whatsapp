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
class MessageHandler {
    constructor(socket) {
        this.socket = socket;
    }
    sendMessage(jid, content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.socket.sendMessage(jid, { text: content });
                console.log(`Pesan terkirim ke ${jid}: ${content}`);
            }
            catch (error) {
                console.error(`Gagal mengirim pesan ke ${jid}:`, error);
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
                // Implementasikan logika tambahan di sini
            }
        }));
    }
}
exports.MessageHandler = MessageHandler;
//# sourceMappingURL=messageHandler.js.map