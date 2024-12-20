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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnection = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const createConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield amqplib_1.default.connect({
            frameMax: 131072, // Sesuaikan frameMax dengan pengaturan RabbitMQ
            hostname: process.env.RABBITMQ_HOSTNAME || 'localhost',
            port: process.env.RABBITMQ_PORT ? parseInt(process.env.RABBITMQ_PORT) : 5672,
            username: process.env.RABBITMQ_USER,
            password: process.env.RABBITMQ_PASSWORD,
            protocol: 'amqps',
        });
        console.log('RabbitMQ connected');
        return connection;
    }
    catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        throw error;
    }
});
exports.createConnection = createConnection;
//# sourceMappingURL=rabbitmq.js.map