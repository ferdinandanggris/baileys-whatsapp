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
exports.ResellerRepository = void 0;
const db_1 = require("../configs/db");
const reseller_1 = require("../entities/reseller");
class ResellerRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(reseller_1.Reseller);
    }
    findByPhoneNumber(phone_number, tipe) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const result = yield this.repository.createQueryBuilder('reseller')
                .leftJoinAndSelect("reseller.merchant", "merchant")
                .leftJoinAndSelect("merchant.pengirim", "pengirim")
                .where('pengirim.pengirim = :phone_number', { phone_number })
                .andWhere('pengirim.tipe = :tipe', { tipe }).getOne();
            var reseller = {
                kode: result === null || result === void 0 ? void 0 : result.kode,
                tipe: (_b = (_a = result === null || result === void 0 ? void 0 : result.merchant) === null || _a === void 0 ? void 0 : _a.pengirim[0]) === null || _b === void 0 ? void 0 : _b.tipe,
                id_reseller: result === null || result === void 0 ? void 0 : result.id,
                id_master: (_c = result === null || result === void 0 ? void 0 : result.merchant) === null || _c === void 0 ? void 0 : _c.id_master,
                id_merchant: (_d = result === null || result === void 0 ? void 0 : result.merchant) === null || _d === void 0 ? void 0 : _d.id
            };
            return reseller;
        });
    }
}
exports.ResellerRepository = ResellerRepository;
//# sourceMappingURL=resellerRepository.js.map