import { MessageUserReceiptUpdate, proto } from "baileys";
import { AppDataSource } from "../../../configs/db";
import { ImcenterLogs } from "../../../entities/imcenterLogs";
import { PARAMETER_GROUP, STATUS_INBOX, STATUS_LOG, STATUS_LOGIN, TIPE_APLIKASI, TIPE_LOG, TIPE_PENGIRIM } from "../../../entities/types";
import { timeToDate } from "../../../utils/date";
import { IMessageService } from "../../../interfaces/message";
import Imcenter from "../../../entities/imcenter";
import { ImcenterRepository } from "../../../repositories/imcenterRepository";
import { isFromBroadcast, isFromGroup, isFromMe, jidToNumberPhone, numberToJid } from "../../../utils/whatsapp";
import { ResellerModel } from "../../../interfaces/reseller";
import { ResellerRepository } from "../../../repositories/resellerRepository";
import ParameterGriyabayarService from "../../../repositories/parameterGriyabayarRepository";
import { ResellerGriyabayarRepository } from "../../../repositories/resellerGriyabayarRepository";
import { ImcenterLogRepository } from "../../../repositories/imcenterLogRepository";
import { InboxGriyabayar } from "../../../entities/inboxGriyabayar";
import InboxGriyabayarRepostiory from "../../../repositories/inboxGriyabayarRepository";
import { Inbox } from "../../../entities/inbox";
import InboxRepository from "../../../repositories/inboxRepository";
import { WhatsappService } from "../whatsappService";
import { OTP, SendWhatsappMessage } from "../../../interfaces/whatsapp";
import ParameterRepository from "../../../repositories/parameterRepository";

export class MessageService implements IMessageService {

    private repository = AppDataSource.getRepository(ImcenterLogs);
    private repositories = {
        imcenter: new ImcenterRepository(),
        reseller: new ResellerRepository(),
        parameter : new ParameterRepository(),
        resellerGriyabayar: new ResellerGriyabayarRepository(),
        parameterGriyabayar: new ParameterGriyabayarService(),
        imcenterLog: new ImcenterLogRepository(),
        inboxGriyabayar: new InboxGriyabayarRepostiory(),
        inbox: new InboxRepository()
    }

    constructor(private whatsappService: WhatsappService, private imcenter_id: number) { }

    async saveLog(message: string, tipe: TIPE_LOG) {
        const imcenterLog = new ImcenterLogs();
        imcenterLog.aplikasi = TIPE_APLIKASI.NODEJS;
        imcenterLog.imcenter_id = this.imcenter_id;
        imcenterLog.tgl_entri = new Date();
        imcenterLog.keterangan = message;
        imcenterLog.tipe = tipe
        await this.repository.save(imcenterLog);
    }

    async processMessagesFromUpsert(messages: proto.IWebMessageInfo[]): Promise<void> {
        try {
            for (const message of messages) {
                const flagImageMedia = message.message?.imageMessage?.url != null;
                const flagValidationIsEditMessage = message.message?.editedMessage?.message?.protocolMessage != null && message.message?.editedMessage?.message?.protocolMessage?.editedMessage?.conversation != null && !message.key.fromMe;

                // compare date message with datenow + 120 seconds
                const messageTimestamp = Number(message.messageTimestamp);
                const dateNow = new Date();
                const messageDate = timeToDate(messageTimestamp);
                // date diff less than 120 seconds
                if ((dateNow.getTime() - messageDate.getTime()) > 120000) {
                    continue;
                }

                switch (true) {
                    // send message extended
                    case (flagImageMedia):
                        await this.whatsappService.messageHandler.validationImageMessage(message);
                        continue;
                        break;
                    case (flagValidationIsEditMessage):
                        await this.whatsappService.messageHandler.validationIsEditMessage(message);
                        continue;
                        break;
                    case (isFromBroadcast(message.key.remoteJid) || isFromGroup(message.key.remoteJid) || isFromMe(message)):
                        continue;
                        break;
                };

                const imcenter = await this.repositories.imcenter.fetchById(this.imcenter_id);
                if (!imcenter) throw new Error(`imcenter with key "${message.key.remoteJid}" not found.`);
                var messageText = this.getMessageContent(message);
                const pengirim = jidToNumberPhone(message.key.remoteJid);
                await this.repositories.imcenter.updateActivityById(this.imcenter_id);

                var idReseller: number | null = null, idMerchant: number | null = null, kode_reseller: string | null = null;

                var reseller: ResellerModel | null = null;
                switch (imcenter.griyabayar) {
                    case true:
                        console.log("Griyabayar");
                        const number_phone_local = this.convertInternationalToLocal(pengirim);
                        reseller = await this.repositories.resellerGriyabayar.findByPhoneNumber(number_phone_local, TIPE_PENGIRIM.WHATSAPP);
                        var waSetting = await this.repositories.parameterGriyabayar.findByGroupAndKey(PARAMETER_GROUP.SETTING, "NomorHp=WhatsApp");
                        if (waSetting != null && waSetting.value == "1") {
                            if (reseller == null) {
                                reseller = await this.repositories.resellerGriyabayar.findByPhoneNumber(number_phone_local, TIPE_PENGIRIM.NOMOR_HP);
                                if (reseller) {
                                    kode_reseller = reseller.kode;
                                    idReseller = reseller.id_reseller;
                                    idMerchant = reseller.id_merchant;
                                }
                            }
                        }
                        break;
                    default:
                        console.log("Bukan Griyabayar");
                        reseller = await this.repositories.reseller.findByPhoneNumber(pengirim, TIPE_PENGIRIM.WHATSAPP);
                        var waSetting = await this.repositories.parameter.findByGroupAndKey(PARAMETER_GROUP.SETTING, "NomorHp=WhatsApp");
                        if (waSetting != null && waSetting.value == "1") {
                            if (reseller == null) {
                                reseller = await this.repositories.reseller.findByPhoneNumber(pengirim, TIPE_PENGIRIM.NOMOR_HP);
                                if (reseller) {
                                    kode_reseller = reseller.kode;
                                    idReseller = reseller.id_reseller;
                                    idMerchant = reseller.id_merchant;
                                }
                            }
                        }
                        break;
                }

                var imcenterLog: ImcenterLogs = new ImcenterLogs();
                imcenterLog.tgl_entri = new Date(),
                    imcenterLog.imcenter_id = this.imcenter_id,
                    imcenterLog.message_id = message.key.id,
                    imcenterLog.pengirim = pengirim,
                    imcenterLog.aplikasi = TIPE_APLIKASI.NODEJS,
                    imcenterLog.tipe = TIPE_LOG.INBOX,
                    imcenterLog.keterangan = messageText,
                    imcenterLog.kode_reseller = kode_reseller,
                    imcenterLog.sender_timestamp = timeToDate(Number(message.messageTimestamp));

                if (imcenter.status_login != STATUS_LOGIN.MENGIRIM_PESAN && imcenter.status_login != STATUS_LOGIN.SUDAH_LOGIN) {
                    imcenterLog.raw_message = JSON.stringify(message);
                } else {
                    await this.saveInboxFromReceipt(message);
                }

                await this.repositories.imcenterLog.create(imcenterLog);
            }
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async processMessageOTPSend(otpProps: OTP) {
        try {
            const imcenter = await this.repositories.imcenter.fetchById(this.imcenter_id);
            var source = null;
            switch(otpProps.griyabayar){
                case true:
                    source = "Griya Bayar";
                default:
                    source = "Onpay";
            }

            const jid = numberToJid(this.convertLocalToInternational(otpProps.nomorhp));
            const message = `OTP Anda adalah *${otpProps.otp}*, digunakan untuk login ${source}`;
            const { kode_reseller} = await this.findResellerByPhone(jid, imcenter);
            const payloadMessage : SendWhatsappMessage = {
                receiver : numberToJid(otpProps.nomorhp),
                message : message,
                raw_message : null,
                imcenter_id : imcenter.id,
                kode_reseller : kode_reseller
            }
    
            await this.whatsappService.messageHandler.sendMessage(payloadMessage);
        } catch (error) {
            console.error(`Gagal mengirim OTP ke ${otpProps.nomorhp}:`, error);
            throw new Error(error);
            
        }
    }

    async saveInboxFromReceipt(message: proto.IWebMessageInfo): Promise<void> {
        try {
            const imcenter = await this.repositories.imcenter.fetchById(this.imcenter_id);
            if (!imcenter) throw new Error(`imcenter with key "${message.key.remoteJid}" not found.`);
            var messageText = this.getMessageContent(message);
            var { kode_reseller, pengirim, idReseller, idMerchant } = await this.findResellerByPhone(message.key.remoteJid, imcenter);
            const listStatusActive = [STATUS_LOGIN.MENGIRIM_PESAN, STATUS_LOGIN.SUDAH_LOGIN];

            if (listStatusActive.find(status => status == imcenter.status_login) != null) {
                console.debug("Imcenter aktif");

                // set read message
                this.whatsappService.messageHandler.markAsRead(message.key);

                if (imcenter.griyabayar) {
                    console.debug("Simpan inbox Griya bayar : ", imcenter.griyabayar);

                    const inboxModel: InboxGriyabayar = {
                        kode_reseller: kode_reseller,
                        tgl_entri: new Date(),
                        pengirim: pengirim,
                        penerima: imcenter.username,
                        tipe: TIPE_PENGIRIM.WHATSAPP,
                        pesan: messageText,
                        status: STATUS_INBOX.BELUM_DIPROSES,
                        tgl_status: new Date(),
                        id_imcenter: imcenter.id,
                        sender_timestamp: timeToDate(Number(message.messageTimestamp)),
                        service_center: "WhatsApp",
                        raw_message: JSON.stringify(message)
                    };

                    await this.repositories.inboxGriyabayar.createInbox(inboxModel);
                } else {
                    const inbox_status = STATUS_INBOX.DIABAIKAN;
                    const inbox: Inbox = {
                        id_reseller: idReseller,
                        id_merchant: idMerchant,
                        tgl_entri: new Date(),
                        tipe: TIPE_PENGIRIM.WHATSAPP,
                        pengirim: pengirim,
                        penerima: imcenter.username,
                        pesan: messageText,
                        status: inbox_status,
                        tgl_status: new Date(),
                        id_imcenter: imcenter.id,
                        sender_timestamp: timeToDate(Number(message.messageTimestamp)),
                        service_center: "WhatsApp",
                        raw_message: JSON.stringify(message)
                    }

                    await this.repositories.inbox.createInbox(inbox);
                }
            } else {
                console.debug("Imcenter belum aktif");
            }
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async processMessagesFromHistory(messages: proto.IWebMessageInfo[]): Promise<void> {
        try {
            const listMessage: ImcenterLogs[] = [];
            const latestImcenterLogs = await this.repositories.imcenterLog.fetchLatest(this.imcenter_id);
            const filterHasConversation = messages.filter(message => message.message?.conversation != null);
            const imcenter = await this.repositories.imcenter.fetchById(this.imcenter_id);

            if (imcenter == null) throw new Error(`Imcenter with id ${this.imcenter_id} not found`);

            for (const message of filterHasConversation) {
                const messageTimestamp = Number(message.messageTimestamp);
                const messageDate = timeToDate(messageTimestamp);
                const dateNow = new Date();
                if (latestImcenterLogs == null || latestImcenterLogs.sender_timestamp.getTime() < messageDate.getTime()) {
                    const flagImageMedia = message.message?.imageMessage?.url != null;
                    const flagValidationIsEditMessage = message.message?.editedMessage?.message?.protocolMessage != null && message.message?.editedMessage?.message?.protocolMessage?.editedMessage?.conversation != null && !message.key.fromMe;
                    // is image message
                    if ((dateNow.getTime() - messageDate.getTime()) > 120000) {
                        switch (true) {
                            // send message extended
                            case (flagImageMedia):
                                await this.whatsappService.messageHandler.validationImageMessage(message);
                                continue;
                            case (flagValidationIsEditMessage):
                                await this.whatsappService.messageHandler.validationIsEditMessage(message);
                                continue;
                            case (isFromBroadcast(message.key.remoteJid) || isFromGroup(message.key.remoteJid) || isFromMe(message)):
                                continue;
                        }
                    }

                    const messageText = this.getMessageContent(message);
                    const { kode_reseller, pengirim } = await this.findResellerByPhone(message.key.remoteJid, imcenter);
                    var imcenterLog: ImcenterLogs = new ImcenterLogs();
                    imcenterLog.tgl_entri = new Date();
                    imcenterLog.imcenter_id = this.imcenter_id;
                    imcenterLog.message_id = message.key.id;
                    imcenterLog.pengirim = pengirim;
                    imcenterLog.aplikasi = TIPE_APLIKASI.NODEJS;
                    imcenterLog.tipe = TIPE_LOG.INBOX;
                    imcenterLog.keterangan = messageText;
                    imcenterLog.kode_reseller = kode_reseller;
                    imcenterLog.sender_timestamp = timeToDate(Number(message.messageTimestamp));

                    if (message.key.fromMe) {
                        imcenterLog.status = STATUS_LOG.DIBACA;
                    } else {
                        imcenterLog.raw_message = JSON.stringify(message);
                    }
                    listMessage.push(imcenterLog);
                }
            }

            if (listMessage.length > 0) await this.repositories.imcenterLog.saveMultiple(listMessage);

            // handle expired inbox
            await this.handleExpiredMessage();

        } catch (error) {
            console.error(error);
            throw new Error(error);

        }
    }

    async handleExpiredMessage() {
        const expiredMessage = await this.repositories.imcenterLog.fetchExpired(this.imcenter_id);
        if(expiredMessage.length > 0) {
            console.debug("Expired inbox found : ", expiredMessage.length);
            const imcenter = await this.repositories.imcenter.fetchById(this.imcenter_id);
            if(imcenter == null) throw new Error(`Imcenter with id ${this.imcenter_id} not found`);

            for(const message of expiredMessage) {
                switch(imcenter.griyabayar){
                    case true:
                        var inboxGriyabayar : InboxGriyabayar = {
                            tgl_entri : new Date(),
                            pengirim : message.pengirim,
                            penerima : imcenter.username,
                            tipe : TIPE_PENGIRIM.WHATSAPP,
                            pesan : message.keterangan,
                            status : STATUS_INBOX.BELUM_DIPROSES,
                            tgl_status : new Date(),
                            id_imcenter : imcenter.id,  
                            sender_timestamp : message.sender_timestamp,
                            service_center : "WhatsApp",
                            kode_reseller : message.kode_reseller,
                            raw_message : message.raw_message
                        }

                        await this.repositories.inboxGriyabayar.createInbox(inboxGriyabayar);
                    case false:
                        var inbox : Inbox = {
                            tgl_entri : new Date(),
                            pengirim : message.pengirim,
                            penerima : imcenter.username,
                            tipe : TIPE_PENGIRIM.WHATSAPP,
                            pesan : message.keterangan,
                            status : STATUS_INBOX.DIABAIKAN,
                            tgl_status : new Date(),
                            id_imcenter : imcenter.id,  
                            sender_timestamp : message.sender_timestamp,
                            service_center : "WhatsApp",
                            raw_message : message.raw_message
                        }

                        await this.repositories.inbox.createInbox(inbox);
                }

                await this.repositories.imcenterLog.removeRawMessage(message.message_id);
                await this.whatsappService.messageHandler.markAsRead({ id: message.message_id});
            }
        }
    }

    async processMessageMarkAsRead(message_id: string): Promise<void> {
        await this.repositories.imcenterLog.updateStatus(message_id, STATUS_LOG.DIBACA);
    }

    async processMessageUpdateReceipt(msg: MessageUserReceiptUpdate[]): Promise<void> {
        try {
            for (const message of msg) {
                const imcenterLog = await this.repositories.imcenterLog.fetchByMessageId(message.key.id);
                if (imcenterLog) {
                    await this.repositories.imcenterLog.updateStatus(message.key.id, STATUS_LOG.DIBACA);
                }
            }
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }

    }

    async processMessageSend(response: proto.IWebMessageInfo,message: SendWhatsappMessage): Promise<void> {
        try {
            const imcenterLog: ImcenterLogs = {
                aplikasi: TIPE_APLIKASI.NODEJS,
                imcenter_id: this.imcenter_id,
                tgl_entri: new Date(),
                keterangan: response.message.conversation,
                tipe: TIPE_LOG.OUTBOX,
                pengirim: response.key.remoteJid,
                message_id: response.key.id,
                sender_timestamp: timeToDate(Number(response.messageTimestamp)),
                raw_message: JSON.stringify(response),
                kode_reseller: message.kode_reseller
            }
            await this.repositories.imcenterLog.create(imcenterLog);
        } catch (error) {
            console.error(error);
            throw new Error(error);

        }
    }

    private async findResellerByPhone(jid: string, imcenter: Imcenter) {
        const pengirim = jidToNumberPhone(jid);
        var idReseller: number | null = null, idMerchant: number | null = null, kode_reseller: string | null = null;

        var reseller: ResellerModel | null = null;
        switch (imcenter.griyabayar) {
            case true:
                console.log("Griyabayar");
                const number_phone_local = this.convertInternationalToLocal(pengirim);
                reseller = await this.repositories.resellerGriyabayar.findByPhoneNumber(number_phone_local, TIPE_PENGIRIM.WHATSAPP);
                var waSetting = await this.repositories.parameterGriyabayar.findByGroupAndKey(PARAMETER_GROUP.SETTING, "NomorHp=WhatsApp");
                if (waSetting != null && waSetting.value == "1") {
                    if (reseller == null) {
                        reseller = await this.repositories.resellerGriyabayar.findByPhoneNumber(number_phone_local, TIPE_PENGIRIM.NOMOR_HP);
                        if (reseller) {
                            kode_reseller = reseller.kode;
                            idReseller = reseller.id_reseller;
                            idMerchant = reseller.id_merchant;
                        }
                    }
                }
                break;
            default:
                console.log("Bukan Griyabayar");
                reseller = await this.repositories.reseller.findByPhoneNumber(pengirim, TIPE_PENGIRIM.WHATSAPP);
                var waSetting = await this.repositories.parameter.findByGroupAndKey(PARAMETER_GROUP.SETTING, "NomorHp=WhatsApp");
                if (waSetting != null && waSetting.value == "1") {
                    if (reseller == null) {
                        reseller = await this.repositories.reseller.findByPhoneNumber(pengirim, TIPE_PENGIRIM.NOMOR_HP);
                        if (reseller) {
                            kode_reseller = reseller.kode;
                            idReseller = reseller.id_reseller;
                            idMerchant = reseller.id_merchant;
                        }
                    }
                }
                break;
        }
        return { kode_reseller, pengirim, idReseller, idMerchant };
    }

    private convertInternationalToLocal(pengirim: any) {
        if (pengirim.startsWith('62')) {
            pengirim = pengirim.substring(2);
            pengirim = `0${pengirim}`;
        }
        return pengirim;
    }

    private convertLocalToInternational(pengirim: any) {
        if (pengirim.startsWith('0')) {
            pengirim = pengirim.substring(1);
            pengirim = `62${pengirim}`;
        }
        return pengirim;
    }

    private getMessageContent(message: proto.IWebMessageInfo) {
        var messageText;
        if (message.message?.conversation != null) {
            messageText = message.message.conversation;
        } else if (message.message?.extendedTextMessage?.text != null) {
            messageText = message.message.extendedTextMessage.text;
        }
        return messageText;
    }
}