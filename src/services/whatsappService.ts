import { AnyMessageContent, Browsers, ConnectionState, DisconnectReason, makeWASocket, useMultiFileAuthState, WAMessage } from "baileys";
import { Boom } from '@hapi/boom';
import { join } from "path";
import fs from 'fs';
import { AppDataSource } from "../configs/Db";
import { Imcenter } from "../entities/imcenter";
import QRCode from "qrcode";
import { ImcenterLogs } from "../entities/imcenterLogs";

export class WhatsappService {
    private sessionId: string;
    private socket: ReturnType<typeof makeWASocket>;
    private basePath: string;
    private path: string;

    private imcenterRepository = AppDataSource.getRepository(Imcenter);
    private imcenterLogRepository = AppDataSource.getRepository(ImcenterLogs);

    constructor(sessionId: string, basePath: string = "sessions") {
        this.sessionId = sessionId;
        this.basePath = basePath;
        this.path = join(this.basePath, this.sessionId);
    }

    /**
     * Connect ke WhatsApp menggunakan MultiFileAuthState
     */
    public async connect() {
        // Tentukan folder untuk setiap instance
        const sessionPath = join(this.basePath, this.sessionId);

        // Gunakan useMultiFileAuthState untuk membuat state autentikasi per instance
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

        this.socket = makeWASocket({
            auth: state,
            printQRInTerminal: true,   
            syncFullHistory: false,
            /** Default timeout for queries, undefined for no timeout */
            defaultQueryTimeoutMs: undefined,
        });
        this.socket.ev.on('connection.update', (update) => {
            this.handleConnectionUpdate(this.path, update);
        })
        this.handleReceiveMessage();
        this.socket.ev.on('creds.update', () => {
            saveCreds();
        });
    }

    public async disconnect() {
        if (this.socket) {
            await this.socket.logout();
            this.socket = null;
        }
    }

    private async handleReceiveMessage() {
        this.socket.ev.on('messages.update', (messageInfo )=> {
            console.log(messageInfo);
        });
        this.socket.ev.on('messages.upsert', (messageInfoUpsert) => {
            console.log(messageInfoUpsert);
            this.SaveMessages(messageInfoUpsert);
        });
    }

    private async handleConnectionUpdate(path: string, update: Partial<ConnectionState>) {
        const { connection, qr, lastDisconnect } = update;
        if (connection === 'close') {
            const error = (lastDisconnect?.error as Boom)?.output?.statusCode;

            if (error === DisconnectReason.loggedOut) {
                console.log(`Session  logged out. Clearing data.`);
                fs.rmSync(path, { recursive: true });
            } else if (DisconnectReason.connectionLost) {
                console.log(`Session  connection lost. Reconnecting...`);
                this.connect();
            } else if (error === DisconnectReason.restartRequired) {
                console.log(`Session  restart required. Reconnecting...`);
                this.connect();
            }
            else {
                console.log(`Session  connection closed due to error ${error}. Reconnecting...`);
                this.connect();
            }
        }

        if (connection === 'open') {
            this.saveQRCode(null);
            console.log(`Session  connected.`);
        }

    if (qr) {
            console.log(`Generated QR for session :`, qr);
            this.saveQRCode(qr);
        }
    }

    private async saveQRCode(qr: string) {
        var imcenter = await this.imcenterRepository.findOneBy({ nomorhp: this.sessionId });
        if (imcenter) {
            if (qr) imcenter.qrcode = await QRCode.toDataURL(qr);
            await this.imcenterRepository.save(imcenter);
        }
    }

    private async SaveMessages(m: { messages: WAMessage[] }) {
        console.log(JSON.stringify(m.messages));
        console.log('from ', m.messages[0].key.remoteJid);

        // get message latest than data on imcenter_log
        // save to imcenter_log
        const imcenter = await this.imcenterRepository.findOneBy({ nomorhp: this.sessionId });
        const latestImcenterLog = await this.imcenterLogRepository.query(`SELECT * FROM imcenter_logs WHERE imcenter_id = ${imcenter.id} ORDER BY id DESC LIMIT 1`);
        if (latestImcenterLog.length > 0) {
            const lastMessageId : Date = latestImcenterLog[0].tgl_entry;
            const messages = m.messages.filter((message) => Number(message.messageTimestamp) > Date.parse(lastMessageId.toUTCString()));
            for (const message of m.messages) {
                await this.imcenterLogRepository.save({ imcenter_id: imcenter.id, message_id: message.key.id,log :"log",keterangan : message.message.conversation,pengirim : message.key.remoteJid, raw_message: JSON.stringify(message) });
            }
        } else {
            for (const message of m.messages) {
                await this.imcenterLogRepository.save({ imcenter_id: imcenter.id, message_id: message.key.id,log :"log",keterangan : message.message.conversation,pengirim : message.key.remoteJid, message: JSON.stringify(message) });
        
            }
        }
    }

    /**
    * Kirim pesan ke nomor tertentu
    */
    public async sendMessage(jid: string, text: string) {
        if (!this.socket) throw new Error("Socket belum terhubung!");

        const message: AnyMessageContent = {
            text
        };

        await this.socket.sendMessage(jid, message);
        console.log(`[${this.sessionId}] Pesan terkirim ke ${jid}`);
    }

    /**
    * Logout dan hapus sesi
    */
    public async logout() {
        if (this.socket) {
            await this.socket.logout();
            console.log(`[${this.sessionId}] Logout berhasil.`);
        }
    }


}