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
exports.startConsumers = exports.getChannel = exports.initQueue = void 0;
const rabbitmq_1 = require("../configs/rabbitmq");
const loginConsumer_1 = require("./consumers/loginConsumer");
const logoutConsumer_1 = require("./consumers/logoutConsumer");
const loginAllConsumer_1 = require("./consumers/loginAllConsumer");
const logoutAllConsumer_1 = require("./consumers/logoutAllConsumer");
const updateStatusConsumer_1 = require("./consumers/updateStatusConsumer");
let channel;
const initQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield (0, rabbitmq_1.createConnection)();
    channel = yield connection.createChannel();
    console.log('RabbitMQ channel created');
});
exports.initQueue = initQueue;
const getChannel = () => {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized');
    }
    return channel;
};
exports.getChannel = getChannel;
const startConsumers = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, loginConsumer_1.consumeLoginQueue)();
    yield (0, loginAllConsumer_1.consumeLoginAllQueue)();
    yield (0, logoutConsumer_1.consumeLogoutQueue)();
    yield (0, logoutAllConsumer_1.consumeLogoutAllQueue)();
    yield (0, updateStatusConsumer_1.consumeUpdateStatusQueue)();
});
exports.startConsumers = startConsumers;
//# sourceMappingURL=index.js.map