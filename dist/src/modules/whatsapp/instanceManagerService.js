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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceManager = void 0;
const imcenterService_1 = require("./services/imcenterService");
const sessionService_1 = __importDefault(require("./services/sessionService"));
const types_1 = require("../../entities/types");
const whatsappService_1 = require("./whatsappService");
class InstanceManager {
    constructor() {
        this.imcenterService = new imcenterService_1.ImCenterService();
        this.sessionService = new sessionService_1.default();
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
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.instances.has(imcenter_id)) {
                    const instance = new whatsappService_1.WhatsappService(imcenter_id);
                    yield instance.init();
                    this.instances.set(imcenter_id, instance);
                }
                return this.instances.get(imcenter_id);
            }
            catch (error) {
                console.log(error);
            }
        });
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
        const activeSessions = [];
        for (const [imcenter_id, instance] of this.instances) {
            if (instance.connectionState.connection === "open") {
                activeSessions.push(imcenter_id);
            }
        }
        return activeSessions;
    }
    /**
     * Logout semua instance
     */
    logoutAll() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const [imcenter_id, instance] of this.instances) {
                yield instance.connectionHandler.logout();
                this.removeInstance(imcenter_id);
            }
            console.log("All instances logged out.");
        });
    }
    loginAllSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            const imcenters = yield this.imcenterService.getNotHaveLoginStatus(types_1.STATUS_LOGIN.SUDAH_LOGIN);
            for (const imcenter of imcenters) {
                const socket = yield this.getInstance(imcenter.id);
                yield socket.connect();
            }
        });
    }
    autoActiveSession() {
        return __awaiter(this, void 0, void 0, function* () {
            const imcentersAutoActive = yield this.imcenterService.getAutoActiveSession();
            const sessions = yield this.sessionService.getSessionByListImcenterId(imcentersAutoActive.map(imcenter => imcenter.id));
            const sessionActive = yield this.sessionService.getAllSession();
            const imcenters = yield this.imcenterService.getAllSessions();
            for (const imcenter of imcenters) {
                if (sessionActive.find(session => session.imcenter_id === imcenter.id)) {
                    continue;
                }
                yield this.imcenterService.updateStatus(imcenter.id, types_1.STATUS_LOGIN.BELUM_LOGIN);
            }
            for (const session of sessions) {
                const socket = yield this.getInstance(session.imcenter_id);
                socket.connect();
            }
        });
    }
}
exports.InstanceManager = InstanceManager;
module.exports = new InstanceManager();
//# sourceMappingURL=instanceManagerService.js.map