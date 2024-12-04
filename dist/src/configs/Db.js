"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const WhatsappSession_1 = require("../entities/WhatsappSession");
const Imcenter_1 = require("../entities/Imcenter");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database: 'whatsapp_gw',
    entities: [WhatsappSession_1.WhatsappSession, Imcenter_1.Imcenter],
    synchronize: true, // Auto-create tables (use migrations in production)
});
//# sourceMappingURL=Db.js.map