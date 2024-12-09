"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const whatsappService_1 = require("../modules/whatsapp/whatsappService");
class InstanceManager {
    constructor() {
        this.instances = new Map();
    }
    /**
     * Membuat atau mendapatkan instance berdasarkan sessionId
     */
    getInstance(imcenter_id) {
        if (!this.instances.has(imcenter_id)) {
            const instance = new whatsappService_1.WhatsappService(imcenter_id);
            this.instances.set(imcenter_id, instance);
        }
        return this.instances.get(imcenter_id);
    }
    /**
     * Hapus instance berdasarkan sessionId
     */
    removeInstance(imcenter_id) {
        if (this.instances.has(imcenter_id)) {
            this.instances.delete(imcenter_id);
            console.log(`[${imcenter_id}] Instance removed.`);
        }
    }
    /**
     * Mendapatkan semua imcenter_id yang sedang aktif
     */
    getActiveSessions() {
        return Array.from(this.instances.keys());
    }
    /**
     * Logout semua instance
     */
    logoutAll() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const [imcenter_id, instance] of this.instances) {
                yield instance.logout();
                this.removeInstance(imcenter_id);
            }
            console.log("All instances logged out.");
        });
    }
}
module.exports = new InstanceManager();
//# sourceMappingURL=instanceManagerService.js.map