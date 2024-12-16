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
const merchant_1 = require("../../entities/merchant");
const pengirim_1 = require("../../entities/pengirim");
const pengirimGriyabayar_1 = require("../../entities/pengirimGriyabayar");
const reseller_1 = require("../../entities/reseller");
class ResellerService {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(reseller_1.Reseller);
    }
    findByPhoneNumber(phone_number, is_griyabayar, tipe) {
        return __awaiter(this, void 0, void 0, function* () {
            if (is_griyabayar) {
                if (phone_number.startsWith('62')) {
                    phone_number = phone_number.replace('62', '0');
                    phone_number = `0${phone_number}`;
                }
                return yield this.repository.createQueryBuilder('reseller')
                    .leftJoinAndSelect(pengirimGriyabayar_1.PengirimGriyabayar, "pengirim", "pengirim.id_reseller = reseller.id")
                    .where('pengirim.pengirim = :phone_number', { phone_number })
                    .andWhere('pengirim.tipe = :tipe', { tipe }).getOne();
            }
            return yield this.repository.createQueryBuilder('reseller')
                .leftJoinAndSelect(merchant_1.Merchant, "merchant", "merchant.id = reseller.id_merchant")
                .leftJoinAndSelect(pengirim_1.Pengirim, "pengirim", "pengirim.id_merchant = merchant.id")
                .where('pengirim.pengirim = :phone_number', { phone_number })
                .andWhere('pengirim.tipe = :tipe', { tipe }).getOne();
        });
    }
}
exports.default = ResellerService;
//# sourceMappingURL=resellerService.js.map