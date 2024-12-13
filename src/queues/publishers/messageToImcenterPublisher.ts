import Imcenter from '../../entities/imcenter';
import { Message } from '../../interfaces/whatsapp';
import { getChannel } from '../index';

export const publishToMessageImcenterQueue = async (imcenter : Imcenter, message: Message) => {
  const channel = getChannel();
  const queueName = `whatsapp_send_message_${imcenter.id}`;
  await channel.assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  console.log(`Message published to : ${queueName}`, message);
};