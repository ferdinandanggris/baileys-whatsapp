"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const whatsappSession_1 = require("../entities/whatsappSession");
const imcenterLogs_1 = require("../entities/imcenterLogs");
const imcenter_1 = __importDefault(require("../entities/imcenter"));
const parameter_1 = require("../entities/parameter");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database: 'onpay2',
    entities: [whatsappSession_1.WhatsappSession, imcenter_1.default, imcenterLogs_1.ImcenterLogs, parameter_1.Parameter],
    synchronize: false, // Auto-create tables (use migrations in production)
});
//# sourceMappingURL=db.js.map