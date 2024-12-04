import { makeWASocket, DisconnectReason, useMultiFileAuthState, makeCacheableSignalKeyStore } from "baileys";
import { AppDataSource } from "../configs/Db";
import { WhatsappSession } from "../entities/WhatsappSession";
import { Boom } from '@hapi/boom';
import QRCode from "qrcode";
import P from 'pino';
import fs from 'fs';

export class WhatsappSessionService {

    private repository = AppDataSource.getRepository(WhatsappSession);
    private qrCodes: Map<string, string> = new Map();

    // Membuat sesi baru
    async createSession(nomorhp: string) {
        const logger = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` }, P.destination('./wa-logs.txt'))
        // Check pada folder auth_info_baileys
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys' + nomorhp); // Cek apakah ada sesi yang tersimpan
        // jika sesi ada maka akan mengembalikan pesan

        if(state.creds){
            var sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys : state.keys,
                },
                
                printQRInTerminal: true
            });
            sock.ev.on('connection.update', (update) => {
                const { connection, qr, lastDisconnect } = update;
    
                if (connection === 'close') {
                    const error = (lastDisconnect?.error as Boom)?.output?.statusCode;
    
                    if (error === DisconnectReason.loggedOut) {
                        console.log(`Session "${nomorhp}" logged out. Clearing data.`);
                        this.clearSessionData(nomorhp); // Hapus data sesi dari database
                        //remove directory auth_info_baileys + nomorhp
                        fs.rmdirSync('auth_info_baileys' + nomorhp, { recursive: true });

                        //reconnect
                        this.createSession(nomorhp);
                        // clear from file 'auth_info_baileys'
                    } else if(DisconnectReason.connectionLost){
                        console.log(`Session "${nomorhp}" connection lost. Reconnecting...`);
                        this.createSession(nomorhp);
                    }else{
                        console.log(`Session "${nomorhp}" connection closed due to error ${error}. Reconnecting...`);
                        this.createSession(nomorhp);
                    }
                }
    
                if (qr) {
                    console.log(`Generated QR for session "${nomorhp}":`, qr);
                        this.qrCodes.set(nomorhp, qr); // Simpan QR baru
                }
    
                if (connection === 'open') {
                    console.log(`Session "${nomorhp}" connected.`);
                    this.qrCodes.delete(nomorhp); // QR berhasil digunakan
                }

                sock.ev.on('messages.upsert', async m => {  
                    console.log(JSON.stringify(m, undefined, 2))
            
                    console.log(m);
                    console.log('replying to', m.messages[0].key.remoteJid)
                    await sock.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there!' })
                })
            });
        }else{
            var sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys : state.keys,
                },
                
                printQRInTerminal: true
            });
    
            sock.ev.on('connection.update', (update) => {
                const { connection, qr, lastDisconnect } = update;
    
                if (connection === 'close') {
                    const error = (lastDisconnect?.error as Boom)?.output?.statusCode;
    
                    if (error === DisconnectReason.loggedOut) {
                        console.log(`Session "${nomorhp}" logged out. Clearing data.`);
                        this.clearSessionData(nomorhp); // Hapus data sesi dari database
                        // clear from file 'auth_info_baileys'
                    } else if(DisconnectReason.connectionLost){
                        console.log(`Session "${nomorhp}" connection lost. Reconnecting...`);
                        this.createSession(nomorhp);
                    }else{
                        console.log(`Session "${nomorhp}" connection closed due to error ${error}. Reconnecting...`);
                        this.createSession(nomorhp);
                    }
                }
    
                if (qr) {
                    console.log(`Generated QR for session "${nomorhp}":`, qr);
                        this.qrCodes.set(nomorhp, qr); // Simpan QR baru
                }
    
                if (connection === 'open') {
                    console.log(`Session "${nomorhp}" connected.`);
                    this.qrCodes.delete(nomorhp); // QR berhasil digunakan
                }
            });
    
            sock.ev.on('creds.update', async () => {
                await this.saveSessionData(nomorhp, state.creds);
                saveCreds();
            });
        }

        
    }

    // Hapus data sesi jika pengguna logout
    private async clearSessionData(sessionKey: string): Promise<void> {
        const session = await this.repository.findOneBy({ sessionKey });
        if (session) {
            session.sessionData = null;
            await this.repository.save(session);
        }
    }

    // Menyimpan data sesi
    private async saveSessionData(sessionKey: string, sessionData: Record<string, any>): Promise<void> {
        const session = await this.repository.findOneBy({ sessionKey });
        if (session) {
            session.sessionData = sessionData;
            await this.repository.save(session);
        }else{
            await this.repository.save({sessionKey, sessionData});
        }
    }

    // Mendapatkan QR Code terbaru
    async getQRCode(sessionKey: string): Promise<string> {
        if (this.qrCodes.has(sessionKey)) {
            return await QRCode.toDataURL(this.qrCodes.get(sessionKey));
        }
    }
}