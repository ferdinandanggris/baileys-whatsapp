import { Request, Response } from 'express';
import { ImCenterService } from '../services/imcenterService';
import { WhatsappService } from '../modules/whatsapp/whatsappService';
const instanceManager = require('../modules/whatsapp/instanceManagerService');

    const createSession = async (req: Request, res: Response): Promise<void> => {
        try {
            const { imcenter_id } = req.body;
            const socket : WhatsappService = instanceManager.getInstance(imcenter_id);
            const result = await socket.init();
            res.status(201).json({ message: "Session created.", qrCode: result });
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
            const { nomorhp } = req.params;
            const socket : WhatsappService = instanceManager.getInstance(nomorhp);
            socket.logout();
            res.status(200).json({ message: "Session removed." });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    const updateModeStandby = async (req: Request, res: Response): Promise<void> => {
        try {
            const { standby, sessionId } = req.body;
            const socket : WhatsappService = instanceManager.getInstance(sessionId);
            await socket.updateModeStandby(standby);
            res.status(200).json({ message: "Mode updated." });
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
            const { sessionId, message, nomor_penerima} = req.body as { sessionId: string, message: string, nomor_penerima: string[] };
            const socket : WhatsappService = instanceManager.getInstance(sessionId);
            const response = await socket.broadcastMessage(nomor_penerima, message);
            res.status(200).json({ message :"Send message" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    export { createSession, getQrCode, removeSession, sendMessage, updateModeStandby, broadcastMessage };