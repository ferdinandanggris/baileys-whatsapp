import makeWASocket from "baileys";
import { AppDataSource } from "../../../configs/db";
import { WhatsappSession } from "../../../entities/whatsappSession";
import { In } from "typeorm";
import { numberToJid } from "../../../utils/whatsapp";

export default class SessionService {

    private repository = AppDataSource.getRepository(WhatsappSession);

    async saveSession(nomorhp : string, socket: ReturnType<typeof makeWASocket>) {
        const jid = numberToJid(nomorhp);
        const whatsappSession = await this.repository.findOneBy({ jid });
        if(!whatsappSession) {
            this.repository.save({ jid : jid,  });
        }
    }

    async getSession(imcenter_id: number): Promise<WhatsappSession> {
        return this.repository.findOneBy({ imcenter_id });
    }

    saveUpsertSession(imcenter_id: number, jid : string, auth: string) {
        return this.repository.upsert({ imcenter_id, jid, auth }, { conflictPaths: ["imcenter_id"] });
    }

    async removeSession(jid: string) {
        this.repository.delete({ jid });
    }

    async getSessionByListImcenterId(listImcenterId: number[]): Promise<WhatsappSession[]> {
        return this.repository.find({ where: { imcenter_id: In(listImcenterId) } });
    }

    async getAllSession(): Promise<WhatsappSession[]> {
        return this.repository.find();
    }
}