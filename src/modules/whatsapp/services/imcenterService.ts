import { AppDataSource } from '../../../configs/db';
import { Imcenter } from '../../../entities/imcenter';

export class ImCenterService {
    private repository = AppDataSource.getRepository(Imcenter);

    async createImcenter(number: string): Promise<string> {
        const existingSession = await this.repository.findOneBy({ nomorhp: number });
        if (existingSession) {
            return `Imcenter with number "${number}" already exists.`;
        }
        await this.repository.save({ nomorhp: number, aktif: false, standby: false });
    }

    async checkScannerIsValid(imcenter_id : number,nomorhp: string): Promise<boolean> {
        const session = await this.repository.findOneBy({ id: imcenter_id, nomorhp });
        if (!session) {
            return false;
        }
        return true;
    }

    async getAllSessions(): Promise<Imcenter[]> {
        return this.repository.find();
    }

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
    
    async updateQRCode(id : number, qrcode: string): Promise<string> {
        const session = await this.repository.findOneBy({ id });
        if (!session) {
            throw new Error(`Session with key "${id}" not found.`);
        }

        session.qrcode = qrcode;
        await this.repository.save(session);
        return `Session "${session.nomorhp}" QR Code updated.`;
    }

    async getQRCode(nomorhp: string): Promise<string> {
        const session = await this.repository.findOneBy({ nomorhp });
        if (!session) {
            throw new Error(`Session with key "${nomorhp}" not found.`);
        }

        return session.qrcode;
    }

    async getImcenterById(imcenter_id: number): Promise<Imcenter> {
        const imcenter = await this.repository.findOneBy({ id: imcenter_id });
        if (!imcenter) {
            throw new Error(`imcenter with key "${imcenter_id}" not found.`);
        }

        return imcenter;
    }

    async updateModeStandby(standby: boolean, imcenter_id: number): Promise<string> {
        const imcenter = await this.repository.findOneBy({ id : imcenter_id });
        if (!imcenter) {
            throw new Error(`Session with key "${imcenter_id}" not found.`);
        }

        imcenter.standby = standby;
        await this.repository.save(imcenter);
        return `Session "${imcenter_id}" standby mode updated.`;
    }

    public async getAutoActiveSession(): Promise<Imcenter[]> {
        return this.repository.findBy({ auto_aktif: true });
    }

    async updateStatus(imcenter_id: number, status: "start" | "qr" | "open" | "closed"): Promise<string> {
        const imcenter = await this.repository.findOneBy({ id: imcenter_id });
        if (!imcenter) {
            throw new Error(`Session with key "${imcenter_id}" not found.`);
        }
        imcenter.status = status;
        await this.repository.save(imcenter);
        return `Session "${imcenter_id}" status updated.`;
    }
    
}