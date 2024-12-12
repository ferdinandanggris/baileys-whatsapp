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
exports.ProfileHandler = void 0;
class ProfileHandler {
    constructor(imcenter_id, socket, imcenterService) {
        this.imcenter_id = imcenter_id;
        this.socket = socket;
        this.imcenterService = imcenterService;
    }
    updateProfileStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imcenter = yield this.imcenterService.getImcenterById(this.imcenter_id);
                if (!imcenter) {
                    throw new Error("Imcenter not found");
                }
                if (imcenter.status_pesan) {
                    this.socket.updateProfileStatus(imcenter.status_pesan);
                }
            }
            catch (error) {
                console.error("Gagal update status", error);
            }
        });
    }
}
exports.ProfileHandler = ProfileHandler;
//# sourceMappingURL=profileHandler.js.map