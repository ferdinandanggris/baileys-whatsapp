import { Message } from "../../src/interfaces/whatsapp";
import { AppDataSource } from "../../src/configs/db";
import { WhatsappSession } from "../../src/entities/whatsappSession";
import { WhatsappService } from "../../src/modules/whatsapp/whatsappService";

describe('Integration send whatsapp message from queue channel [whatsapp_send]', () => {
    const testQueue = 'whatsapp_send_message';
    const message : Message = {
        is_griyabayar: false,
        message: "Test message from queue",
        receiver: "6282131955087",
        sender: "6282131955087",
        raw_message: null,
    } 
    const repository = AppDataSource.getRepository(WhatsappSession);

    beforeAll(async () => {
        const connectDb = new Promise((resolve, reject) => {
            AppDataSource.initialize().then(async (connection) => {
                const whatsappService = new WhatsappService(1);
                await whatsappService.init();

                resolve(connection);
            });
        });

        await connectDb;
    });

    test('should found session auto active', async () => {
        const activeSession = await repository.find();
        expect(activeSession.length).toBeGreaterThan(0);
    });

});