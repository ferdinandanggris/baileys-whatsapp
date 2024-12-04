import { Request, Response } from 'express';
import { SessionService } from '../services/SessionService';

const sessionService = new SessionService();

export class SessionController {
    static async createSession(req: Request, res: Response): Promise<void> {
        try {
            const { sessionKey } = req.body;
            const message = await sessionService.createSession(sessionKey);
            res.status(201).json({ message });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllSessions(_: Request, res: Response): Promise<void> {
        try {
            const sessions = await sessionService.getAllSessions();
            res.status(200).json(sessions);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteSession(req: Request, res: Response): Promise<void> {
        try {
            const { sessionKey } = req.params;
            const message = await sessionService.deleteSession(sessionKey);
            res.status(200).json({ message });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}