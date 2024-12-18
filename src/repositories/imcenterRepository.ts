import { In } from "typeorm";
import { AppDataSource } from "../configs/db";
import Imcenter from "../entities/imcenter";
import { STATUS_LOGIN } from "../entities/types";
export class ImcenterRepository {
    private repository = AppDataSource.getRepository(Imcenter);

    async fetchById(id: number): Promise<Imcenter> {
        return this.repository.findOne({ where: { id } });
    }

    async updateActivityById(id: number): Promise<boolean> {
        await this.repository.update(id, { tgl_aktivitas: new Date() });
        return true;
    }
    
    async fetchByStatusLogin(status_login: STATUS_LOGIN[]): Promise<Imcenter[]> {
        return this.repository.find({ where: { status_login: In(status_login) } });
    }
}