import { Router } from 'express';
import { SessionController } from '../controllers/SessionController';

const router = Router();

router.post('/sessions', SessionController.createSession); // Membuat sesi baru
router.get('/sessions', SessionController.getAllSessions); // Mendapatkan semua sesi
router.delete('/sessions/:sessionKey', SessionController.deleteSession); // Menghapus sesi

export default router;