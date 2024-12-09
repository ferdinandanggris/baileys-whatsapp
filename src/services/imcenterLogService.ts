import { proto } from "baileys";
import { AppDataSource } from "../configs/db";
import { Imcenter } from "../entities/imcenter";
import { ImcenterLogs } from "../entities/imcenterLogs";
import { jidToNumber } from "../utils/whatsapp";

export class ImcenterLogService {
    private repository = AppDataSource.getRepository(ImcenterLogs);
    private imcenterRepository = AppDataSource.getRepository(Imcenter);

    async insertData(jid: string, message: proto.IWebMessageInfo, type : string = "inbox") {
        const number = jidToNumber(jid);
        const imcenter = await this.imcenterRepository.findOneBy({ nomorhp : number });
        if(!imcenter) return;

        switch(type){
            case "inbox":
                await this.createInbox(imcenter, message);
                break;
            case "outbox":
                await this.createOutbox(imcenter, message);
                break;
            case "log":
                await this.createLog(imcenter, message);
                break;
        }
    }

    private async createInbox(imcenter: Imcenter, message: proto.IWebMessageInfo) {
        await this.repository.save({ imcenter_id : imcenter.id, message_id :message.key.id, type : "inbox", keterangan : message.message?.conversation || null, raw_message : JSON.stringify(message), pengirim : message.key.remoteJid });
    }

    private async createOutbox(imcenter: Imcenter, message: proto.IWebMessageInfo) {
        await this.repository.save({ imcenter_id : imcenter.id, message_id :message.key.id, type : "outbox", keterangan : message.message?.conversation || null, raw_message : JSON.stringify(message), pengirim : message.key.remoteJid });
    }

    private async createLog(imcenter: Imcenter, message: proto.IWebMessageInfo) {
        await this.repository.save({ imcenter_id : imcenter.id, message_id :message.key.id, type : "inbox", keterangan : message.message?.conversation || null, raw_message : JSON.stringify(message), pengirim : message.key.remoteJid });
    }
}