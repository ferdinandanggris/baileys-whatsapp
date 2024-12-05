import { Request, Response } from 'express';
import { WhatsappSessionService } from '../services/whatsappSessionService';

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
            const qrcode = await imcenterService.getQRCode(nomorhp);
            res.status(200).json({ qrcode });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async removeSession(req: Request, res: Response): Promise<void> {
        try {
            const { nomorhp } = req.params;
            const message = await imcenterService.removeSession(nomorhp);
            res.status(200).json({ message });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateModeStandby(req: Request, res: Response): Promise<void> {
        try {
            const { standby, sessionId } = req.body;
            const message = await imcenterService.updateModeStandby(standby, sessionId);
            res.status(200).json({ message });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}