import { ImCenterService } from "./services/imcenterService";
import { WhatsappService } from "./whatsappService";
import SessionService from "./services/sessionService";
import { STATUS_LOGIN } from "../../entities/types";

export class InstanceManager {
    private instances: Map<number, WhatsappService>;
    private imcenterService = new ImCenterService();
    private sessionService = new SessionService();

    constructor() {
        this.instances = new Map();
    }

    public createInstance(imcenter_id: number): WhatsappService {
        if (this.instances.has(imcenter_id)) {
            throw new Error("Instance already exists.");
        }

        const instance = new WhatsappService(imcenter_id);
        this.instances.set(imcenter_id, instance);
        return instance;
    }

    /**
     * Membuat atau mendapatkan instance berdasarkan imcenter_id
     */
    public getInstance(imcenter_id: number): WhatsappService {
        try {
            if (!this.instances.has(imcenter_id)) {
                const instance = new WhatsappService(imcenter_id);
                this.instances.set(imcenter_id, instance);
            }
            return this.instances.get(imcenter_id)!;
        } catch (error) {
            console.log(error);
        }

    }

    /**
     * Hapus instance berdasarkan imcenter_id
     */
    public removeInstance(imcenter_id: number): void {
        if (this.instances.has(imcenter_id)) {
            this.instances.delete(imcenter_id);
            console.log(`[${imcenter_id}] Instance removed.`);
        }
    }

    /**
     * Mendapatkan semua imcenter_id yang sedang aktif
     */
    public getActiveSessions(): number[] {
        return Array.from(this.instances.keys());
    }

    /**
     * Logout semua instance
     */
    public async logoutAll(): Promise<void> {
        for (const [imcenter_id, instance] of this.instances) {
            await instance.logout();
            this.removeInstance(imcenter_id);
        }
        console.log("All instances logged out.");
    }

    public async loginAllSessions(): Promise<void> {
        const imcenters = await this.imcenterService.getNotHaveLoginStatus(STATUS_LOGIN.SUDAH_LOGIN);
        for (const imcenter of imcenters) {
            const socket = this.getInstance(imcenter.id);
            await socket.connect();
        }
    }

    public async autoActiveSession(): Promise<void> {
        const imcentersAutoActive = await this.imcenterService.getAutoActiveSession();
        const sessions = await this.sessionService.getSessionByListImcenterId(imcentersAutoActive.map(imcenter => imcenter.id));
        const sessionActive = await this.sessionService.getAllSession()
        const imcenters = await this.imcenterService.getAllSessions();

        for (const imcenter of imcenters) {
            if (sessionActive.find(session => session.imcenter_id === imcenter.id)) {
                continue;
            }
            await this.imcenterService.updateStatus(imcenter.id, STATUS_LOGIN.BELUM_LOGIN);
        }

        for (const session of sessions) {
            const socket = this.getInstance(session.imcenter_id);
            socket.connect();
        }
    }
}

module.exports = new InstanceManager();