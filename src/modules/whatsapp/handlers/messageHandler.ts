import { AnyMessageContent, proto, WASocket } from "baileys";
import { isFromBroadcast, isFromGroup, isFromMe, jidToNumber, numberToJid } from "../../../utils/whatsapp";
import { PARAMETER_GROUP, STATUS_INBOX, STATUS_LOG, STATUS_LOGIN, TIPE_APLIKASI, TIPE_LOG, TIPE_PENGIRIM } from "../../../entities/types";
import ParameterService from "../../autoResponse/services/parameterService";
import { timeToDate } from "../../../utils/date";
import { SendWhatsappMessage, WhatsappServiceProps } from "../../../interfaces/whatsapp";
import ResellerService from "../../reseller/resellerService";
import Imcenter from "../../../entities/imcenter";
import { ImcenterLogs } from "../../../entities/imcenterLogs";
import { InboxGriyabayar } from "../../../entities/inboxGriyabayar";
import InboxService from "../../griyabayar/services/inboxService";

export class MessageHandler {
    private socket: WASocket;
    parameterService = new ParameterService();
    resellerService = new ResellerService();   
    inboxService = new InboxService(); 

    constructor(private props: WhatsappServiceProps) {
        this.socket = props.socket;
    }

    async sendMessage(message: SendWhatsappMessage) {
        try {
            const jid = numberToJid(message.receiver);

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
                }

            } else {
                messageSend = {
                    text: message.message
                }
                message.raw_message = JSON.stringify(messageSend);
            }

            const response = await this.socket.sendMessage(jid, messageSend);
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
            // if (imcenterLogs.length > 0) await this.props.messageService.saveMultipleMessage(imcenterLogs);
        });

        this.socket.ev.on("messaging-history.set", async (msg) => {
            const imcenterLogs = await this.inboxValidation(msg.messages);
            // if (imcenterLogs.length > 0) await this.props.messageService.saveMultipleMessage(imcenterLogs);
        });
    }

    async validationImageMessage(message: proto.IWebMessageInfo) {
        const jid = message.key.remoteJid;
        if (isFromBroadcast(jid) || isFromGroup(jid) || isFromMe(message)) {
            return;
        }

        // set read message
        await this.markAsRead(message.key);

        // compare date message with datenow + 120 seconds
        const messageTimestamp = Number(message.messageTimestamp);
        const dateNow = new Date();
        const messageDate = timeToDate(messageTimestamp);
        // date diff less than 120 seconds
        if ((dateNow.getTime() - messageDate.getTime()) > 120000) {
            return;
        }
        this.sendMessage({
            receiver: message.key.remoteJid,
            message: "Pesan ini berisi gambar, mohon maaf kami tidak bisa menerima pesan berupa gambar.",
            raw_message: JSON.stringify(message)
        });
    }

    async validationIsEditMessage(message: proto.IWebMessageInfo) {
        // compare date message with datenow + 120 seconds
        const messageTimestamp = Number(message.messageTimestamp);
        const dateNow = new Date();
        const messageDate = timeToDate(messageTimestamp);
        // date diff less than 120 seconds
        if ((dateNow.getTime() - messageDate.getTime()) > 120000) {
            return;
        }

        await this.sendMessage({
            receiver: message.key.remoteJid,
            message: `Pesan "${message.message?.editedMessage?.message?.protocolMessage?.editedMessage?.conversation}" TIDAK DIPROSES. Edit Pesan tidak diizinkan.`,
            raw_message: JSON.stringify(message)
        });
    }

    async inboxValidation(messages: proto.IWebMessageInfo[]): Promise<void> {
        for (const message of messages) {
            const flagImageMedia = message.message?.imageMessage?.url != null;
            const flagValidationIsEditMessage = message.message?.editedMessage?.message?.protocolMessage != null && message.message?.editedMessage?.message?.protocolMessage?.editedMessage?.conversation != null && !message.key.fromMe;
            // is image message
            switch (true) {
                // send message extended
                case (flagImageMedia):
                    await this.validationImageMessage(message);
                    continue;
                    break;
                case (flagValidationIsEditMessage):
                    await this.validationIsEditMessage(message);
                    continue;
                    break;
                case (isFromBroadcast(message.key.remoteJid) || isFromGroup(message.key.remoteJid) || isFromMe(message)):
                    continue;
                    break;
            }

            // save to imcenter_logs
            await this.saveImcenterLogs(message);
            // save to inbox / inbox griya bayar
            await this.saveInbox(message);

        }
    }

    async saveInbox(message : proto.IWebMessageInfo) {
        try {
            const imcenter = await this.props.imcenterService.getImcenterById(this.props.imcenter_id);
            if(!imcenter) throw new Error(`imcenter with key "${message.key.remoteJid}" not found.`);

            var messageText;
            if(message.message?.conversation != null){
                messageText = message.message.conversation;
            }else if(message.message?.extendedTextMessage?.text != null){
                messageText = message.message.extendedTextMessage.text;
            }

            const pengirim = jidToNumber(message.key.remoteJid);
            var kode_reseller : string | null = null;
            var idReseller, idMerchant : number | null = null;

            if(!pengirim) throw new Error(`Pengirim tidak ditemukan`);

            await this.props.imcenterService.updateActivity(this.props.imcenter_id);
            const reseller = await this.resellerService.findByPhoneNumber(pengirim, imcenter.griyabayar, TIPE_PENGIRIM.WHATSAPP);

            if(reseller == null){
                const waSetting = await this.parameterService.findByGroupAndKey(PARAMETER_GROUP.SETTING, "NomorHp=WhatsApp", imcenter.griyabayar);
                if(waSetting != null && waSetting.value == "1"){
                    const reseller = await this.resellerService.findByPhoneNumber(pengirim, imcenter.griyabayar, TIPE_PENGIRIM.NOMOR_HP);
                    if(reseller){
                        kode_reseller = reseller.kode;
                        idReseller = reseller.id;
                        idMerchant = reseller.id_merchant;
                    }
                }
            }else{
                kode_reseller = reseller.kode;
                idReseller = reseller.id;
                idMerchant = reseller.id_merchant;
            }

            const listStatusActive = [STATUS_LOGIN.MENGIRIM_PESAN, STATUS_LOGIN.SUDAH_LOGIN];

            if(listStatusActive.find(status => status == imcenter.status_login) != null){
                console.debug("Imcenter tidak aktif");

                // set read message
                await this.markAsRead(message.key);

                if(imcenter.griyabayar){
                    console.debug("Simpan inbox Griya bayar : " , imcenter.griyabayar);

                    const inboxModel : InboxGriyabayar = {
                        kode_reseller : kode_reseller,
                        tgl_entri : new Date(),
                        pengirim : pengirim,
                        penerima : imcenter.username,
                        tipe : TIPE_PENGIRIM.WHATSAPP,
                        pesan : messageText,
                        status : STATUS_INBOX.BELUM_DIPROSES,
                        tgl_status : new Date(),
                        id_imcenter : imcenter.id,
                        sender_timestamp : timeToDate(Number(message.messageTimestamp)),
                        service_center : "WhatsApp",
                        raw_message : JSON.stringify(message)
                    };

                    await this.inboxService.createInbox(inboxModel);
                }else{
                    const inboxStatus = STATUS_INBOX.BELUM_DIPROSES;


                }

            }else{
                console.debug("Imcenter aktif");
            }


        } catch (error) {
            console.error(`Gagal menyimpan pesan dari ${message.key.remoteJid}:`, error);
            this.props.messageService.saveLog(`Gagal menyimpan pesan dari ${message.key.remoteJid}`, TIPE_LOG.ERROR);
        }
    }


    async saveImcenterLogs(message: proto.IWebMessageInfo) : Promise<ImcenterLogs> {
        try{
            const imcenter = await this.props.imcenterService.getImcenterById(this.props.imcenter_id);
            if(!imcenter) throw new Error(`imcenter with key "${message.key.remoteJid}" not found.`);

            var messageText;
            if(message.message?.conversation != null){
                messageText = message.message.conversation;
            }else if(message.message?.extendedTextMessage?.text != null){
                messageText = message.message.extendedTextMessage.text;
            }

            const pengirim = jidToNumber(message.key.remoteJid);
            var kode_reseller : string | null = null;
            var idReseller, idMerchant : number | null = null;

            if(!pengirim) throw new Error(`Pengirim tidak ditemukan`);

            await this.props.imcenterService.updateActivity(this.props.imcenter_id);
            const reseller = await this.resellerService.findByPhoneNumber(pengirim, imcenter.griyabayar, TIPE_PENGIRIM.WHATSAPP);

            if(reseller == null){
                const waSetting = await this.parameterService.findByGroupAndKey(PARAMETER_GROUP.SETTING, "NomorHp=WhatsApp", imcenter.griyabayar);
                if(waSetting != null && waSetting.value == "1"){
                    const reseller = await this.resellerService.findByPhoneNumber(pengirim, imcenter.griyabayar, TIPE_PENGIRIM.NOMOR_HP);
                    if(reseller){
                        kode_reseller = reseller.kode;
                        idReseller = reseller.id;
                        idMerchant = reseller.id_merchant;
                    }
                }
            }else{
                kode_reseller = reseller.kode;
                idReseller = reseller.id;
                idMerchant = reseller.id_merchant;
            }

            var imcenterLog : ImcenterLogs = new ImcenterLogs();
            imcenterLog.tgl_entri= new Date(),
            imcenterLog.imcenter_id= this.props.imcenter_id,
            imcenterLog.message_id= message.key.id,
            imcenterLog.pengirim= pengirim,
            imcenterLog.aplikasi= TIPE_APLIKASI.NODEJS,
            imcenterLog.tipe= TIPE_LOG.INBOX,
            imcenterLog.keterangan= messageText,
            imcenterLog.kode_reseller= kode_reseller,
            imcenterLog.sender_timestamp= timeToDate(Number(message.messageTimestamp));

            return await this.props.messageService.createLog(imcenterLog);

        }catch(error){
            console.error(`Gagal menyimpan pesan dari ${message.key.remoteJid}:`, error);
            this.props.messageService.saveLog(`Gagal menyimpan pesan dari ${message.key.remoteJid}`, TIPE_LOG.ERROR);
        }
    }



    async markAsRead(messageId: proto.IMessageKey) {
        try {
            const message = await this.props.messageService.getMessageByMessageId(messageId.id);

            if (message) {
                await this.socket.readMessages([messageId]);
                // await this.sendMessage(messageId.remoteJid, `Pesan "${message.keterangan}" telah diterima dan akan segera diproses.`);
                await this.props.messageService.updateStatus(messageId.id, STATUS_LOG.DIBACA);
                console.log(`Pesan dari ${messageId.remoteJid} telah dibaca`);
            }
        } catch (error) {
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