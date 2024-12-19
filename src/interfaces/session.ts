interface ISessionService {
    removeSession(jid : string): Promise<void>;
    processUpdateQR(imcenter_id : number, qrcode : string): Promise<void>;
}