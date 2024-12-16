import { DataSource } from "typeorm";
import { WhatsappSession } from "../entities/whatsappSession";
import { ImcenterLogs } from "../entities/imcenterLogs";
import Imcenter from "../entities/imcenter";
import { Parameter } from "../entities/parameter";
import { Reseller } from "../entities/reseller";
import { Pengirim } from "../entities/pengirim";
import { Merchant } from "../entities/merchant";
import { ParameterGriyaBayar } from "../entities/parameterGriyabayar";
import { InboxGriyabayar } from "../entities/inboxGriyabayar";
import { PengirimGriyabayar } from "../entities/pengirimGriyabayar";
require('dotenv').config()

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOSTNAME || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [WhatsappSession, Imcenter, ImcenterLogs, Parameter, Reseller, Pengirim, Merchant, Parameter, ParameterGriyaBayar, InboxGriyabayar,PengirimGriyabayar],
    synchronize: false, // Auto-create tables (use migrations in production)
});