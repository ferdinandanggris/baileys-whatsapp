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
exports.ImcenterLogs = void 0;
const typeorm_1 = require("typeorm");
let ImcenterLogs = class ImcenterLogs {
};
exports.ImcenterLogs = ImcenterLogs;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ImcenterLogs.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ImcenterLogs.prototype, "tgl_entry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ImcenterLogs.prototype, "imcenter_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ImcenterLogs.prototype, "message_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['log', 'outbox', 'inbox'], default: 'log' }),
    __metadata("design:type", String)
], ImcenterLogs.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ImcenterLogs.prototype, "keterangan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ImcenterLogs.prototype, "kode_reseller", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ImcenterLogs.prototype, "pengirim", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['Diterima', 'Dibaca'], nullable: true }),
    __metadata("design:type", String)
], ImcenterLogs.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ImcenterLogs.prototype, "raw_message", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ImcenterLogs.prototype, "sender_timestamp", void 0);
exports.ImcenterLogs = ImcenterLogs = __decorate([
    (0, typeorm_1.Entity)('imcenter_logs')
], ImcenterLogs);
//# sourceMappingURL=imcenterLogs.js.map