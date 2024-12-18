import { MessageUserReceiptUpdate, proto } from "baileys";
import { STATUS_LOG, TIPE_LOG } from "../entities/types";
import { ImcenterLogs } from "../entities/imcenterLogs";
import { OTP, SendWhatsappMessage } from "./whatsapp";

export interface IMessageService {
    saveLog(message : string, tipe_log : TIPE_LOG): Promise<void>;
    processMessagesFromUpsert(message: proto.IWebMessageInfo[]): Promise<void>;
    processMessagesFromHistory(message: proto.IWebMessageInfo[]): Promise<void>;
    processMessageMarkAsRead(message_id: string): Promise<void>;
    processMessageSend(response: proto.IWebMessageInfo,message: SendWhatsappMessage): Promise<void>;
    processMessageUpdateReceipt(messages: MessageUserReceiptUpdate[]): Promise<void>;
    processMessageOTPSend(otpProps: OTP): Promise<void>;
}