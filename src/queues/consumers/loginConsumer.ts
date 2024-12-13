import { handleLoginMessage } from "../handlers/queueHandler";
import { getChannel } from "../index";

export const consumeLoginQueue = async () => {
  const channel = getChannel();
  const queueName = 'whatsapp_login';
  await channel.assertQueue(queueName);
  console.log(`Consuming messages from : ${queueName}`);

  channel.consume(queueName, async (message) => {
    try {
      if (message && message.content.length > 0) {
        const content = JSON.parse(message.content.toString());

        if (!Object.keys(content).includes('id')) {
          console.log(`Invalid message received from loginQueue: ${queueName}`, content);
          channel.ack(message);
          return;
        }

        console.log(`Message received from : ${queueName}`, content);
        await handleLoginMessage(content);
        channel.ack(message);
      }
    } catch (error) {
      channel.nack(message);
      console.error("Error consuming message", error);
    }

  });
};