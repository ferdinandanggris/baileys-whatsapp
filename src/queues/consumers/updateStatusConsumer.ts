import { handleLoginMessage, handleUpdateStatusMessage } from "../handlers/queueHandler";
import { getChannel } from "../index";

export const consumeUpdateStatusQueue = async () => {
  const channel = getChannel();
  const queueName = 'whatsapp_update_status';
  await channel.assertQueue(queueName);
  console.log(`Consuming messages from : ${queueName}`);

  channel.consume(queueName, async (message) => {
    try {
      const content = JSON.parse(message.content.toString());

      if (!Object.keys(content).includes('id')) {
        console.log(`Invalid message received from ${queueName}:`, content);
        channel.ack(message);
        return;
      }

      console.log(`Message received from : ${queueName}`, content);
      await handleUpdateStatusMessage(content);
      channel.ack(message);
    } catch (error) {
      channel.ack(message);
      console.error("Error consuming message", error);
    }

  });
};