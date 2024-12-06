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
const db_1 = require("../../../configs/db");
const whatsappSession_1 = require("../../../entities/whatsappSession");
class SessionService {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(whatsappSession_1.WhatsappSession);
    }
    saveSession(nomorhp, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.repository.findOneBy({ nomorhp })) {
                this.repository.save({ nomorhp, sessionCred: socket.authState.creds, sessionKey: socket.authState.keys });
            }
        });
    }
    removeSession(nomorhp) {
        return __awaiter(this, void 0, void 0, function* () {
            // Remove session
            this.repository.delete({ nomorhp });
        });
    }
}
exports.default = SessionService;
//# sourceMappingURL=sessionService.js.map