"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const whatsappSession_1 = require("../entities/whatsappSession");
const imcenter_1 = require("../entities/imcenter");
const imcenterLogs_1 = require("../entities/imcenterLogs");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database: 'whatsapp_gw',
    entities: [whatsappSession_1.WhatsappSession, imcenter_1.Imcenter, imcenterLogs_1.ImcenterLogs],
    synchronize: true, // Auto-create tables (use migrations in production)
});
//# sourceMappingURL=db.js.map