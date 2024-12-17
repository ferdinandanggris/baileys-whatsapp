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
exports.Inbox = void 0;
const typeorm_1 = require("typeorm");
const types_1 = require("./types");
let Inbox = class Inbox {
};
exports.Inbox = Inbox;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Inbox.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Inbox.prototype, "tgl_entri", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Inbox.prototype, "id_reseller", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Inbox.prototype, "id_merchant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Object.values(types_1.TIPE_PENGIRIM), nullable: false }) // Replace with actual enum values
    ,
    __metadata("design:type", String)
], Inbox.prototype, "tipe", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Inbox.prototype, "penerima", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Inbox.prototype, "pengirim", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Inbox.prototype, "pesan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Object.values(types_1.STATUS_INBOX), nullable: false }) // Replace with actual enum values
    ,
    __metadata("design:type", String)
], Inbox.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Inbox.prototype, "tgl_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Inbox.prototype, "id_imcenter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Inbox.prototype, "id_smsgateway", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Inbox.prototype, "id_supplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], Inbox.prototype, "id_transaksi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], Inbox.prototype, "id_outbox", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Inbox.prototype, "service_center", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Inbox.prototype, "raw_message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Inbox.prototype, "sender_timestamp", void 0);
exports.Inbox = Inbox = __decorate([
    (0, typeorm_1.Entity)({ name: 'inbox', schema: 'processor' })
], Inbox);
//# sourceMappingURL=inbox.js.map