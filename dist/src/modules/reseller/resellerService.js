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
const db_1 = require("../../configs/db");
const reseller_1 = require("../../entities/reseller");
const resellerGriyabayar_1 = require("../../entities/resellerGriyabayar");
class ResellerService {
    constructor() {
        this.repository = {
            default: db_1.AppDataSource.getRepository(reseller_1.Reseller),
            griyabayar: db_1.AppDataSource.getRepository(resellerGriyabayar_1.ResellerGriyabayar)
        };
    }
    findByPhoneNumber(phone_number, is_griyabayar, tipe) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            if (is_griyabayar) {
                if (phone_number.startsWith('62')) {
                    phone_number = phone_number.substring(2);
                    phone_number = `0${phone_number}`;
                }
                const result = yield this.repository.griyabayar.createQueryBuilder('reseller')
                    .leftJoinAndSelect("reseller.pengirim", "pengirim")
                    .where('pengirim.pengirim = :phone_number', { phone_number })
                    .andWhere('pengirim.tipe = :tipe', { tipe }).getOne();
                // object Keys to type Reseller
                var reseller = {
                    kode: result === null || result === void 0 ? void 0 : result.kode,
                    tipe: (_a = result === null || result === void 0 ? void 0 : result.pengirim[0]) === null || _a === void 0 ? void 0 : _a.tipe,
                    id_reseller: result === null || result === void 0 ? void 0 : result.id
                };
                return reseller;
            }
            const result = yield this.repository.default.createQueryBuilder('reseller')
                .leftJoinAndSelect("reseller.merchant", "merchant")
                .leftJoinAndSelect("merchant.pengirim", "pengirim")
                .where('pengirim.pengirim = :phone_number', { phone_number })
                .andWhere('pengirim.tipe = :tipe', { tipe }).getOne();
            var reseller = {
                kode: result === null || result === void 0 ? void 0 : result.kode,
                tipe: (_c = (_b = result === null || result === void 0 ? void 0 : result.merchant) === null || _b === void 0 ? void 0 : _b.pengirim[0]) === null || _c === void 0 ? void 0 : _c.tipe,
                id_reseller: result === null || result === void 0 ? void 0 : result.id,
                id_master: (_d = result === null || result === void 0 ? void 0 : result.merchant) === null || _d === void 0 ? void 0 : _d.id_master,
                id_merchant: (_e = result === null || result === void 0 ? void 0 : result.merchant) === null || _e === void 0 ? void 0 : _e.id
            };
            return reseller;
        });
    }
}
exports.default = ResellerService;
//# sourceMappingURL=resellerService.js.map