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
exports.WhatsappSession = void 0;
const typeorm_1 = require("typeorm");
let WhatsappSession = class WhatsappSession {
};
exports.WhatsappSession = WhatsappSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], WhatsappSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], WhatsappSession.prototype, "jid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", unique: true }),
    __metadata("design:type", Number)
], WhatsappSession.prototype, "imcenter_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], WhatsappSession.prototype, "auth", void 0);
exports.WhatsappSession = WhatsappSession = __decorate([
    (0, typeorm_1.Entity)({ name: 'whatsapp_nodejs_sessions', schema: 'whatsapp' })
], WhatsappSession);
//# sourceMappingURL=whatsappSession.js.map