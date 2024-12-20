import amqp from 'amqplib';

export const createConnection = async () => {
  try {
    const connection = await amqp.connect({
      frameMax: 131072, // Sesuaikan frameMax dengan pengaturan RabbitMQ
      hostname: process.env.RABBITMQ_HOSTNAME || 'localhost',
      port: process.env.RABBITMQ_PORT ? parseInt(process.env.RABBITMQ_PORT) : 5672,
      username: process.env.RABBITMQ_USER,
      password: process.env.RABBITMQ_PASSWORD,
      protocol: 'amqps',

    });
    console.log('RabbitMQ connected');
    return connection;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
};