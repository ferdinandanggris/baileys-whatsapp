"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const whatsappSessionController_1 = require("../controllers/whatsappSessionController");
const WhatsappSessionRoute = (0, express_1.Router)();
WhatsappSessionRoute.post('/', whatsappSessionController_1.WhatsappSessionController.createSession); // Membuat sesi baru
WhatsappSessionRoute.get('/:nomorhp', whatsappSessionController_1.WhatsappSessionController.GetQrCode); // Mendapatkan QR Code
exports.default = WhatsappSessionRoute;
//# sourceMappingURL=whatsappSessionRoutes.js.map