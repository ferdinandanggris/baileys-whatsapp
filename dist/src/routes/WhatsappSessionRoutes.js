"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WhatsappSessionController_1 = require("../controllers/WhatsappSessionController");
const WhatsappSessionRoute = (0, express_1.Router)();
WhatsappSessionRoute.post('/', WhatsappSessionController_1.WhatsappSessionController.createSession); // Membuat sesi baru
WhatsappSessionRoute.get('/:nomorhp', WhatsappSessionController_1.WhatsappSessionController.GetQrCode); // Mendapatkan QR Code
exports.default = WhatsappSessionRoute;
//# sourceMappingURL=WhatsappSessionRoutes.js.map