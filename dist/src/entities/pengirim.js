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
exports.Pengirim = void 0;
const typeorm_1 = require("typeorm");
const types_1 = require("./types");
const merchant_1 = require("./merchant");
let Pengirim = class Pengirim {
};
exports.Pengirim = Pengirim;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pengirim.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Object.values(types_1.TIPE_PENGIRIM), nullable: true }),
    __metadata("design:type", String)
], Pengirim.prototype, "tipe", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Pengirim.prototype, "pengirim", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Pengirim.prototype, "id_merchant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Pengirim.prototype, "aktif", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Pengirim.prototype, "utama", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Pengirim.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Pengirim.prototype, "token_access", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Pengirim.prototype, "token_refresh", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Pengirim.prototype, "token_firebase", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { array: true, default: () => 'ARRAY[]::character varying[]' }),
    __metadata("design:type", Array)
], Pengirim.prototype, "sender_process", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Pengirim.prototype, "tgl_aktivitas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Pengirim.prototype, "tgl_validasi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Pengirim.prototype, "tgl_created", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Pengirim.prototype, "tgl_update", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => merchant_1.Merchant),
    (0, typeorm_1.JoinColumn)({ name: 'id_merchant' }),
    __metadata("design:type", merchant_1.Merchant)
], Pengirim.prototype, "merchant", void 0);
exports.Pengirim = Pengirim = __decorate([
    (0, typeorm_1.Entity)('pengirim', { schema: 'processor' })
], Pengirim);
//# sourceMappingURL=pengirim.js.map