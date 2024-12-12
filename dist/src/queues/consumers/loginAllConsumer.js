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
exports.consumeLoginAllQueue = void 0;
const queueHandler_1 = require("../handlers/queueHandler");
const index_1 = require("../index");
const consumeLoginAllQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    const channel = (0, index_1.getChannel)();
    const queueName = 'whatsapp_login_all';
    yield channel.assertQueue(queueName);
    channel.consume(queueName, (message) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (message) {
                console.log(`Message received from : ${queueName}`, message.content.toString());
                yield (0, queueHandler_1.handleLoginAllMessage)();
                channel.ack(message);
            }
        }
        catch (error) {
            console.log(`Error in consumeLoginAllQueue: ${queueName}`, error);
        }
    }));
});
exports.consumeLoginAllQueue = consumeLoginAllQueue;
//# sourceMappingURL=loginAllConsumer.js.map