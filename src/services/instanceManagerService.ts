import { WhatsappService } from "../modules/whatsapp/whatsappService";


class InstanceManager {
    private instances: Map<number, WhatsappService>;

    constructor() {
        this.instances = new Map();
    }   

    /**
     * Membuat atau mendapatkan instance berdasarkan sessionId
     */
    public getInstance(imcenter_id: number): WhatsappService {
        if (!this.instances.has(imcenter_id)) {
            const instance = new WhatsappService(imcenter_id);
            this.instances.set(imcenter_id, instance);
        }
        return this.instances.get(imcenter_id)!;
    }

    /**
     * Hapus instance berdasarkan sessionId
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
}

module.exports = new InstanceManager();