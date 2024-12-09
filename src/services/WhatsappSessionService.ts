import { makeWASocket, DisconnectReason, useMultiFileAuthState, makeCacheableSignalKeyStore, AuthenticationCreds, SignalKeyStore } from "baileys";
import { AppDataSource } from "../configs/db";
import { WhatsappSession } from "../entities/whatsappSession";
import { In } from "typeorm";
const instanceManager = require("./instanceManagerService")

export class WhatsappSessionService {

    private repository = AppDataSource.getRepository(WhatsappSession);

    async getSessionByListJID(listJID: string[]): Promise<WhatsappSession[]> {
        return this.repository.find({ where: { nomorhp: In(listJID) } });
    }
}