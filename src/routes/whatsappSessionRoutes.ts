import { Router } from 'express';
import * as whatsappController from '../controllers/whatsappSessionController';

const WhatsappSessionRoute = Router();

WhatsappSessionRoute.post('/', whatsappController.createSession); // Membuat sesi baru
WhatsappSessionRoute.get('/:nomorhp', whatsappController.getQrCode); // Mendapatkan QR Code
WhatsappSessionRoute.post('/remove-session/:nomorhp', whatsappController.removeSession); // Menghapus sesi
WhatsappSessionRoute.post('/broadcast-message', whatsappController.broadcastMessage); // Mengirim broadcast
export default WhatsappSessionRoute;