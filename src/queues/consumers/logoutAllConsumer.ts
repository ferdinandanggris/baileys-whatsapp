import { handleLoginMessage, handleLogoutAllMessage, handleLogoutMessage } from "../handlers/queueHandler";
import { getChannel } from "../index";

export const consumeLogoutAllQueue = async () => {
    const channel = getChannel();
    const queueName = 'whatsapp_logout_all';
    await channel.assertQueue(queueName);
    console.log(`Consuming messages from : ${queueName}`);
  
    channel.consume(queueName, async (message) => {
      try {
        console.log(`Message received from : ${queueName}`, message);
        await handleLogoutAllMessage();
        channel.ack(message);
      } catch (error) {
        channel.nack(message);
      }
      
    });
  };