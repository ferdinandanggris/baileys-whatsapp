import { Request, Response } from 'express';
import { ImCenterService } from '../modules/whatsapp/services/imcenterService';

const imcenterService = new ImCenterService();

export class ImcenterController {
    static async createImcenter(req: Request, res: Response): Promise<void> {
        try {
            const { nomorhp } = req.body;
            const message = await imcenterService.createImcenter(nomorhp);
            res.status(201).json({ message });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllImcenters(_: Request, res: Response): Promise<void> {
        try {
            const sessions = await imcenterService.getAllSessions();
            res.status(200).json(sessions);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteImcenter(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const message = await imcenterService.deleteSession(parseInt(id));
            res.status(200).json({ message });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getImcenterById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const session = await imcenterService.getSession(parseInt(id));
            res.status(200).json(session);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}