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
exports.stopConsumeImcenterSendMessageQueue = exports.consumeImcenterSendMessageQueue = void 0;
const queueHandler_1 = require("../handlers/queueHandler");
const index_1 = require("../index");
let consumerTag = new Map();
const consumeImcenterSendMessageQueue = (imcenter) => __awaiter(void 0, void 0, void 0, function* () {
    const channel = (0, index_1.getChannel)();
    const queueName = `whatsapp_send_message_${imcenter.id}`;
    yield channel.assertQueue(queueName);
    console.log(`Consuming messages from : ${queueName}`);
    const result = yield channel.consume(queueName, (message) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const content = JSON.parse(message.content.toString());
            console.log(`Message received from : ${queueName}`, content);
            yield (0, queueHandler_1.handleImcenterSendMessage)(imcenter, content);
            channel.ack(message);
        }
        catch (error) {
            channel.nack(message);
            console.error("Error consuming message", error);
        }
    }));
    if (result)
        consumerTag.set(imcenter.id, result.consumerTag);
});
exports.consumeImcenterSendMessageQueue = consumeImcenterSendMessageQueue;
const stopConsumeImcenterSendMessageQueue = (imcenter) => __awaiter(void 0, void 0, void 0, function* () {
    const channel = (0, index_1.getChannel)();
    const queueName = `whatsapp_send_message_${imcenter.id}`;
    const consumer = consumerTag.get(imcenter.id);
    if (consumer) {
        yield channel.cancel(consumer);
        console.log(`Consumer with queue name ${queueName} has been stopped`);
        consumerTag.delete(imcenter.id);
    }
});
exports.stopConsumeImcenterSendMessageQueue = stopConsumeImcenterSendMessageQueue;
//# sourceMappingURL=imcenterConsumer.js.map