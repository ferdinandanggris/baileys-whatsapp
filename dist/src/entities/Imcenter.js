"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Imcenter = void 0;
const typeorm_1 = require("typeorm");
let Imcenter = class Imcenter {
};
exports.Imcenter = Imcenter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Imcenter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Imcenter.prototype, "nomorhp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bool' }),
    __metadata("design:type", Boolean)
], Imcenter.prototype, "aktif", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bool' }),
    __metadata("design:type", Boolean)
], Imcenter.prototype, "standby", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bool', default: false }),
    __metadata("design:type", Boolean)
], Imcenter.prototype, "auto_aktif", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Imcenter.prototype, "qrcode", void 0);
exports.Imcenter = Imcenter = __decorate([
    (0, typeorm_1.Entity)('imcenter')
], Imcenter);
//# sourceMappingURL=imcenter.js.map