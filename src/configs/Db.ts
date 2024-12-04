import { DataSource } from "typeorm";
import { WhatsappSession } from "../entities/WhatsappSession";
import { Imcenter } from "../entities/Imcenter";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database: 'whatsapp_gw',
    entities: [WhatsappSession, Imcenter],
    synchronize: true, // Auto-create tables (use migrations in production)
});