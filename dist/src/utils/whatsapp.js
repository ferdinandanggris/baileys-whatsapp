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
exports.isFromMe = exports.getSocketJid = exports.getSocketNumber = exports.qrCodeToBase64 = exports.isInboxMessage = exports.isFromPersonalChat = exports.isFromBroadcast = exports.isFromGroup = exports.jidToNumberPhone = exports.numberToJid = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const numberToJid = (jid) => (jid === null || jid === void 0 ? void 0 : jid.includes('@s.whatsapp.net')) ? jid : `${jid}@s.whatsapp.net` || null;
exports.numberToJid = numberToJid;
const jidToNumberPhone = (jid) => (jid === null || jid === void 0 ? void 0 : jid.replace('@s.whatsapp.net', '')) || null;
exports.jidToNumberPhone = jidToNumberPhone;
const isFromGroup = (jid) => jid.includes('@g.us');
exports.isFromGroup = isFromGroup;
const isFromBroadcast = (jid) => jid.includes('@broadcast');
exports.isFromBroadcast = isFromBroadcast;
const isFromPersonalChat = (jid) => jid.includes('@s.whatsapp.net');
exports.isFromPersonalChat = isFromPersonalChat;
const isFromStatus = (jid) => jid.includes('status@broadcast');
const isFromMe = (message) => message.key.fromMe === true;
exports.isFromMe = isFromMe;
const isInboxMessage = (message) => message.key.fromMe === false && isFromPersonalChat(message.key.remoteJid);
exports.isInboxMessage = isInboxMessage;
const qrCodeToBase64 = (text) => __awaiter(void 0, void 0, void 0, function* () { return yield qrcode_1.default.toDataURL(text); });
exports.qrCodeToBase64 = qrCodeToBase64;
const getSocketNumber = (socket) => socket.authState.creds.me.id.split(':')[0] || '';
exports.getSocketNumber = getSocketNumber;
const getSocketJid = (socket) => socket.authState.creds.me.id || '';
exports.getSocketJid = getSocketJid;
//# sourceMappingURL=whatsapp.js.map