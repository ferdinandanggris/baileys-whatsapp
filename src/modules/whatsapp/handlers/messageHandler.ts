import { WASocket } from "baileys";
import { isInboxMessage, numberToJid } from "../../../utils/whatsapp";
import { MessageService } from "../services/messageService";

export class MessageHandler {
    private socket: WASocket;

    constructor(socket: WASocket, private messageService: MessageService) {
        this.socket = socket;
    }

    async sendMessage(number: string, content: string) {
        try {
            const jid = numberToJid(number);
            await this.socket.sendMessage(jid, { text: content });

            await this.messageService.insertData({ key: { remoteJid: jid }, message: { conversation: content } }, "outbox");

            console.log(`Pesan terkirim ke ${jid}: ${content}`);
        } catch (error) {
            console.error(`Gagal mengirim pesan ke ${number}:`, error);
        }
    }

    listenForMessages() {
        this.socket.ev.on("messages.upsert", async (msg) => {
            for (const message of msg.messages) {
                const jid = message.key.remoteJid;
                const content = message.message?.conversation || "Pesan tidak memiliki teks";

                console.log(`Pesan diterima dari ${jid}: ${content}`);

                if (isInboxMessage(message)) {
                    await this.messageService.insertData(message);
                }

            }
        });
    }

    async broadcastMessage(jids: string[], content: string) {
        for (const jid of jids) {
            await this.sendMessage(jid, content);

            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}