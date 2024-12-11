import { createConnection } from '../configs/rabbitmq';
import amqp from 'amqplib';

let channel: amqp.Channel;

export const initQueue = async () => {
  const connection = await createConnection();
  channel = await connection.createChannel();
  console.log('RabbitMQ channel created');
};

export const getChannel = () => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  return channel;
};