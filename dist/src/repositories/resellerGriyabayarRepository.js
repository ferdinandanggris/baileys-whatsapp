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
exports.ResellerGriyabayarRepository = void 0;
const db_1 = require("../configs/db");
const resellerGriyabayar_1 = require("../entities/resellerGriyabayar");
class ResellerGriyabayarRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(resellerGriyabayar_1.ResellerGriyabayar);
    }
    findByPhoneNumber(phone_number, tipe) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield this.repository.createQueryBuilder('reseller')
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
        });
    }
}
exports.ResellerGriyabayarRepository = ResellerGriyabayarRepository;
//# sourceMappingURL=resellerGriyabayarRepository.js.map