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
exports.handlePublishToMessageImcenter = exports.handleUpdateStatusMessage = exports.handleLogoutAllMessage = exports.handleLogoutMessage = exports.handleLoginAllMessage = exports.handleLoginMessage = void 0;
const imcenterService_1 = require("../../modules/whatsapp/services/imcenterService");
const messageToImcenterPublisher_1 = require("../publishers/messageToImcenterPublisher");
const instanceManager = require('../../modules/whatsapp/instanceManagerService');
const imcenterService = new imcenterService_1.ImCenterService();
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
    yield socket.connectionHandler.logout();
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
    yield socket.profileHandler.updateProfileStatus();
});
exports.handleUpdateStatusMessage = handleUpdateStatusMessage;
const handlePublishToMessageImcenter = (message) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Processing user message:', message);
    const imcenter = yield imcenterService.getImcenterByNumberPhone(message.sender);
    if (imcenter.id) {
        yield (0, messageToImcenterPublisher_1.publishToMessageImcenterQueue)(imcenter, message);
    }
});
exports.handlePublishToMessageImcenter = handlePublishToMessageImcenter;
// export const handleImcenterSendMessage = async (imcenter : Imcenter,message: Message) => {
//   console.log('Processing user message:', message);
//   if(imcenter.id){
//       const socket : IWhatsappService = instanceManager.getInstance(imcenter.id);
//       await socket.messageHandler.sendMessage(message);
//   }
// }
//# sourceMappingURL=queueHandler.js.map