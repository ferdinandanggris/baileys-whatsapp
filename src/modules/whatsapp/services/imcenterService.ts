import { Repository, SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '../../../configs/db';
import Imcenter from '../../../entities/imcenter';
import { IMCENTER_TYPE, STATUS_LOGIN, TIPE_APLIKASI } from '../../../entities/types';

export class ImCenterService {
    private repository : Repository<Imcenter> = AppDataSource.getRepository(Imcenter);

    queryAdditionalForWhatsappNodejs(query: SelectQueryBuilder<Imcenter>): SelectQueryBuilder<Imcenter> {
        return query.where('tipe = :whatsapp AND aplikasi = :nodejs', { whatsapp : IMCENTER_TYPE.WHATSAPP, nodejs : TIPE_APLIKASI.NODEJS });
    }

    async createImcenter(numberPhone: string): Promise<string> {
        const existingSession = await this.repository.findOneBy({ username: numberPhone });
        if (existingSession) {
            return `Imcenter with numberPhone "${numberPhone}" already exists.`;
        }
        await this.repository.save({ username: numberPhone, aktif: false, standby: false });
    }

    async checkScannerIsValid(imcenter_id : number,numberPhone: string): Promise<boolean> {
        const session = await this.repository.findOneBy({ id: imcenter_id, username: numberPhone });
        if (!session) {
            return false;
        }
        return true;
    }

    async getAllSessions(): Promise<Imcenter[]> {
        return this.queryAdditionalForWhatsappNodejs(this.repository.createQueryBuilder('imcenter')).getMany();
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

        session.qr = qrcode;
        await this.repository.save(session);
        return `Session "${session.username}" QR Code updated.`;
    }

    async getQRCode(numberPhone: string): Promise<string> {
        const session = await this.repository.findOneBy({ username : numberPhone });
        if (!session) {
            throw new Error(`Session with key "${numberPhone}" not found.`);
        }

        return session.qr;
    }

    async getImcenterById(imcenter_id: number): Promise<Imcenter> {
        const imcenter = await this.repository.findOneBy({ id: imcenter_id });
        if (!imcenter) {
            throw new Error(`imcenter with key "${imcenter_id}" not found.`);
        }
        return imcenter;
    }

    async getImcenterByNumberPhone(numberPhone: string): Promise<Imcenter> {
        const imcenter = await this.repository.findOneBy({ username: numberPhone });
        if (!imcenter) {
            throw new Error(`imcenter with key "${numberPhone}" not found.`);
        }
        return imcenter;
    }

    public async getAutoActiveSession(): Promise<Imcenter[]> {
        return this.repository.findBy({ aktif: true });
    }

    public async getNotHaveLoginStatus(status : STATUS_LOGIN ): Promise<Imcenter[]> {
       return await this.queryAdditionalForWhatsappNodejs(this.repository.createQueryBuilder('imcenter'))
        .andWhere('status_login != :status', { status }).getMany();
    }

    async updateStatus(imcenter_id: number, status_login: STATUS_LOGIN): Promise<string> {
        const imcenter = await this.repository.findOneBy({ id: imcenter_id });
        if (!imcenter) {
            throw new Error(`Session with key "${imcenter_id}" not found.`);
        }
        imcenter.status_login = status_login;
        await this.repository.save(imcenter);
        return `Session "${imcenter_id}" status updated.`;
    }
    
}