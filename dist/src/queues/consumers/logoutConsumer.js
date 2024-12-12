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
exports.consumeLogoutQueue = void 0;
const queueHandler_1 = require("../handlers/queueHandler");
const index_1 = require("../index");
const consumeLogoutQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    const channel = (0, index_1.getChannel)();
    const queueName = 'whatsapp_logout';
    yield channel.assertQueue(queueName);
    channel.consume(queueName, (message) => __awaiter(void 0, void 0, void 0, function* () {
        if (message && message.content.length > 0) {
            const content = JSON.parse(message.content.toString());
            if (!Object.keys(content).includes('id')) {
                console.log('Invalid message received from userQueue:', content);
                channel.ack(message);
                return;
            }
            console.log('Message received from userQueue:', content);
            yield (0, queueHandler_1.handleLogoutMessage)(content);
            channel.ack(message);
        }
    }));
});
exports.consumeLogoutQueue = consumeLogoutQueue;
//# sourceMappingURL=logoutConsumer.js.map