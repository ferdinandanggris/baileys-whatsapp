import { DataSource } from "typeorm";
import { WhatsappSession } from "../entities/whatsappSession";
import { ImcenterLogs } from "../entities/imcenterLogs";
import Imcenter from "../entities/imcenter";
import { Parameter } from "../entities/parameter";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database: 'onpay2',
    entities: [WhatsappSession, Imcenter, ImcenterLogs, Parameter],
    synchronize: false, // Auto-create tables (use migrations in production)
});