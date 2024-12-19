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
const db_1 = require("../../src/configs/db");
const whatsappSession_1 = require("../../src/entities/whatsappSession");
const whatsappService_1 = require("../../src/modules/whatsapp/whatsappService");
describe('Integration send whatsapp message from queue channel [whatsapp_send]', () => {
    const testQueue = 'whatsapp_send_message';
    const message = {
        is_griyabayar: false,
        message: "Test message from queue",
        receiver: "6282131955087",
        sender: "6282131955087",
        raw_message: null,
    };
    const repository = db_1.AppDataSource.getRepository(whatsappSession_1.WhatsappSession);
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const connectDb = new Promise((resolve, reject) => {
            db_1.AppDataSource.initialize().then((connection) => __awaiter(void 0, void 0, void 0, function* () {
                const whatsappService = new whatsappService_1.WhatsappService(1);
                yield whatsappService.init();
                resolve(connection);
            }));
        });
        yield connectDb;
    }));
    test('should found session auto active', () => __awaiter(void 0, void 0, void 0, function* () {
        const activeSession = yield repository.find();
        expect(activeSession.length).toBeGreaterThan(0);
    }));
});
//# sourceMappingURL=sendMessageFromChannelWhatsappSend.test.js.map