import { proto } from "baileys";
import { AppDataSource } from "../configs/db";
import { Imcenter } from "../entities/imcenter";
import { ImcenterLogs } from "../entities/imcenterLogs";

export class ImcenterLogService {
    private repository = AppDataSource.getRepository(ImcenterLogs);
    private imcenterRepository = AppDataSource.getRepository(Imcenter);

    async createLog(nomorhp: string, message: proto.IWebMessageInfo) {
        const imcenter = await this.imcenterRepository.findOneBy({ nomorhp });
        await this.repository.save({ imcenter_id : imcenter.id, message_id :message.key.id, type : "inbox", keterangan : message.message?.conversation || null, raw_message : JSON.stringify(message), pengirim : message.key.remoteJid });
    }
}