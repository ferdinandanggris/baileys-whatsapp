import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

export const createConnection = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    console.log('RabbitMQ connected');
    return connection;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
};