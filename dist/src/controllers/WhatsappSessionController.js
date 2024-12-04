"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappSessionController = void 0;
const WhatsappSessionService_1 = require("../services/WhatsappSessionService");
const imcenterService = new WhatsappSessionService_1.WhatsappSessionService();
class WhatsappSessionController {
    static createSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nomorhp } = req.body;
                const message = yield imcenterService.createSession(nomorhp);
                res.status(201).json({ message });
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    static GetQrCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nomorhp } = req.params;
                const qrCode = yield imcenterService.getQRCode(nomorhp);
                res.status(200).json({ qrCode });
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.WhatsappSessionController = WhatsappSessionController;
//# sourceMappingURL=WhatsappSessionController.js.map