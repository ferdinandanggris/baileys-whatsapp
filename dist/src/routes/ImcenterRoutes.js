"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Imcenter_1 = require("../controllers/Imcenter");
const ImcenterRouter = (0, express_1.Router)();
ImcenterRouter.post('/', Imcenter_1.ImcenterController.createImcenter); // Membuat sesi baru
ImcenterRouter.get('/', Imcenter_1.ImcenterController.getAllImcenters); // Mendapatkan semua sesi
ImcenterRouter.delete('/:id', Imcenter_1.ImcenterController.deleteImcenter); // Menghapus sesi
ImcenterRouter.get('/:id', Imcenter_1.ImcenterController.getImcenterById); // Mendapatkan sesi berdasarkan ID
exports.default = ImcenterRouter;
//# sourceMappingURL=ImcenterRoutes.js.map