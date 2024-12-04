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
exports.SessionController = void 0;
const SessionService_1 = require("../services/SessionService");
const sessionService = new SessionService_1.SessionService();
class SessionController {
    static createSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sessionKey } = req.body;
                const message = yield sessionService.createSession(sessionKey);
                res.status(201).json({ message });
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    static getAllSessions(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sessions = yield sessionService.getAllSessions();
                res.status(200).json(sessions);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    static deleteSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sessionKey } = req.params;
                const message = yield sessionService.deleteSession(sessionKey);
                res.status(200).json({ message });
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.SessionController = SessionController;
//# sourceMappingURL=SessionController.js.map