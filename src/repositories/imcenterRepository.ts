import { AppDataSource } from "../configs/db";
import Imcenter from "../entities/imcenter";
export class ImcenterRepository {
    private repository = AppDataSource.getRepository(Imcenter);

    async fetchById(id: number): Promise<Imcenter> {
        return this.repository.findOne({where : {id}});
    }

    async updateActivityById(id : number) : Promise<boolean> {
        await this.repository.update(id, {tgl_aktivitas : new Date()});
        return true;
    }
}