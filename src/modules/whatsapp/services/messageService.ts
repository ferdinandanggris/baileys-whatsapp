import { proto } from "baileys";
import { AppDataSource } from "../../../configs/db";
import { ImcenterLogs } from "../../../entities/imcenterLogs";
import { STATUS_LOG, TIPE_APLIKASI, TIPE_LOG } from "../../../entities/types";
import { timeToDate } from "../../../utils/date";
import { IsNull, Not } from "typeorm";
import { IMessageService } from "../../../interfaces/message";

export class MessageService implements IMessageService{

    private repository = AppDataSource.getRepository(ImcenterLogs);
    constructor(private imcenter_id: number) {}

    getImcenterId() {
        return this.imcenter_id;
    }

    async saveMessage(message: proto.IWebMessageInfo,tipe : TIPE_LOG) {
        const imcenterLog = this.getSkeletonLog();
        imcenterLog.keterangan = message?.message?.conversation;
        imcenterLog.tipe =tipe;
        imcenterLog.pengirim = message.key.remoteJid;
        imcenterLog.message_id = message.key.id;
        imcenterLog.sender_timestamp = timeToDate(Number(message.messageTimestamp))
        imcenterLog.raw_message = JSON.stringify(message)
        await this.repository.save(imcenterLog);
    }

    async createLog(messageLog : ImcenterLogs) : Promise<ImcenterLogs> {
        return await this.repository.save(messageLog);
    }

    async saveLog(message : string, tipe : TIPE_LOG){
        const imcenterLog = this.getSkeletonLog();
        imcenterLog.keterangan = message;
        imcenterLog.tipe = tipe
        await this.repository.save(imcenterLog);
    }

    private getSkeletonLog() : ImcenterLogs{
        const imcenterLog = new ImcenterLogs();
        imcenterLog.aplikasi = TIPE_APLIKASI.NODEJS;
        imcenterLog.imcenter_id = this.imcenter_id;
        imcenterLog.tgl_entri = new Date();

        return imcenterLog;
    }

    async getMessageByMessageId(messageId: string): Promise<ImcenterLogs> {
        return this.repository.findOneBy({ message_id: messageId });
    }

    async updateStatus(messageId: string, status: STATUS_LOG) {
        await this.repository.update({ message_id: messageId }, { status });
    }

    async getLatestMessageByImcenter(): Promise<ImcenterLogs> {
        return this.repository.findOne({ where : {imcenter_id : this.imcenter_id,sender_timestamp : Not(IsNull())},order: { sender_timestamp: 'DESC' } });
    }

    async saveMultipleMessage(messages: ImcenterLogs[]) {
        await this.repository.save(messages);
    }

    async processMessage(messages: proto.WebMessageInfo[]) {
        
    }
}