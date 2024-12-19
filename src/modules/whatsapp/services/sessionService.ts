import { AppDataSource } from "../../../configs/db";
import Imcenter from "../../../entities/imcenter";
import { WhatsappSession } from "../../../entities/whatsappSession";
import { In } from "typeorm";
import { ImcenterRepository } from "../../../repositories/imcenterRepository";
import { STATUS_LOGIN } from "../../../entities/types";
import { ImcenterLogRepository } from "../../../repositories/imcenterLogRepository";

export default class SessionService implements ISessionService {

    private repository = AppDataSource.getRepository(WhatsappSession);
    private repositories = {
        imcenter : new ImcenterRepository(),
        imcenterLog : new ImcenterLogRepository()
    }

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

    async processUpdateQR(imcenter_id : number, qrcode : string) {
        try {
            await this.repositories.imcenter.updateStatus(imcenter_id, STATUS_LOGIN.PROSES_LOGIN);
            await this.repositories.imcenter.updateQRCode(imcenter_id, qrcode);
        }catch(error) {
            console.error("Gagal update QR Code", error);
            throw new Error(error);
        }
      
    }
}