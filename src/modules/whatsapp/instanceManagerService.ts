import { In } from "typeorm";
import { AppDataSource } from "../../configs/db";
import { Imcenter } from "../../entities/imcenter";
import { ImCenterService } from "../../services/imcenterService";
import { WhatsappService } from "./whatsappService";
import { WhatsappSessionService } from "../../services/whatsappSessionService";


class InstanceManager {
    private instances: Map<string, WhatsappService>;
    private imcenterService = new ImCenterService();    
    private whatsappSession = new WhatsappSessionService();

    constructor() {
        this.instances = new Map();
    }   

    /**
     * Membuat atau mendapatkan instance berdasarkan sessionId
     */
    public getInstance(sessionId: string): WhatsappService {
        if (!this.instances.has(sessionId)) {
            const instance = new WhatsappService(sessionId);
            this.instances.set(sessionId, instance);
        }
        return this.instances.get(sessionId)!;
    }

    /**
     * Hapus instance berdasarkan sessionId
     */
    public removeInstance(sessionId: string): void {
        if (this.instances.has(sessionId)) {
            this.instances.delete(sessionId);
            console.log(`[${sessionId}] Instance removed.`);
        }
    }

    /**
     * Mendapatkan semua sessionId yang sedang aktif
     */
    public getActiveSessions(): string[] {
        return Array.from(this.instances.keys());
    }

    /**
     * Logout semua instance
     */
    public async logoutAll(): Promise<void> {
        for (const [sessionId, instance] of this.instances) {
            await instance.logout();
            this.removeInstance(sessionId);
        }
        console.log("All instances logged out.");
    }

    public async checkAutoActiveSessions(): Promise<void> {
        const imcenters = await this.imcenterService.getAutoActiveSession();
        const sessions = await this.whatsappSession.getSessionByListJID(imcenters.map(imcenter => imcenter.nomorhp));

        for (const session of sessions) {
            const socket = this.getInstance(session.nomorhp);
            socket.init();
        }
    }
}

module.exports = new InstanceManager();