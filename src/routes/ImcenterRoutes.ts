import { Router } from 'express';
import { ImcenterController } from '../controllers/Imcenter';

const ImcenterRouter = Router();

ImcenterRouter.post('/', ImcenterController.createImcenter); // Membuat sesi baru
ImcenterRouter.get('/', ImcenterController.getAllImcenters); // Mendapatkan semua sesi
ImcenterRouter.delete('/:id', ImcenterController.deleteImcenter); // Menghapus sesi
ImcenterRouter.get('/:id', ImcenterController.getImcenterById); // Mendapatkan sesi berdasarkan ID
export default ImcenterRouter;