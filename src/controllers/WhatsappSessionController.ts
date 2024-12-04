import { Request, Response } from 'express';
import { WhatsappSessionService } from '../services/WhatsappSessionService';

const imcenterService = new WhatsappSessionService();


export class WhatsappSessionController{
    static async createSession(req: Request, res: Response): Promise<void> {
        try {
            const { nomorhp } = req.body;
            const message = await imcenterService.createSession(nomorhp);
            res.status(201).json({ message });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async GetQrCode(req: Request, res: Response): Promise<void> {
        try {
            const { nomorhp } = req.params;
            const qrCode = imcenterService.getQRCode(nomorhp);
            res.status(200).json({ qrCode });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}