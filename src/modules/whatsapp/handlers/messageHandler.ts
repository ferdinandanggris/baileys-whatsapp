import { proto, WASocket } from "baileys";
import { isFromBroadcast, isFromGroup, isFromMe, numberToJid } from "../../../utils/whatsapp";
import { STATUS_LOG, TIPE_APLIKASI, TIPE_LOG } from "../../../entities/types";
import ParameterService from "../../autoResponse/services/parameterService";
import { ImcenterLogs } from "../../../entities/imcenterLogs";
import { timeToDate } from "../../../utils/date";
import { SendWhatsappMessage, WhatsappServiceProps } from "../../../interfaces/whatsapp";

export class MessageHandler {
    private socket: WASocket;
    parameterService = new ParameterService();

    constructor(private props : WhatsappServiceProps) {
        this.socket = props.socket;   
    }

    async sendMessage(message : SendWhatsappMessage) {
        try {
            const jid = numberToJid(message.receiver);
            const response = await this.socket.sendMessage(jid, { text: message.message });
            await this.props.messageService.saveMessage(response, TIPE_LOG.OUTBOX);

            console.log(`Pesan terkirim ke ${jid}: ${message.message}`);
        } catch (error) {
            console.error(`Gagal mengirim pesan ke ${message.receiver}:`, error);
            this.props.messageService.saveLog(`Gagal mengirim pesan ke ${message.receiver}`, TIPE_LOG.ERROR);
        }
    }

    listenForMessages() {
        this.socket.ev.on("messages.upsert", async (msg) => {
            for (const message of msg.messages) {
                const jid = message.key.remoteJid;
                const content = message.message?.conversation || "Pesan tidak memiliki teks"; 
                console.log(`Pesan diterima dari ${jid}: ${content}`);
            }

            const imcenterLogs = await this.inboxValidation(msg.messages);
            if (imcenterLogs.length > 0) await this.props.messageService.saveMultipleMessage(imcenterLogs);
        });

        this.socket.ev.on("messaging-history.set", async (msg) => {
            const imcenterLogs = await this.inboxValidation(msg.messages);
            if (imcenterLogs.length > 0) await this.props.messageService.saveMultipleMessage(imcenterLogs);
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
            const latestMessage = await this.props.messageService.getLatestMessageByImcenter()
            const messageTimestamp = Number(message.messageTimestamp);

            // compare with latest message
            if (latestMessage && timeToDate(messageTimestamp) <= latestMessage.sender_timestamp) {
                continue;
            }

            if(isFromBroadcast(jid) || isFromGroup(jid)) {
                continue;
            }

            var tipe_log = TIPE_LOG.INBOX;
            if(isFromMe(message)) {
                tipe_log = TIPE_LOG.OUTBOX;
            }

            // check if this message is from reseller
            // TODO: check if this message is from reseller

            const imcenterLog = new ImcenterLogs();
            imcenterLog.keterangan = message.message?.conversation;
            imcenterLog.tipe = tipe_log;
            imcenterLog.pengirim = jid;
            imcenterLog.message_id = message.key.id;
            imcenterLog.sender_timestamp = timeToDate(messageTimestamp);
            imcenterLog.raw_message = JSON.stringify(message);
            imcenterLog.tgl_entri = new Date();
            imcenterLog.aplikasi = TIPE_APLIKASI.NODEJS;
            imcenterLog.imcenter_id = this.props.imcenter_id;
            imcenterLogs.push(imcenterLog);
        }

        return imcenterLogs;
    }

    async markAsRead(messageId: proto.IMessageKey) {
        try {
            const message = await this.props.messageService.getMessageByMessageId(messageId.id);

            if(message) {
                await this.socket.readMessages([messageId]);
                // await this.sendMessage(messageId.remoteJid, `Pesan "${message.keterangan}" telah diterima dan akan segera diproses.`);
                await this.props.messageService.updateStatus(messageId.id, STATUS_LOG.DIBACA);
                console.log(`Pesan dari ${messageId.remoteJid} telah dibaca`);
            }
        }catch (error) {
            console.error(`Gagal membaca pesan dari ${messageId.remoteJid}:`, error);
            this.props.messageService.saveLog(`Gagal membaca pesan dari ${messageId.remoteJid}`, TIPE_LOG.ERROR);
        } 
    }

    async broadcastMessage(jids: string[], content: string) {
        for (const jid of jids) {
            // await this.sendMessage(jid, content);

            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}