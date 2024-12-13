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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastMessage = exports.removeSession = exports.getQrCode = exports.createSession = void 0;
const imcenterService_1 = require("../modules/whatsapp/services/imcenterService");
const loginPublisher_1 = require("../queues/publishers/loginPublisher");
const imcenter_1 = __importDefault(require("../entities/imcenter"));
const instanceManager = require('../modules/whatsapp/instanceManagerService');
const createSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imcenter_id } = req.body;
        const imcenter = new imcenter_1.default();
        imcenter.id = imcenter_id;
        yield (0, loginPublisher_1.publishToLoginQueue)(imcenter);
        res.status(201).json({ message: "Session created." });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.createSession = createSession;
const getQrCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imcenter_id } = req.params;
        const imcenterService = new imcenterService_1.ImCenterService();
        const qrcode = yield imcenterService.getQRCode(imcenter_id);
        res.status(200).json({ qrcode });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getQrCode = getQrCode;
const removeSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imcenter_id } = req.params;
        const socket = instanceManager.getInstance(parseInt(imcenter_id));
        socket.connectionHandler.logout();
        res.status(200).json({ message: "Session removed." });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.removeSession = removeSession;
const broadcastMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imcenter_id, message, nomor_penerima } = req.body;
        const socket = instanceManager.getInstance(imcenter_id);
        const response = yield socket.messageHandler.broadcastMessage(nomor_penerima, message);
        res.status(200).json({ message: "Send message" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.broadcastMessage = broadcastMessage;
//# sourceMappingURL=whatsappSessionController.js.map