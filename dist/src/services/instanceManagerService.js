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
exports.InstanceManager = void 0;
const whatsappService_1 = require("./whatsappService");
class InstanceManager {
    constructor() {
        this.instances = new Map();
    }
    /**
     * Membuat atau mendapatkan instance berdasarkan sessionId
     */
    getInstance(sessionId) {
        if (!this.instances.has(sessionId)) {
            const instance = new whatsappService_1.WhatsappService(sessionId);
            this.instances.set(sessionId, instance);
        }
        return this.instances.get(sessionId);
    }
    /**
     * Hapus instance berdasarkan sessionId
     */
    removeInstance(sessionId) {
        if (this.instances.has(sessionId)) {
            this.instances.delete(sessionId);
            console.log(`[${sessionId}] Instance removed.`);
        }
    }
    /**
     * Mendapatkan semua sessionId yang sedang aktif
     */
    getActiveSessions() {
        return Array.from(this.instances.keys());
    }
    /**
     * Logout semua instance
     */
    logoutAll() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const [sessionId, instance] of this.instances) {
                yield instance.logout();
                this.removeInstance(sessionId);
            }
            console.log("All instances logged out.");
        });
    }
}
exports.InstanceManager = InstanceManager;
//# sourceMappingURL=instanceManagerService.js.map