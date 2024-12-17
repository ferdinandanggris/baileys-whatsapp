import { proto } from "baileys";
import { AppDataSource } from "../../../configs/db";
import { ImcenterLogs } from "../../../entities/imcenterLogs";
import { PARAMETER_GROUP, STATUS_INBOX, STATUS_LOG, STATUS_LOGIN, TIPE_APLIKASI, TIPE_LOG, TIPE_PENGIRIM } from "../../../entities/types";
import { timeToDate } from "../../../utils/date";
import { IsNull, Not } from "typeorm";
import { IMessageService } from "../../../interfaces/message";
import Imcenter from "../../../entities/imcenter";
import { ImcenterRepository } from "../../../repositories/imcenterRepository";
import { jidToNumberPhone } from "../../../utils/whatsapp";
import { ResellerModel } from "../../../interfaces/reseller";
import { ResellerRepository } from "../../../repositories/resellerRepository";
import ResellerGriyabayarService from "../../griyabayar/services/resellerService";
import ParameterService from "../../autoResponse/services/parameterService";
import ParameterGriyabayarService from "../../../repositories/parameterGriyabayarRepository";
import { ResellerGriyabayarRepository } from "../../../repositories/resellerGriyabayarRepository";
import { ImcenterLogRepository } from "../../../repositories/imcenterLogRepository";
import { InstanceManager } from "../instanceManagerService";
import { InboxGriyabayar } from "../../../entities/inboxGriyabayar";
import InboxGriyabayarRepostiory from "../../../repositories/inboxGriyabayarRepository";
import { Inbox } from "../../../entities/inbox";
import InboxRepository from "../../../repositories/inboxRepository";
import { WhatsappService } from "../whatsappService";

export class MessageService implements IMessageService {

    private repository = AppDataSource.getRepository(ImcenterLogs);
    private repositories = {
        imcenter: new ImcenterRepository(),
        reseller: new ResellerRepository(),
        resellerGriyabayar: new ResellerGriyabayarRepository(),
        parameter: new ParameterService(),
        parameterGriyabayar: new ParameterGriyabayarService(),
        imcenterLog: new ImcenterLogRepository(),
        inboxGriyabayar : new InboxGriyabayarRepostiory(),
        inbox : new InboxRepository()
    }

    constructor(private whatsappService : WhatsappService, private imcenter_id: number) { }

    async saveMessage(message: proto.IWebMessageInfo, tipe: TIPE_LOG) {
        const imcenterLog = this.getSkeletonLog();
        imcenterLog.keterangan = message?.message?.conversation;
        imcenterLog.tipe = tipe;
        imcenterLog.pengirim = message.key.remoteJid;
        imcenterLog.message_id = message.key.id;
        imcenterLog.sender_timestamp = timeToDate(Number(message.messageTimestamp))
        imcenterLog.raw_message = JSON.stringify(message)
        await this.repository.save(imcenterLog);
    }

    async createLog(messageLog: ImcenterLogs): Promise<ImcenterLogs> {
        return await this.repository.save(messageLog);
    }

    async saveLog(message: string, tipe: TIPE_LOG) {
        const imcenterLog = this.getSkeletonLog();
        imcenterLog.keterangan = message;
        imcenterLog.tipe = tipe
        await this.repository.save(imcenterLog);
    }

    private getSkeletonLog(): ImcenterLogs {
        const imcenterLog = new ImcenterLogs();
        imcenterLog.aplikasi = TIPE_APLIKASI.NODEJS;
        imcenterLog.imcenter_id = this.imcenter_id;
        imcenterLog.tgl_entri = new Date();

        return imcenterLog;
    }

    async getMessageByMessageId(messageId: string): Promise<ImcenterLogs> {
        return this.repository.findOneBy({ message_id: messageId });
    }

    async updateStatus(messageId: string, status: STATUS_LOG) {
        await this.repository.update({ message_id: messageId }, { status });
    }

    async getLatestMessageByImcenter(): Promise<ImcenterLogs> {
        return this.repository.findOne({ where: { imcenter_id: this.imcenter_id, sender_timestamp: Not(IsNull()) }, order: { sender_timestamp: 'DESC' } });
    }

    async saveMultipleMessage(messages: ImcenterLogs[]) {
        await this.repository.save(messages);
    }

    async processMessagesFromUpsert(messages: proto.IWebMessageInfo[]): Promise<void> {
        try {
            for (const message of messages) {
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
                }else{
                    await this.saveInboxFromReceipt(message);
                }

                await this.repositories.imcenterLog.create(imcenterLog);
            }
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async saveInboxFromReceipt(message: proto.IWebMessageInfo): Promise<void> {
        try {
            const imcenter = await this.repositories.imcenter.fetchById(this.imcenter_id);
            if (!imcenter) throw new Error(`imcenter with key "${message.key.remoteJid}" not found.`);
            var messageText = this.getMessageContent(message);
            var { kode_reseller, pengirim, idReseller, idMerchant } = await this.findResellerByPhone(message, imcenter);
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

    private async findResellerByPhone(message: proto.IWebMessageInfo, imcenter: Imcenter) {
        const pengirim = jidToNumberPhone(message.key.remoteJid);
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