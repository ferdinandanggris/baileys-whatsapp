import { DataSource } from "typeorm";
import { WhatsappSession } from "../entities/whatsappSession";
import { Imcenter } from "../entities/imcenter";
import { ImcenterLogs } from "../entities/imcenterLogs";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database: 'whatsapp_gw',
    entities: [WhatsappSession, Imcenter, ImcenterLogs],
    synchronize: true, // Auto-create tables (use migrations in production)
});