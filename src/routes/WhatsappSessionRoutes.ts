import { Router } from 'express';
import { WhatsappSessionController } from '../controllers/whatsappSessionController';

const WhatsappSessionRoute = Router();

WhatsappSessionRoute.post('/', WhatsappSessionController.createSession); // Membuat sesi baru
WhatsappSessionRoute.get('/:nomorhp', WhatsappSessionController.GetQrCode); // Mendapatkan QR Code
export default WhatsappSessionRoute;