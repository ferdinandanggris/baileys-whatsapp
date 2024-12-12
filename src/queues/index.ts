import { createConnection } from '../configs/rabbitmq';
import amqp from 'amqplib';
import { consumeLoginQueue } from './consumers/loginConsumer';
import { consumeLogoutQueue } from './consumers/logoutConsumer';
import { consumeLoginAllQueue } from './consumers/loginAllConsumer';
import { consumeLogoutAllQueue } from './consumers/logoutAllConsumer';
import { consumeUpdateStatusQueue } from './consumers/updateStatusConsumer';

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

export const startConsumers = async () => {
  await consumeLoginQueue();
  await consumeLoginAllQueue();
  await consumeLogoutQueue();
  await consumeLogoutAllQueue();
  await consumeUpdateStatusQueue();
}