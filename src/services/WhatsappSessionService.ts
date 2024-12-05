import { makeWASocket, DisconnectReason, useMultiFileAuthState, makeCacheableSignalKeyStore, AuthenticationCreds, SignalKeyStore } from "baileys";
import { AppDataSource } from "../configs/Db";
import { WhatsappSession } from "../entities/whatsappSession";
import { Boom } from '@hapi/boom';
import QRCode from "qrcode";
import P from 'pino';
import fs from 'fs';
import { ImCenterService } from "./imcenterService";
import { In } from "typeorm";
import { InstanceManager } from "./instanceManagerService";
import { Imcenter } from "../entities/imcenter";

export class WhatsappSessionService {

    private repository = AppDataSource.getRepository(WhatsappSession);
    private imcenterRepository = AppDataSource.getRepository(Imcenter);
    private instanceManager = new InstanceManager();

    // Membuat sesi baru
    async createSession(nomorhp: string) {
        const socket = this.instanceManager.getInstance(nomorhp);
        socket.connect();
    }

    // remove data sesi jika pengguna logout
    async removeSession(nomorhp: string) {
        const socket = this.instanceManager.getInstance(nomorhp);
        socket.disconnect();
        const session = await this.repository.findOneBy({ nomorhp });
        if (session) {
            await this.repository.delete({ nomorhp });
        }
    }

    public async updateModeStandby(standby: boolean, sessionId: string) {
        const imcenter = await this.imcenterRepository.findOneBy({ nomorhp: sessionId });
        if (imcenter) {
            imcenter.standby = standby;
            await this.imcenterRepository.save(imcenter);
        }
    }

    // Mendapatkan QR Code terbaru
    async getQRCode(sessionKey: string): Promise<string> {
        const imcenter = await this.imcenterRepository.findOneBy({ nomorhp: sessionKey });
        if (!imcenter) {
            throw new Error(`Imcenter with key "${sessionKey}" not found.`);
        }
        
        return imcenter.qrcode;
    }

    // Ambil sesi auto aktif dan cek apakah sesi masih aktif, jika tidak ubah status standby jadi false dan sebaliknya
    async checkAutoActiveSessions() {
        const imcentersService = new ImCenterService();
        const imcenters = await imcentersService.getAutoActiveSession();
        const sessions = await this.repository.find({ where: { nomorhp: In(imcenters.map(imcenter => imcenter.nomorhp)) } });

        for (const session of sessions) {
            const socket = this.instanceManager.getInstance(session.nomorhp);
            socket.connect();
        }
    }
}