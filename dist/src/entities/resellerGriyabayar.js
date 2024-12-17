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
exports.ResellerGriyabayar = void 0;
const typeorm_1 = require("typeorm");
const types_1 = require("./types");
const pengirimGriyabayar_1 = require("./pengirimGriyabayar");
let ResellerGriyabayar = class ResellerGriyabayar {
};
exports.ResellerGriyabayar = ResellerGriyabayar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' }),
    __metadata("design:type", Number)
], ResellerGriyabayar.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], ResellerGriyabayar.prototype, "kode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ResellerGriyabayar.prototype, "id_pp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], ResellerGriyabayar.prototype, "kode_pp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ResellerGriyabayar.prototype, "id_provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], ResellerGriyabayar.prototype, "kode_provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], ResellerGriyabayar.prototype, "nama", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ResellerGriyabayar.prototype, "aktif", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ResellerGriyabayar.prototype, "upline", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ResellerGriyabayar.prototype, "markup", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ResellerGriyabayar.prototype, "fee_tunda", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', default: 0 }),
    __metadata("design:type", Number)
], ResellerGriyabayar.prototype, "saldo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', default: 0 }),
    __metadata("design:type", Number)
], ResellerGriyabayar.prototype, "selisih", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ResellerGriyabayar.prototype, "otp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ResellerGriyabayar.prototype, "otp_expired", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], ResellerGriyabayar.prototype, "otp_counter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ResellerGriyabayar.prototype, "provinsi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ResellerGriyabayar.prototype, "kabupaten", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ResellerGriyabayar.prototype, "kecamatan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ResellerGriyabayar.prototype, "kelurahan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], ResellerGriyabayar.prototype, "alamat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ResellerGriyabayar.prototype, "lokasi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ResellerGriyabayar.prototype, "nik_ktp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ResellerGriyabayar.prototype, "foto_ktp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ResellerGriyabayar.prototype, "foto_kyc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ResellerGriyabayar.prototype, "validasi_ktp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ResellerGriyabayar.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ResellerGriyabayar.prototype, "validasi_email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ResellerGriyabayar.prototype, "keterangan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ResellerGriyabayar.prototype, "follow_up", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Object.keys(types_1.TIPE_AKTIVITAS), default: types_1.TIPE_AKTIVITAS.BARU_1_HARI }),
    __metadata("design:type", String)
], ResellerGriyabayar.prototype, "tipe_aktivitas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ResellerGriyabayar.prototype, "tgl_aktivitas", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], ResellerGriyabayar.prototype, "tgl_created", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], ResellerGriyabayar.prototype, "tgl_sinkron", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], ResellerGriyabayar.prototype, "tgl_update", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pengirimGriyabayar_1.PengirimGriyabayar, pengirim => pengirim.reseller),
    (0, typeorm_1.JoinColumn)({ foreignKeyConstraintName: 'id_reseller' }),
    __metadata("design:type", Array)
], ResellerGriyabayar.prototype, "pengirim", void 0);
exports.ResellerGriyabayar = ResellerGriyabayar = __decorate([
    (0, typeorm_1.Entity)('reseller', { schema: 'griyabayar' })
], ResellerGriyabayar);
//# sourceMappingURL=resellerGriyabayar.js.map