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
exports.consumeLoginQueue = void 0;
const queueHandler_1 = require("../handlers/queueHandler");
const index_1 = require("../index");
const consumeLoginQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    const channel = (0, index_1.getChannel)();
    const queueName = 'whatsapp_login';
    yield channel.assertQueue(queueName);
    console.log(`Consuming messages from : ${queueName}`);
    channel.consume(queueName, (message) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (message && message.content.length > 0) {
                const content = JSON.parse(message.content.toString());
                if (!Object.keys(content).includes('id')) {
                    console.log(`Invalid message received from loginQueue: ${queueName}`, content);
                    channel.ack(message);
                    return;
                }
                console.log(`Message received from : ${queueName}`, content);
                yield (0, queueHandler_1.handleLoginMessage)(content);
                channel.ack(message);
            }
        }
        catch (error) {
            channel.nack(message);
            console.error("Error consuming message", error);
        }
    }));
});
exports.consumeLoginQueue = consumeLoginQueue;
//# sourceMappingURL=loginConsumer.js.map