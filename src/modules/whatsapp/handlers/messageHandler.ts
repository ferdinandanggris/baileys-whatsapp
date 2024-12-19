import { AnyMessageContent, MessageUserReceiptUpdate, proto, WASocket } from "baileys";
import { isFromBroadcast, isFromGroup, isFromMe, numberToJid } from "../../../utils/whatsapp";
import { TIPE_LOG } from "../../../entities/types";
import { OTP, SendWhatsappMessage, WhatsappServiceProps } from "../../../interfaces/whatsapp";

interface IMessageHandler {
    sendMessage(message: SendWhatsappMessage): Promise<void>;
    listenForMessages(): void;
    checkNumberIsRegistered(number: string): Promise<boolean>;
    validationImageMessage(message: proto.IWebMessageInfo): Promise<void>;
    validationIsEditMessage(message: proto.IWebMessageInfo): Promise<void>;
    markAsRead(messageId: proto.IMessageKey): Promise<void>;
    broadcastMessage(jids: string[], content: string): Promise<void>;
}

export class MessageHandler  implements IMessageHandler {
    private socket: WASocket;

    constructor(private props: WhatsappServiceProps) {
        this.socket = props.socket;
    }

    async sendMessage(message: SendWhatsappMessage) {
        try {
            const jid = numberToJid(message.receiver);
            var messageSend: AnyMessageContent = this.constructSendMessage(message);
            if (await this.checkNumberIsRegistered(jid)) {
                const response = await this.socket.sendMessage(jid, messageSend);
                await this.props.messageService.processMessageSend(response, message);
                console.log(`Pesan terkirim ke ${jid}: ${message.message}`);
            } else {
                console.log(`Nomor ${message.receiver} tidak terdaftar di WhatsApp`);
                this.props.messageService.saveLog(`Nomor ${message.receiver} tidak terdaftar di WhatsApp`, TIPE_LOG.ERROR);
            }
        } catch (error) {
            console.error(`Gagal mengirim pesan ke ${message.receiver}:`, error);
            this.props.messageService.saveLog(`Gagal mengirim pesan ke ${message.receiver}`, TIPE_LOG.ERROR);
        }
    }

    async sendOTP(otp: OTP) {
        try {
            await this.props.messageService.processMessageOTPSend(otp);
        } catch (error) {
            console.error(`Gagal mengirim OTP ke ${otp.nomorhp}:`, error);
            this.props.messageService.saveLog(`Gagal mengirim OTP ke ${otp.nomorhp}`, TIPE_LOG.ERROR);
        }
    }

    private constructSendMessage(message: SendWhatsappMessage) {
        var messageSend: AnyMessageContent;
        if (message.raw_message != null) {

            var msg = JSON.parse(message.raw_message) as proto.IWebMessageInfo;
            messageSend = {
                text: message.message,
                contextInfo: {
                    stanzaId: msg.key.id,
                    participant: msg.key.remoteJid,
                    quotedMessage: msg.message
                }
            };

        } else {
            messageSend = {
                text: message.message
            };
            message.raw_message = JSON.stringify(messageSend);
        }
        return messageSend;
    }

    listenForMessages() {
        this.socket.ev.on("messages.upsert", async (msg) => {
            for (const message of msg.messages) {
                const jid = message.key.remoteJid;
                const content = message.message?.conversation || "Pesan tidak memiliki teks";
                console.log(`Pesan diterima dari ${jid}: ${content}`);
            }
            this.props.messageService.processMessagesFromUpsert(msg.messages);
        });

        this.socket.ev.on("messaging-history.set", async (msg) => {
            if (msg.progress == 100 && msg.syncType == proto.HistorySync.HistorySyncType.RECENT) {
                await this.props.messageService.processMessagesFromHistory(msg.messages);
            }
        });

        this.socket.ev.on("message-receipt.update", async (msg: MessageUserReceiptUpdate[]) => {
            for (const message of msg) {
                const jid = message.key.remoteJid;
                console.log(`Pesan dari ${jid} telah dibaca`);
                console.log("Message Receipt", message);
            }
            await this.props.messageService.processMessageUpdateReceipt(msg);
        });

        this.socket.ev.on("group.join-request", async (msg) => {
            console.log("Group Join Request", msg);
        });
    }

    async checkNumberIsRegistered(number: string): Promise<boolean> {
        try {
            const jid = numberToJid(number);
            const response = await this.socket.onWhatsApp(jid);
            console.log(`Nomor ${number} terdaftar di WhatsApp`);
            return response.at(0).exists;
        } catch (error) {
            console.error(`Gagal mengecek nomor ${number}:`, error);
            this.props.messageService.saveLog(`Gagal mengecek nomor ${number}`, TIPE_LOG.ERROR);
        }
    }

    async validationImageMessage(message: proto.IWebMessageInfo) {
        const jid = message.key.remoteJid;
        if (isFromBroadcast(jid) || isFromGroup(jid) || isFromMe(message)) {
            return;
        }
        // set read message
        await this.markAsRead(message.key);
        this.sendMessage({
            receiver: message.key.remoteJid,
            message: "Pesan ini berisi gambar, mohon maaf kami tidak bisa menerima pesan berupa gambar.",
            raw_message: JSON.stringify(message)
        });
    }

    async validationIsEditMessage(message: proto.IWebMessageInfo) {
        await this.sendMessage({
            receiver: message.key.remoteJid,
            message: `Pesan "${message.message?.editedMessage?.message?.protocolMessage?.editedMessage?.conversation}" TIDAK DIPROSES. Edit Pesan tidak diizinkan.`,
            raw_message: JSON.stringify(message)
        });
    }

    async markAsRead(messageId: proto.IMessageKey) {
        try {
            await this.socket.readMessages([messageId]);
            await this.props.messageService.processMessageMarkAsRead(messageId.id);
            console.log(`Pesan dari ${messageId.id} telah dibaca`);
        } catch (error) {
            console.error(`Gagal membaca pesan dari ${messageId.id}:`, error);
            this.props.messageService.saveLog(`Gagal membaca pesan dari ${messageId.id}`, TIPE_LOG.ERROR);
        }
    }

    async broadcastMessage(jids: string[], content: string) {
        for (const jid of jids) {
            // await this.sendMessage(jid, content);

            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}