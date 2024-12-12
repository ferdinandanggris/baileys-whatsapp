import { proto, WASocket } from "baileys";
import { isFromBroadcast, isFromGroup, isInboxMessage, jidToNumber, numberToJid } from "../../../utils/whatsapp";
import { MessageService } from "../services/messageService";
import { TIPE_APLIKASI, TIPE_LOG } from "../../../entities/types";
import ParameterService from "../../autoResponse/services/parameterService";
import { ImcenterLogs } from "../../../entities/imcenterLogs";
import { timeToDate } from "../../../utils/date";

export class MessageHandler {
    private socket: WASocket;
    parameterService = new ParameterService();

    constructor(socket: WASocket, private messageService: MessageService) {
        this.socket = socket;   
    }

    async sendMessage(number: string, content: string) {
        try {
            const jid = numberToJid(number);
            const response = await this.socket.sendMessage(jid, { text: content });

            await this.messageService.saveMessage(response, TIPE_LOG.OUTBOX);

            console.log(`Pesan terkirim ke ${jid}: ${content}`);
        } catch (error) {
            console.error(`Gagal mengirim pesan ke ${number}:`, error);
            this.messageService.saveLog(`Gagal mengirim pesan ke ${number}`, TIPE_LOG.ERROR);
        }
    }

    listenForMessages() {
        this.socket.ev.on("messages.upsert", async (msg) => {
            for (const message of msg.messages) {
                const jid = message.key.remoteJid;
                const content = message.message?.conversation || "Pesan tidak memiliki teks";

                console.log(`Pesan diterima dari ${jid}: ${content}`);

                // if (isInboxMessage(message) && message.message?.conversation) {
                //     await this.messageService.saveMessage(message, TIPE_LOG.INBOX);

                // Auto response
                // const response = await this.parameterService.getParameterAutoResponse(content);
                // if (response) {
                //     await this.markAsRead(message.key);
                //     if(response.value) await this.sendMessage(jid, response.value);
                // }
                // }
            }

            const imcenterLogs = await this.inboxValidation(msg.messages);
            if (imcenterLogs.length > 0) await this.messageService.saveMultipleMessage(imcenterLogs);
        });
    }

    async inboxValidation(messages : proto.IWebMessageInfo[]) : Promise<ImcenterLogs[]> {
        const imcenterLogs : ImcenterLogs[] = [];

        for (const message of messages) {

            const jid = message.key.remoteJid;

            // message validation not null conversation
            if (!message.message?.conversation) {
                continue;
            }

            // get latest imcenter_log latest message, and compare with current message
            const latestMessage = await this.messageService.getLatestMessageByImcenter()
            const messageTimestamp = Number(message.messageTimestamp);

            // compare with latest message
            if (latestMessage && timeToDate(messageTimestamp) <= latestMessage.sender_timestamp) {
                continue;
            }

            if(isFromBroadcast(jid) || isFromGroup(jid)) {
                continue;
            }

            // check if this message is from reseller
            // TODO: check if this message is from reseller

            const imcenterLog = new ImcenterLogs();
            imcenterLog.keterangan = message.message?.conversation;
            imcenterLog.tipe = TIPE_LOG.INBOX;
            imcenterLog.pengirim = jid;
            imcenterLog.message_id = message.key.id;
            imcenterLog.sender_timestamp = timeToDate(messageTimestamp);
            imcenterLog.raw_message = JSON.stringify(message);
            imcenterLog.tgl_entri = new Date();
            imcenterLog.aplikasi = TIPE_APLIKASI.NODEJS;
            imcenterLog.imcenter_id = this.messageService.getImcenterId();
            imcenterLogs.push(imcenterLog);
        }

        return imcenterLogs;
    }

    async markAsRead(messageId: proto.IMessageKey) {
        try {
            const message = await this.messageService.getMessageByMessageId(messageId.id);

            if(message) {
                await this.socket.readMessages([messageId]);
                await this.sendMessage(messageId.remoteJid, `Pesan "${message.keterangan}" telah diterima dan akan segera diproses.`);
                console.log(`Pesan dari ${messageId.remoteJid} telah dibaca`);
            }
        }catch (error) {
            console.error(`Gagal membaca pesan dari ${messageId.remoteJid}:`, error);
            this.messageService.saveLog(`Gagal membaca pesan dari ${messageId.remoteJid}`, TIPE_LOG.ERROR);
        } 
    }

    async broadcastMessage(jids: string[], content: string) {
        for (const jid of jids) {
            await this.sendMessage(jid, content);

            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}