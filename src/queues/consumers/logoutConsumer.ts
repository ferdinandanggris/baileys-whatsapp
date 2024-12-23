import { handleLoginMessage, handleLogoutMessage } from "../handlers/queueHandler";
import { getChannel } from "../index";

export const consumeLogoutQueue = async () => {
    const channel = getChannel();
    const queueName = 'whatsapp_logout';
    await channel.assertQueue(queueName);
    console.log(`Consuming messages from : ${queueName}`);
  
    channel.consume(queueName, async (message) => {
      try{
          const content = JSON.parse(message.content.toString());
  
          if(!Object.keys(content).includes('id')){
              console.log(`Invalid message received from loginQueue: ${queueName}`, content);
              channel.ack(message);
              return;
          }
  
          console.log(`Message received from : ${queueName}`, content);
          await handleLogoutMessage(content);
          channel.ack(message);
      }catch(error){
        channel.ack(message);
        console.error("Error consuming message", error);
      }

    });
  };