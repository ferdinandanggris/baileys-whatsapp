import { handleLoginMessage, handleLogoutAllMessage, handleLogoutMessage } from "../handlers/queueHandler";
import { getChannel } from "../index";

export const consumeLogoutAllQueue = async () => {
    const channel = getChannel();
    const queueName = 'whatsapp_logout_all';
    await channel.assertQueue(queueName);
  
    channel.consume(queueName, async (message) => {
      if (message) {
        // const content = JSON.parse(message.content.toString());
        console.log('Message received from userQueue: logout all');
        await handleLogoutAllMessage();
        channel.ack(message);
      }
    });
  };