import { ImCenterService } from "./services/imcenterService";
import { WhatsappService } from "./whatsappService";
import SessionService from "./services/sessionService";


class InstanceManager {
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
        if (!this.instances.has(imcenter_id)) {
            const instance = new WhatsappService(imcenter_id);
            this.instances.set(imcenter_id, instance);
        }
        return this.instances.get(imcenter_id)!;
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

    public async checkAutoActiveSessions(): Promise<void> {
        const imcenters = await this.imcenterService.getAutoActiveSession();
        const sessions = await this.sessionService.getSessionByListJID(imcenters.map(imcenter => imcenter.nomorhp));

        // for (const session of sessions) {
        //     const socket = this.getInstance(session.);
        //     socket.init();
        // }
    }
}

module.exports = new InstanceManager();