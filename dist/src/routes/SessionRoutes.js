"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SessionController_1 = require("../controllers/SessionController");
const router = (0, express_1.Router)();
router.post('/sessions', SessionController_1.SessionController.createSession); // Membuat sesi baru
router.get('/sessions', SessionController_1.SessionController.getAllSessions); // Mendapatkan semua sesi
router.delete('/sessions/:sessionKey', SessionController_1.SessionController.deleteSession); // Menghapus sesi
exports.default = router;
//# sourceMappingURL=SessionRoutes.js.map