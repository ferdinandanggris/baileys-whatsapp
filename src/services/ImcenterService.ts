import { AppDataSource } from '../configs/db';
import { Imcenter } from '../entities/imcenter';

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
    
    async updateQRCode(nomorhp : string, qrcode: string): Promise<string> {
        const session = await this.repository.findOneBy({ nomorhp });
        if (!session) {
            throw new Error(`Session with key "${nomorhp}" not found.`);
        }

        session.qrcode = qrcode;
        await this.repository.save(session);
        return `Session "${nomorhp}" QR Code updated.`;
    }

    async getQRCode(nomorhp: string): Promise<string> {
        const session = await this.repository.findOneBy({ nomorhp });
        if (!session) {
            throw new Error(`Session with key "${nomorhp}" not found.`);
        }

        return session.qrcode;
    }

    async updateModeStandby(standby: boolean, nomorhp: string): Promise<string> {
        const session = await this.repository.findOneBy({ nomorhp });
        if (!session) {
            throw new Error(`Session with key "${nomorhp}" not found.`);
        }

        session.standby = standby;
        await this.repository.save(session);
        return `Session "${nomorhp}" standby mode updated.`;
    }

    public async getAutoActiveSession(): Promise<Imcenter[]> {
        return this.repository.findBy({ auto_aktif: true });
    }
    
}