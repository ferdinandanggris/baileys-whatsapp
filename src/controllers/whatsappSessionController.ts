import { Request, Response } from 'express';
import { ImCenterService } from '../modules/whatsapp/services/imcenterService';
import { WhatsappService } from '../modules/whatsapp/whatsappService';
import { publishToLoginQueue } from '../queues/publishers/loginPublisher';
import Imcenter from '../entities/imcenter';
import { InstanceManager } from '../modules/whatsapp/instanceManagerService';
const instanceManager : InstanceManager = require('../modules/whatsapp/instanceManagerService');

    const createSession = async (req: Request, res: Response): Promise<void> => {
        try {
            const { imcenter_id } = req.body;
            const imcenter : Imcenter = new Imcenter();
            imcenter.id = imcenter_id;

            await publishToLoginQueue(imcenter);
            res.status(201).json({ message: "Session created." });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    const getQrCode = async (req: Request, res: Response): Promise<void> => {
        try {
            const { imcenter_id } = req.params;
            const imcenterService = new ImCenterService();
            const qrcode = await imcenterService.getQRCode(imcenter_id);
            res.status(200).json({ qrcode });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    const removeSession = async (req: Request, res: Response): Promise<void> => {
        try {
            const { imcenter_id } = req.params;
            const socket : WhatsappService = instanceManager.getInstance(parseInt(imcenter_id));
            socket.logout();
            res.status(200).json({ message: "Session removed." });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    const sendMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const { sessionId, message, nomor_penerima} = req.body;
            const socket : WhatsappService = instanceManager.getInstance(sessionId);
            const response = await socket.sendMessage(nomor_penerima, message);
            res.status(200).json({ message :"Send message" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    const broadcastMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const { imcenter_id, message, nomor_penerima} = req.body as { imcenter_id : number, message: string, nomor_penerima: string[] };
            const socket : WhatsappService = instanceManager.getInstance(imcenter_id);
            const response = await socket.broadcastMessage(nomor_penerima, message);
            res.status(200).json({ message :"Send message" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    export { createSession, getQrCode, removeSession, sendMessage, broadcastMessage };