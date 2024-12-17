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
exports.PengirimGriyabayar = void 0;
const typeorm_1 = require("typeorm");
const types_1 = require("./types");
const resellerGriyabayar_1 = require("./resellerGriyabayar");
let PengirimGriyabayar = class PengirimGriyabayar {
};
exports.PengirimGriyabayar = PengirimGriyabayar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PengirimGriyabayar.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Object.values(types_1.TIPE_PENGIRIM), nullable: false }) // Replace with actual enum values
    ,
    __metadata("design:type", String)
], PengirimGriyabayar.prototype, "tipe", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], PengirimGriyabayar.prototype, "pengirim", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], PengirimGriyabayar.prototype, "id_reseller", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, nullable: false }),
    __metadata("design:type", Boolean)
], PengirimGriyabayar.prototype, "aktif", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, nullable: false }),
    __metadata("design:type", Boolean)
], PengirimGriyabayar.prototype, "utama", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], PengirimGriyabayar.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], PengirimGriyabayar.prototype, "token_access", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], PengirimGriyabayar.prototype, "token_refresh", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], PengirimGriyabayar.prototype, "token_firebase", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, default: () => 'ARRAY[]::character varying[]', nullable: false }),
    __metadata("design:type", Array)
], PengirimGriyabayar.prototype, "sender_process", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PengirimGriyabayar.prototype, "tgl_validasi", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], PengirimGriyabayar.prototype, "tgl_created", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], PengirimGriyabayar.prototype, "tgl_update", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PengirimGriyabayar.prototype, "tgl_aktivitas", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => resellerGriyabayar_1.ResellerGriyabayar),
    (0, typeorm_1.JoinColumn)({ name: 'id_reseller' }),
    __metadata("design:type", resellerGriyabayar_1.ResellerGriyabayar)
], PengirimGriyabayar.prototype, "reseller", void 0);
exports.PengirimGriyabayar = PengirimGriyabayar = __decorate([
    (0, typeorm_1.Entity)({ name: 'pengirim', schema: 'griyabayar' }),
    (0, typeorm_1.Unique)(['tipe', 'pengirim'])
], PengirimGriyabayar);
//# sourceMappingURL=pengirimGriyabayar.js.map