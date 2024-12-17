import { AppDataSource } from "../configs/db";
import { ImcenterLogs } from "../entities/imcenterLogs";

export class ImcenterLogRepository {
    private repository = AppDataSource.getRepository(ImcenterLogs);

    async create(imcenterLog : ImcenterLogs): Promise<ImcenterLogs> {
        return await this.repository.save(imcenterLog);
    }
}