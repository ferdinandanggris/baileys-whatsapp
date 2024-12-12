import { handleLoginMessage, handleLogoutMessage } from "../handlers/queueHandler";
import { getChannel } from "../index";

export const consumeLogoutQueue = async () => {
    const channel = getChannel();
    const queueName = 'whatsapp_logout';
    await channel.assertQueue(queueName);
  
    channel.consume(queueName, async (message) => {
      if (message && message.content.length > 0) {
        const content = JSON.parse(message.content.toString());

        if(!Object.keys(content).includes('id')){
            console.log('Invalid message received from LogoutQueue:', content);
            channel.ack(message);
            return;
        }

        console.log('Message received from userQueue:', content);
        await handleLogoutMessage(content);
        channel.ack(message);
      }
    });
  };