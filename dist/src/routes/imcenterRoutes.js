"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imcenterController_1 = require("../controllers/imcenterController");
const ImcenterRouter = (0, express_1.Router)();
ImcenterRouter.post('/', imcenterController_1.ImcenterController.createImcenter); // Membuat sesi baru
ImcenterRouter.get('/', imcenterController_1.ImcenterController.getAllImcenters); // Mendapatkan semua sesi
ImcenterRouter.delete('/:id', imcenterController_1.ImcenterController.deleteImcenter); // Menghapus sesi
ImcenterRouter.get('/:id', imcenterController_1.ImcenterController.getImcenterById); // Mendapatkan sesi berdasarkan ID
exports.default = ImcenterRouter;
//# sourceMappingURL=imcenterRoutes.js.map