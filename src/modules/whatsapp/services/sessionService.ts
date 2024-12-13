import { AppDataSource } from "../../../configs/db";
import { WhatsappSession } from "../../../entities/whatsappSession";
import { In } from "typeorm";

export default class SessionService {

    private repository = AppDataSource.getRepository(WhatsappSession);

    async getSession(imcenter_id: number): Promise<WhatsappSession> {
        return this.repository.findOneBy({ imcenter_id });
    }

    saveUpsertSession(imcenter_id: number, jid : string, auth: string) {
        return this.repository.upsert({ imcenter_id, jid, auth }, { conflictPaths: ["imcenter_id"] });
    }

    async removeSession(jid: string) {
        await this.repository.delete({ jid });
    }

    async getSessionByListImcenterId(listImcenterId: number[]): Promise<WhatsappSession[]> {
        return this.repository.find({ where: { imcenter_id: In(listImcenterId) } });
    }

    async getAllSession(): Promise<WhatsappSession[]> {
        return this.repository.find();
    }
}