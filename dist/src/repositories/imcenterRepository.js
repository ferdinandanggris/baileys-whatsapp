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
exports.ImcenterRepository = void 0;
const typeorm_1 = require("typeorm");
const db_1 = require("../configs/db");
const imcenter_1 = __importDefault(require("../entities/imcenter"));
class ImcenterRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(imcenter_1.default);
    }
    fetchById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findOne({ where: { id } });
        });
    }
    updateActivityById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.update(id, { tgl_aktivitas: new Date() });
            return true;
        });
    }
    fetchByStatusLogin(status_login) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.find({ where: { status_login: (0, typeorm_1.In)(status_login) } });
        });
    }
}
exports.ImcenterRepository = ImcenterRepository;
//# sourceMappingURL=imcenterRepository.js.map