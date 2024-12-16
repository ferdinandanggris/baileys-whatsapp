import { proto } from "baileys";
import { STATUS_LOG, TIPE_LOG } from "../entities/types";
import { ImcenterLogs } from "../entities/imcenterLogs";

export interface IMessageService {
    saveLog(message : string, tipe_log : TIPE_LOG): Promise<void>;
    saveMessage(message : proto.IWebMessageInfo, tipe_log : TIPE_LOG): Promise<void>;
    createLog(messageLog : ImcenterLogs): Promise<ImcenterLogs>;
    saveMultipleMessage(messages: ImcenterLogs[]): Promise<void>;
    getLatestMessageByImcenter(): Promise<ImcenterLogs>;
    getMessageByMessageId(messageId: string): Promise<ImcenterLogs>;
    updateStatus(messageId: string, status: STATUS_LOG): Promise<void>;
}