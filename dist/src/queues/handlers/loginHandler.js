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
exports.handleLoginAllMessage = exports.handleLoginMessage = void 0;
const instanceManager = require('../../modules/whatsapp/instanceManagerService');
const handleLoginMessage = (imcenter) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Processing user message:', imcenter);
    const socket = instanceManager.getInstance(imcenter.id);
    yield socket.connect();
});
exports.handleLoginMessage = handleLoginMessage;
const handleLoginAllMessage = (imcenter) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Processing user message:', imcenter);
    const socket = instanceManager.getInstance(imcenter.id);
    yield socket.connect();
});
exports.handleLoginAllMessage = handleLoginAllMessage;
//# sourceMappingURL=loginHandler.js.map