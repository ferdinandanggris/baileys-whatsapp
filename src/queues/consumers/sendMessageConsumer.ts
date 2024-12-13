import { Message } from "../../interfaces/whatsapp";
import { handleLoginMessage, handlePublishToMessageImcenter } from "../handlers/queueHandler";
import { getChannel } from "../index";

export const consumeSendMessageQueue = async () => {
    const channel = getChannel();
    const queueName = 'whatsapp_send_message';
    await channel.assertQueue(queueName);
    console.log(`Consuming messages from : ${queueName}`);
  
    channel.consume(queueName, async (message) => {
      if (message && message.content.length > 0) {
        try{
            const content = JSON.parse(message.content.toString()) as Message; 
            console.log(`Message received from : ${queueName}`, content);
            await handlePublishToMessageImcenter(content);
            channel.ack(message);
        }catch(error){
            channel.nack(message);
            console.error("Error consuming message", error);
        }

      }
    });
  };