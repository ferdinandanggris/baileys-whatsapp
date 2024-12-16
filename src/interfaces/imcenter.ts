import Imcenter from "../entities/imcenter";
import { STATUS_LOGIN } from "../entities/types";

export interface IImcenterService {
    checkScannerIsValid(imcenter_id : number,numberPhone: string): Promise<boolean>;
    updateQRCode(id : number, qrcode: string): Promise<string>;
    updateStatus(id : number, status: STATUS_LOGIN): Promise<string>;
    getImcenterById(imcenter_id: number): Promise<Imcenter>;
    getImcenterByJID(jid: string): Promise<Imcenter>;
    updateActivity(id : number) : Promise<boolean>;
}