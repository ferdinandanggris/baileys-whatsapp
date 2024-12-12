import { handleLoginMessage } from "../handlers/queueHandler";
import { getChannel } from "../index";

export const consumeLoginQueue = async () => {
    const channel = getChannel();
    const queueName = 'whatsapp_login';
    await channel.assertQueue(queueName);
  
    channel.consume(queueName, async (message) => {
      if (message && message.content.length > 0) {
        const content = JSON.parse(message.content.toString());

        if(!Object.keys(content).includes('id')){
            console.log('Invalid message received from loginQueue:', content);
            channel.ack(message);
            return;
        }
 
        console.log('Message received from userQueue:', content);
        await handleLoginMessage(content);
        channel.ack(message);
      }
    });
  };