import { proto, WASocket } from "baileys";
import  QRCode  from "qrcode";

const numberToJid = (jid: string) => jid?.includes('@s.whatsapp.net') ? jid : `${ jid }@s.whatsapp.net` || null;
const jidToNumberPhone = (jid: string) => jid?.replace('@s.whatsapp.net', '') || null;
const isFromGroup = (jid: string) => jid.includes('@g.us');
const isFromBroadcast = (jid: string) => jid.includes('@broadcast');
const isFromPersonalChat = (jid: string) => jid.includes('@s.whatsapp.net');
const isFromStatus = (jid: string) => jid.includes('status@broadcast');
const isFromMe = (message : proto.IWebMessageInfo) => message.key.fromMe === true;
const isInboxMessage = (message : proto.IWebMessageInfo) => message.key.fromMe === false && isFromPersonalChat(message.key.remoteJid);
const qrCodeToBase64 = async (text: string) => await QRCode.toDataURL(text);
const getSocketNumber = (socket : WASocket) => socket.authState.creds.me.id.split(':')[0] || '';
const getSocketJid = (socket : WASocket) => socket.authState.creds.me.id || '';
export { numberToJid, jidToNumberPhone, isFromGroup, isFromBroadcast, isFromPersonalChat, isInboxMessage, qrCodeToBase64, getSocketNumber, getSocketJid, isFromMe, isFromStatus };