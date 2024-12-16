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
const parameter_1 = require("../../../entities/parameter");
const db_1 = require("../../../configs/db");
const parameterGriyabayar_1 = require("../../../entities/parameterGriyabayar");
class ParameterService {
    constructor() {
        this.repository = {
            default: db_1.AppDataSource.getRepository(parameter_1.Parameter),
            griyabayar: db_1.AppDataSource.getRepository(parameterGriyabayar_1.ParameterGriyaBayar)
        };
    }
    getParameterAutoResponse(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.griyabayar.createQueryBuilder('parameter').where(`key = LEFT('${key}',${key.length})`).addOrderBy("prioritas", "ASC").getOne();
        });
    }
    findByGroupAndKey(group, key, griyabayar) {
        return __awaiter(this, void 0, void 0, function* () {
            if (griyabayar)
                return this.repository.griyabayar.findOne({ where: { group: group, key } });
            return this.repository.default.findOne({ where: { group: group, key } });
        });
    }
}
exports.default = ParameterService;
//# sourceMappingURL=parameterService.js.map