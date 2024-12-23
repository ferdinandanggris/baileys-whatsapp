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
exports.sendMessage = exports.removeSession = exports.getQrCode = exports.createSession = void 0;
const imcenterService_1 = require("../services/imcenterService");
const instanceManager = require('../modules/whatsapp/instanceManagerService');
const createSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nomorhp } = req.body;
        const socket = instanceManager.getInstance(nomorhp);
        socket.init();
        res.status(201).json({ message: "Session created." });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.createSession = createSession;
const getQrCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nomorhp } = req.params;
        const imcenterService = new imcenterService_1.ImCenterService();
        const qrcode = yield imcenterService.getQRCode(nomorhp);
        res.status(200).json({ qrcode });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getQrCode = getQrCode;
const removeSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nomorhp } = req.params;
        const socket = instanceManager.getInstance(nomorhp);
        socket.logout();
        res.status(200).json({ message: "Session removed." });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.removeSession = removeSession;
// const updateModeStandby = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { standby, sessionId } = req.body;
//         const socket : WhatsappService = instanceManager.getInstance(sessionId);
//         await socket.updateModeStandby(standby);
//         res.status(200).json({ message: "Mode updated." });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// }
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId, message, nomor_penerima } = req.body;
        const socket = instanceManager.getInstance(sessionId);
        const response = yield socket.sendMessage(nomor_penerima, message);
        res.status(200).json({ message: "Send message" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.sendMessage = sendMessage;
//# sourceMappingURL=whatsappSessionController.js.map