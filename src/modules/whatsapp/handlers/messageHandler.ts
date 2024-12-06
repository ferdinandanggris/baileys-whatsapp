import { WASocket } from "baileys";
import { ImcenterLogService } from "../../../services/imcenterLogService";

export class MessageHandler {
    private socket: WASocket;

    constructor(socket: WASocket, private imcenterLogService : ImcenterLogService) {
        this.socket = socket;
    }

    async sendMessage(jid: string, content: string) {
        try {
            jid = jid.includes('@') ? jid : `${ jid }@s.whatsapp.net`;
            await this.socket.sendMessage(jid, { text: content });
            console.log(`Pesan terkirim ke ${jid}: ${content}`);
        } catch (error) {
            console.error(`Gagal mengirim pesan ke ${jid}:`, error);
        }
    }

    listenForMessages() {
        this.socket.ev.on("messages.upsert", async (msg) => {
            for (const message of msg.messages) {
                const jid = message.key.remoteJid;
                const content = message.message?.conversation || "Pesan tidak memiliki teks";

                console.log(`Pesan diterima dari ${jid}: ${content}`);

                // Implementasikan logika tambahan di sini
                await this.imcenterLogService.createLog(jid, message);
            }
        });
    }

    async broadcastMessage(jids: string[], content: string) {
        for (const jid of jids) {
            await this.sendMessage(jid, content);

            // Kasih jeda 1 detik antar pengiriman pesan
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}