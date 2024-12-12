import { handleLoginMessage, handleUpdateStatusMessage } from "../handlers/queueHandler";
import { getChannel } from "../index";

export const consumeUpdateStatusQueue = async () => {
    const channel = getChannel();
    const queueName = 'whatsapp_update_status';
    await channel.assertQueue(queueName);
  
    channel.consume(queueName, async (message) => {
      if (message && message.content.length > 0) {
        const content = JSON.parse(message.content.toString());

        if(!Object.keys(content).includes('id')){
            console.log(`Invalid message received from ${queueName}:`, content);
            channel.ack(message);
            return;
        }
 
        console.log(`Message received from : ${queueName}`, content);
        await handleUpdateStatusMessage(content);
        channel.ack(message);
      }
    });
  };