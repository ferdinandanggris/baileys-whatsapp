import Imcenter from '../../entities/imcenter';
import { getChannel } from '../index';

export const publishToLoginQueue = async (message: Imcenter) => {
  const channel = getChannel();
  const queueName = 'whatsapp_login';
  await channel.assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  console.log('Message published to userQueue:', message);
};