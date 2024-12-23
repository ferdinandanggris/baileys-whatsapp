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
exports.Reseller = void 0;
const typeorm_1 = require("typeorm");
const merchant_1 = require("./merchant");
let Reseller = class Reseller {
};
exports.Reseller = Reseller;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Reseller.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Reseller.prototype, "kode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Reseller.prototype, "id_master", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Reseller.prototype, "id_merchant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Reseller.prototype, "id_upline", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Reseller.prototype, "markup", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Reseller.prototype, "keterangan", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipe_pendaftaran', type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Reseller.prototype, "tipePendaftaran", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tgl_pendaftaran', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Reseller.prototype, "tglPendaftaran", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tgl_aktivitas', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Reseller.prototype, "tglAktivitas", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tgl_update', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Reseller.prototype, "tglUpdate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => merchant_1.Merchant),
    (0, typeorm_1.JoinColumn)({ name: 'id_merchant' }),
    __metadata("design:type", merchant_1.Merchant)
], Reseller.prototype, "merchant", void 0);
exports.Reseller = Reseller = __decorate([
    (0, typeorm_1.Entity)('reseller', { schema: 'processor' })
], Reseller);
//# sourceMappingURL=reseller.js.map