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
require('dotenv').config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOSTNAME || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [whatsappSession_1.WhatsappSession, imcenter_1.default, imcenterLogs_1.ImcenterLogs, parameter_1.Parameter],
    synchronize: false, // Auto-create tables (use migrations in production)
});
//# sourceMappingURL=db.js.map