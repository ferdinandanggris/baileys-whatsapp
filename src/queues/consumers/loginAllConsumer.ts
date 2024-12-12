import { handleLoginAllMessage, handleLoginMessage } from "../handlers/queueHandler";
import { getChannel } from "../index";

export const consumeLoginAllQueue = async () => {
    const channel = getChannel();
    const queueName = 'whatsapp_login_all';
    await channel.assertQueue(queueName);
    channel.consume(queueName, async (message) => {
        try {
            if (message) {
                console.log(`Message received from : ${queueName}`, message.content.toString());
                await handleLoginAllMessage();
                channel.ack(message);
            }
        } catch (error) {
            console.log(`Error in consumeLoginAllQueue: ${queueName}`, error);

        }
    });



};