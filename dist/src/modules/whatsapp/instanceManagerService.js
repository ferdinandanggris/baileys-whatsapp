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
const imcenterService_1 = require("../../services/imcenterService");
const whatsappService_1 = require("./whatsappService");
const whatsappSessionService_1 = require("../../services/whatsappSessionService");
class InstanceManager {
    constructor() {
        this.imcenterService = new imcenterService_1.ImCenterService();
        this.whatsappSession = new whatsappSessionService_1.WhatsappSessionService();
        this.instances = new Map();
    }
    createInstance(imcenter_id) {
        if (this.instances.has(imcenter_id)) {
            throw new Error("Instance already exists.");
        }
        const instance = new whatsappService_1.WhatsappService(imcenter_id);
        this.instances.set(imcenter_id, instance);
        return instance;
    }
    /**
     * Membuat atau mendapatkan instance berdasarkan imcenter_id
     */
    getInstance(imcenter_id) {
        if (!this.instances.has(imcenter_id)) {
            const instance = new whatsappService_1.WhatsappService(imcenter_id);
            this.instances.set(imcenter_id, instance);
        }
        return this.instances.get(imcenter_id);
    }
    /**
     * Hapus instance berdasarkan imcenter_id
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
    checkAutoActiveSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            const imcenters = yield this.imcenterService.getAutoActiveSession();
            const sessions = yield this.whatsappSession.getSessionByListJID(imcenters.map(imcenter => imcenter.nomorhp));
            // for (const session of sessions) {
            //     const socket = this.getInstance(session.);
            //     socket.init();
            // }
        });
    }
}
module.exports = new InstanceManager();
//# sourceMappingURL=instanceManagerService.js.map