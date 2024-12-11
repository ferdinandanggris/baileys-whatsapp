import { proto } from "baileys";
import { AppDataSource } from "../../../configs/db";
import { ImcenterLogs } from "../../../entities/imcenterLogs";
import { jidToNumber } from "../../../utils/whatsapp";
import Imcenter from "../../../entities/imcenter";
import { TIPE_APLIKASI, TIPE_LOG } from "../../../entities/types";
import { timeToDate } from "../../../utils/date";

export class MessageService{

    private repository = AppDataSource.getRepository(ImcenterLogs);
    constructor(private imcenter_id: number) {}

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
}