import { getChannel } from "..";
import { OTP } from "../../interfaces/whatsapp";
import { handleSendOTPMessage } from "../handlers/queueHandler";

export const consumeSendOTPQueue = async () => {
    const channel = getChannel();
    const queueName = 'whatsapp_otp';
    await channel.assertQueue(queueName);
    console.log(`Consuming messages from : ${queueName}`);

    channel.consume(queueName, async (message) => {
        try {
            const content = JSON.parse(message.content.toString()) as OTP;
            console.log(`Message received from : ${queueName}`, content);

            await handleSendOTPMessage(content);
            channel.ack(message);
        } catch (error) {
            channel.nack(message);
            console.error("Error consuming message", error);
        }

    });
};