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
exports.consumeLogoutAllQueue = void 0;
const queueHandler_1 = require("../handlers/queueHandler");
const index_1 = require("../index");
const consumeLogoutAllQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    const channel = (0, index_1.getChannel)();
    const queueName = 'whatsapp_logout_all';
    yield channel.assertQueue(queueName);
    console.log(`Consuming messages from : ${queueName}`);
    channel.consume(queueName, (message) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(`Message received from : ${queueName}`, message);
            yield (0, queueHandler_1.handleLogoutAllMessage)();
            channel.ack(message);
        }
        catch (error) {
            channel.nack(message);
        }
    }));
});
exports.consumeLogoutAllQueue = consumeLogoutAllQueue;
//# sourceMappingURL=logoutAllConsumer.js.map