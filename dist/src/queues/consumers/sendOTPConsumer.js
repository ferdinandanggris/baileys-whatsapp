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
exports.consumeSendOTPQueue = void 0;
const __1 = require("..");
const queueHandler_1 = require("../handlers/queueHandler");
const consumeSendOTPQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    const channel = (0, __1.getChannel)();
    const queueName = 'whatsapp_otp';
    yield channel.assertQueue(queueName);
    console.log(`Consuming messages from : ${queueName}`);
    channel.consume(queueName, (message) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const content = JSON.parse(message.content.toString());
            console.log(`Message received from : ${queueName}`, content);
            yield (0, queueHandler_1.handleSendOTPMessage)(content);
            channel.ack(message);
        }
        catch (error) {
            channel.ack(message);
            console.error("Error consuming message", error);
        }
    }));
});
exports.consumeSendOTPQueue = consumeSendOTPQueue;
//# sourceMappingURL=sendOTPConsumer.js.map