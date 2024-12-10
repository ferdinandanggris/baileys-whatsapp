import { proto } from "baileys";
import { AppDataSource } from "../../../configs/db";
import { ImcenterLogs } from "../../../entities/imcenterLogs";
import { jidToNumber } from "../../../utils/whatsapp";
import { Imcenter } from "../../../entities/imcenter";

export class MessageService{

    private repository = AppDataSource.getRepository(ImcenterLogs);
    constructor(private imcenter_id: number) {}

    async insertData(message: proto.IWebMessageInfo, type : string = "inbox") {
        switch(type){
            case "inbox":
                await this.createInbox(message);
                break;
            case "outbox":
                await this.createOutbox(message);
                break;
        }
    }

    private async createInbox(message: proto.IWebMessageInfo) {
        await this.repository.save({ imcenter_id : this.imcenter_id, message_id :message.key.id, type : "inbox", keterangan : message.message?.conversation || null, raw_message : JSON.stringify(message), pengirim : message.key.remoteJid });
    }

    private async createOutbox(message: proto.IWebMessageInfo) {
        await this.repository.save({ imcenter_id : this.imcenter_id, message_id :message.key.id, type : "outbox", keterangan : message.message?.conversation || null, raw_message : JSON.stringify(message), pengirim : message.key.remoteJid });
    }

    async createLog(message: string) {
        await this.repository.save({ imcenter_id : this.imcenter_id, type : "log", keterangan : message || null });
    }
}