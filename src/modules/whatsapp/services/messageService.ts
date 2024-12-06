import { AppDataSource } from "../../../configs/db";
import { ImcenterLogs } from "../../../entities/imcenterLogs";

export class MessageService{

    private repository = AppDataSource.getRepository(ImcenterLogs);

    async saveMessage(message: string): Promise<void> {
        console.log(`Message saved: ${message}`);
    }
}