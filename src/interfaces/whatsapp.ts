import makeWASocket, { proto } from "baileys";
import { MessageHandler } from "../modules/whatsapp/handlers/messageHandler";
import { ConnectionHandler } from "../modules/whatsapp/handlers/connectionHandler";
import AuthHandler from "../modules/whatsapp/handlers/authHandler";
import { ProfileHandler } from "../modules/whatsapp/handlers/profileHandler";
import { MessageService } from "../modules/whatsapp/services/messageService";
import { IImcenterService } from "./imcenter";
import { IMessageService } from "./message";

export interface IWhatsappService {
    connect(): Promise<void>;
    messageHandler: MessageHandler;
    connectionHandler: ConnectionHandler;
    authHandler: AuthHandler;
    profileHandler: ProfileHandler;
    connectionState: any;
}

export type SendWhatsappMessage = {
    receiver: string;
    message: string;
    raw_message: string;
    kode_reseller? : string;
    imcenter_id? : number;
}

export type Message = {
    id_outbox?: number;
    id_smsgateway?: number;
    message: string;
    receiver: string;
    sender: string;
    raw_message: string;
    is_griyabayar: boolean;
};

export type WhatsappServiceProps = {
    imcenter_id: number;
    socket: ReturnType<typeof makeWASocket>;
    sessionService: ISessionService;
    imcenterService: IImcenterService;
    messageService: IMessageService;
}

export type OTP = {
    otp : string;
    expired_at : number;
    nomorhp : string;
    griyabayar : boolean;
}

