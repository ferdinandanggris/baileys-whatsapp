import makeWASocket, { DisconnectReason, useMultiFileAuthState } from 'baileys';
import { WhatsappSession } from '../entities/WhatsappSession';
import { AppDataSource } from '../configs/Db';
import { Boom } from '@hapi/boom';

export class SessionService {
    private repository = AppDataSource.getRepository(WhatsappSession);

    private qrCodes: Map<string, string> = new Map();

    async createSession(sessionKey: string): Promise<string> {
        const existingSession = await this.repository.findOneBy({ sessionKey });

        const { state, saveCreds } = await useMultiFileAuthState(`./auth/${sessionKey}`);
        if (existingSession?.sessionData) {
            // state.creds = existingSession.sessionData; // Memuat sesi dari database
        }

        const sock = makeWASocket({
            auth: state,
        });

        sock.ev.on('creds.update', async () => {
            await this.saveSessionData(sessionKey, state.creds);
        });

        sock.ev.on('connection.update', (update) => {
            const { connection, qr, lastDisconnect } = update;

            if (connection === 'close') {
                const error = (lastDisconnect?.error as Boom)?.output?.statusCode;

                if (error === DisconnectReason.loggedOut) {
                    console.log(`Session "${sessionKey}" logged out. Clearing data.`);
                    this.clearSessionData(sessionKey); // Hapus data sesi dari database
                } else {
                    console.log(`Reconnecting session "${sessionKey}"...`);
                    this.createSession(sessionKey); // Coba rekoneksi
                }
            }

            if (qr) {
                console.log(`Generated QR for session "${sessionKey}":`, qr);
                this.qrCodes.set(sessionKey, qr); // Simpan QR baru
            }

            if (connection === 'open') {
                console.log(`Session "${sessionKey}" connected.`);
                this.qrCodes.delete(sessionKey); // QR berhasil digunakan
            }
        });

        return existingSession ? `Session "${sessionKey}" reloaded.` : `Session "${sessionKey}" created.`;
    }

    // Hapus data sesi jika pengguna logout
    private async clearSessionData(sessionKey: string): Promise<void> {
        const session = await this.repository.findOneBy({ sessionKey });
        if (session) {
            session.sessionData = null;
            await this.repository.save(session);
        }
    }

    // Menyimpan data sesi ke database
    private async saveSessionData(sessionKey: string, sessionData: Record<string, any>): Promise<void> {
        const session = await this.repository.findOneBy({ sessionKey });
        if (session) {
            session.sessionData = sessionData;
            await this.repository.save(session);
        }
    }

    // Mendapatkan semua sesi
    async getAllSessions(): Promise<WhatsappSession[]> {
        return this.repository.find();
    }

    // Menghapus sesi
    async deleteSession(sessionKey: string): Promise<string> {
        const session = await this.repository.findOneBy({ sessionKey });
        if (!session) {
            throw new Error(`Session with key "${sessionKey}" not found.`);
        }

        await this.repository.delete({ sessionKey });
        return `Session "${sessionKey}" deleted.`;
    }
}