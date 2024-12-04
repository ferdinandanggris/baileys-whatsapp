import makeWASocket, { DisconnectReason, useMultiFileAuthState } from 'baileys';
import { AppDataSource } from '../configs/Db';
import { Imcenter } from '../entities/Imcenter';

export class ImCenterService {
    private repository = AppDataSource.getRepository(Imcenter);

    async createImcenter(number: string): Promise<string> {
        const existingSession = await this.repository.findOneBy({ nomorhp: number });

        if (existingSession) {
            return `Imcenter with number "${number}" already exists.`;
        }

        await this.repository.save({ nomorhp: number, aktif: false, standby: false });
    }

    // Mendapatkan semua sesi
    async getAllSessions(): Promise<Imcenter[]> {
        return this.repository.find();
    }

    // Menghapus sesi
    async deleteSession(id: number): Promise<string> {
        const session = await this.repository.findOneBy({ id });
        if (!session) {
            throw new Error(`Session with key "${id}" not found.`);
        }

        await this.repository.delete({ id });
        return `Session "${id}" deleted.`;
    }

    async getSession(id: number): Promise<Imcenter> {
        const session = await this.repository.findOneBy({ id });
        if (!session) {
            throw new Error(`Session with key "${id}" not found.`);
        }

        return session;
    }
    
}