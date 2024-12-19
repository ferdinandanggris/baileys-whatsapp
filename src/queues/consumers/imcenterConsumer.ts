import Imcenter from "../../entities/imcenter";
import { Message } from "../../interfaces/whatsapp";
import { handleImcenterSendMessage } from "../handlers/queueHandler";
// import { handleImcenterSendMessage } from "../handlers/queueHandler";
import { getChannel } from "../index";

let consumerTag : Map<number, string> = new Map();

export const consumeImcenterSendMessageQueue = async (imcenter :Imcenter) => {
    const channel = getChannel();
    const queueName = `whatsapp_send_message_${imcenter.id}`;
    await channel.assertQueue(queueName);
    console.log(`Consuming messages from : ${queueName}`);
  
  const result = await channel.consume(queueName, async (message) => {
        try{
            const content = JSON.parse(message.content.toString()) as Message; 
            console.log(`Message received from : ${queueName}`, content);
            await handleImcenterSendMessage(imcenter,content);
            channel.ack(message);
        }catch(error){
            channel.nack(message);
            console.error("Error consuming message", error);
        }
    });

    if(result)consumerTag.set(imcenter.id,result.consumerTag);
  };

export const stopConsumeImcenterSendMessageQueue = async (imcenter :Imcenter) => {
    const channel = getChannel();
    const queueName = `whatsapp_send_message_${imcenter.id}`;
    
    const consumer = consumerTag.get(imcenter.id);
    if(consumer){
        await channel.cancel(consumer);
        console.log(`Consumer with queue name ${queueName} has been stopped`);
        consumerTag.delete(imcenter.id);
    }
  };