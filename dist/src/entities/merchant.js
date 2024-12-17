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
exports.Merchant = void 0;
const typeorm_1 = require("typeorm");
const types_1 = require("./types");
const reseller_1 = require("./reseller");
const pengirim_1 = require("./pengirim");
let Merchant = class Merchant {
};
exports.Merchant = Merchant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Merchant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "kode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Merchant.prototype, "id_master", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "nama", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "nama_pemilik", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "pin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password' }),
    __metadata("design:type", String)
], Merchant.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Merchant.prototype, "poin", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Merchant.prototype, "saldo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Merchant.prototype, "aktif", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Object.values(types_1.GROUP_MERCHANT), default: types_1.GROUP_MERCHANT.RETAIL }),
    __metadata("design:type", String)
], Merchant.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "otp", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "otp_expired", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Merchant.prototype, "otp_counter", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Merchant.prototype, "pin_counter", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Merchant.prototype, "provinsi", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Merchant.prototype, "kabupaten", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Merchant.prototype, "kecamatan", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Merchant.prototype, "kelurahan", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "alamat", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "lokasi", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "ip_address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "url_report", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "nik_ktp", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "foto_ktp", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "foto_kyc", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Merchant.prototype, "validasi_ktp", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Merchant.prototype, "validasi_email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "keterangan", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "follow_up", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Object.values(types_1.TIPE_AKTIVITAS), default: types_1.TIPE_AKTIVITAS.BARU_1_HARI }),
    __metadata("design:type", String)
], Merchant.prototype, "tipe_aktivitas", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "tgl_aktivitas", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "tgl_created", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Merchant.prototype, "tgl_update", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reseller_1.Reseller, reseller => reseller.merchant),
    (0, typeorm_1.JoinColumn)({ referencedColumnName: 'id_merchant' }),
    __metadata("design:type", Array)
], Merchant.prototype, "resellers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pengirim_1.Pengirim, pengirim => pengirim.merchant),
    (0, typeorm_1.JoinColumn)({ referencedColumnName: 'id_merchant' }),
    __metadata("design:type", Array)
], Merchant.prototype, "pengirim", void 0);
exports.Merchant = Merchant = __decorate([
    (0, typeorm_1.Entity)('merchant', { schema: 'processor' })
], Merchant);
//# sourceMappingURL=merchant.js.map