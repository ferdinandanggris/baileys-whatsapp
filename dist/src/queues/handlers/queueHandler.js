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
exports.handleUpdateStatusMessage = exports.handleLogoutAllMessage = exports.handleLogoutMessage = exports.handleLoginAllMessage = exports.handleLoginMessage = void 0;
const instanceManager = require('../../modules/whatsapp/instanceManagerService');
const handleLoginMessage = (imcenter) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Processing user message:', imcenter);
    const socket = instanceManager.getInstance(imcenter.id);
    yield socket.connect();
});
exports.handleLoginMessage = handleLoginMessage;
const handleLoginAllMessage = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Processing user message: login all');
    yield instanceManager.loginAllSessions();
});
exports.handleLoginAllMessage = handleLoginAllMessage;
const handleLogoutMessage = (imcenter) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Processing user message:', imcenter);
    const socket = instanceManager.getInstance(imcenter.id);
    yield socket.logout();
    yield instanceManager.removeInstance(imcenter.id);
});
exports.handleLogoutMessage = handleLogoutMessage;
const handleLogoutAllMessage = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Processing user message: logout all');
    yield instanceManager.logoutAll();
});
exports.handleLogoutAllMessage = handleLogoutAllMessage;
const handleUpdateStatusMessage = (imcenter) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Processing user message:', imcenter);
    const socket = instanceManager.getInstance(imcenter.id);
    yield socket.updateProfileStatus();
});
exports.handleUpdateStatusMessage = handleUpdateStatusMessage;
//# sourceMappingURL=queueHandler.js.map