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
exports.ImcenterController = void 0;
const imcenterService_1 = require("../modules/whatsapp/services/imcenterService");
const imcenterService = new imcenterService_1.ImCenterService();
class ImcenterController {
    static createImcenter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nomorhp } = req.body;
                const message = yield imcenterService.createImcenter(nomorhp);
                res.status(201).json({ message });
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    static getAllImcenters(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sessions = yield imcenterService.getAllSessions();
                res.status(200).json(sessions);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    static deleteImcenter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const message = yield imcenterService.deleteSession(parseInt(id));
                res.status(200).json({ message });
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    static getImcenterById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const session = yield imcenterService.getSession(parseInt(id));
                res.status(200).json(session);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.ImcenterController = ImcenterController;
//# sourceMappingURL=imcenterController.js.map