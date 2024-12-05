import { WhatsappService } from "./whatsappService";


export class InstanceManager {
    private instances: Map<string, WhatsappService>;

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
}