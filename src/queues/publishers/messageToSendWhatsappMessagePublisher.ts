import { Message } from '../../interfaces/whatsapp';
import { getChannel } from '../index';

export const publishToWhatsappSendMessageQueue = async (message: Message) => {
  const channel = getChannel();
  const queueName = `whatsapp_send_message`;
  await channel.assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  console.log(`Message published to : ${queueName}`, message);
};