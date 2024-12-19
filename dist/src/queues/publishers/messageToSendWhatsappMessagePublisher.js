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
exports.publishToWhatsappSendMessageQueue = void 0;
const index_1 = require("../index");
const publishToWhatsappSendMessageQueue = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const channel = (0, index_1.getChannel)();
    const queueName = `whatsapp_send_message`;
    yield channel.assertQueue(queueName);
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log(`Message published to : ${queueName}`, message);
});
exports.publishToWhatsappSendMessageQueue = publishToWhatsappSendMessageQueue;
//# sourceMappingURL=messageToSendWhatsappMessagePublisher.js.map