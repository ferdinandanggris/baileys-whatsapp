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
exports.ImCenterService = void 0;
const Db_1 = require("../configs/Db");
const imcenter_1 = require("../entities/imcenter");
class ImCenterService {
    constructor() {
        this.repository = Db_1.AppDataSource.getRepository(imcenter_1.Imcenter);
    }
    createImcenter(number) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingSession = yield this.repository.findOneBy({ nomorhp: number });
            if (existingSession) {
                return `Imcenter with number "${number}" already exists.`;
            }
            yield this.repository.save({ nomorhp: number, aktif: false, standby: false });
        });
    }
    // Mendapatkan semua sesi
    getAllSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.find();
        });
    }
    // Menghapus sesi
    deleteSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.repository.findOneBy({ id });
            if (!session) {
                throw new Error(`Session with key "${id}" not found.`);
            }
            yield this.repository.delete({ id });
            return `Session "${id}" deleted.`;
        });
    }
    getSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.repository.findOneBy({ id });
            if (!session) {
                throw new Error(`Session with key "${id}" not found.`);
            }
            return session;
        });
    }
    getAutoActiveSession() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findBy({ aktif: true });
        });
    }
}
exports.ImCenterService = ImCenterService;
//# sourceMappingURL=imcenterService.js.map