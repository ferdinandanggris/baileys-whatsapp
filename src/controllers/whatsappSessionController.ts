import { Request, Response } from 'express';
import { ImCenterService } from '../modules/whatsapp/services/imcenterService';
import { publishToLoginQueue } from '../queues/publishers/loginPublisher';
import Imcenter from '../entities/imcenter';
import { InstanceManager } from '../modules/whatsapp/instanceManagerService';
import {IWhatsappService} from '../interfaces/whatsapp';
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
            const socket : IWhatsappService = instanceManager.getInstance(parseInt(imcenter_id));
            socket.connectionHandler.logout();
            res.status(200).json({ message: "Session removed." });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    const broadcastMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const { imcenter_id, message, nomor_penerima} = req.body as { imcenter_id : number, message: string, nomor_penerima: string[] };
            const socket : IWhatsappService = instanceManager.getInstance(imcenter_id);
            const response = await socket.messageHandler.broadcastMessage(nomor_penerima, message);
            res.status(200).json({ message :"Send message" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    export { createSession, getQrCode, removeSession, broadcastMessage };