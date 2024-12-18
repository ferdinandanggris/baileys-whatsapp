import { IsNull, Not } from "typeorm";
import { AppDataSource } from "../configs/db";
import { ImcenterLogs } from "../entities/imcenterLogs";
import { STATUS_LOG } from "../entities/types";

export class ImcenterLogRepository {
    private repository = AppDataSource.getRepository(ImcenterLogs);

    async create(imcenterLog: ImcenterLogs): Promise<ImcenterLogs> {
        return await this.repository.save(imcenterLog);
    }

    async fetchLatest(imcenter_id: number): Promise<ImcenterLogs> {
        return this.repository.findOne({ where: { imcenter_id: imcenter_id, sender_timestamp: Not(IsNull()) }, order: { sender_timestamp: 'DESC' } });
    }

    async saveMultiple(messages: ImcenterLogs[]) {
        await this.repository.save(messages);
    }

    async updateStatus(messageId: string, status: STATUS_LOG) {
        await this.repository.update({ message_id: messageId }, { status });
    }

    async fetchByMessageId(messageId: string): Promise<ImcenterLogs> {
        return this.repository.findOne({ where: { message_id: messageId } });
    }

    async fetchExpired(imcenter_id : number): Promise<ImcenterLogs[]> {
        return this.repository.find({ where: { raw_message : Not(IsNull()), imcenter_id } });
    }

    async removeRawMessage(messageId: string) {
        await this.repository.update({ message_id: messageId }, { raw_message: null });
    }
}