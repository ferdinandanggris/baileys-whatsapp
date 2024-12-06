import { makeWASocket, DisconnectReason, useMultiFileAuthState, makeCacheableSignalKeyStore, AuthenticationCreds, SignalKeyStore } from "baileys";
import { AppDataSource } from "../configs/db";
import { WhatsappSession } from "../entities/whatsappSession";
import { Boom } from '@hapi/boom';
import QRCode from "qrcode";
import P from 'pino';
import fs from 'fs';
import { ImCenterService } from "./imcenterService";
import { In } from "typeorm";
import { Imcenter } from "../entities/imcenter";
const instanceManager = require("./instanceManagerService")

export class WhatsappSessionService {

    private repository = AppDataSource.getRepository(WhatsappSession);

    async getSessionByListJID(listJID: string[]): Promise<WhatsappSession[]> {
        return this.repository.find({ where: { nomorhp: In(listJID) } });
    }
}