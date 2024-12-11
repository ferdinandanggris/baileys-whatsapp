import { proto, WASocket } from "baileys";
import  QRCode  from "qrcode";

const numberToJid = (jid: string) => jid?.includes('@s.whatsapp.net') ? jid : `${ jid }@s.whatsapp.net` || null;
const jidToNumber = (jid: string) => jid?.replace('@s.whatsapp.net', '') || null;
const isFromGroup = (jid: string) => jid.includes('@g.us');
const isFromBroadcast = (jid: string) => jid.includes('@broadcast');
const isFromPersonalChat = (jid: string) => jid.includes('@s.whatsapp.net');
const isInboxMessage = (message : proto.IWebMessageInfo) => message.key.fromMe === false && isFromPersonalChat(message.key.remoteJid);
const qrCodeToBase64 = async (text: string) => await QRCode.toDataURL(text);
const getSocketNumber = (socket : WASocket) => socket.authState.creds.me.id.split(':')[0] || '';
const getSocketJid = (socket : WASocket) => socket.authState.creds.me.id || '';
const directoryPathSession = (imcenter_id: number) => `./sessions/${imcenter_id}_imcenter_id`;

export { numberToJid, jidToNumber, isFromGroup, isFromBroadcast, isFromPersonalChat, isInboxMessage, qrCodeToBase64, getSocketNumber, directoryPathSession, getSocketJid };