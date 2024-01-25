import * as amqp from "amqplib";

// Subscribe to rabbitmq
export async function subscribeToRabbitMQ(
  exchange: string,
  routingKey: string,
  handleMessage: (message: Buffer) => void,
  rabbitMQConfig: {
    host: string;
    port: number;
    username: string;
    password: string;
  }
): Promise<void> {
  const connection = await amqp.connect({
    protocol: "amqp",
    hostname: rabbitMQConfig.host,
    port: rabbitMQConfig.port,
    username: rabbitMQConfig.username,
    password: rabbitMQConfig.password,
  });

  const channel = await connection.createChannel();
  await channel.assertExchange(exchange, "direct", { durable: false });

  const queue = await channel.assertQueue("", { exclusive: true });
  channel.bindQueue(queue.queue, exchange, routingKey);

  channel.consume(
    queue.queue,
    (msg) => {
      if (msg !== null && msg.content) {
        handleMessage(msg.content as Buffer);
      }
    },
    { noAck: true }
  );
}

// Publish event to rabbitmq
export async function publishToRabbitMQ(
  exchange: string,
  routingKey: string,
  message: string,
  rabbitMQConfig: {
    host: string;
    port: number;
    username: string;
    password: string;
  }
): Promise<void> {
  const connection = await amqp.connect({
    protocol: "amqp",
    hostname: rabbitMQConfig.host,
    port: rabbitMQConfig.port,
    username: rabbitMQConfig.username,
    password: rabbitMQConfig.password,
  });

  const channel = await connection.createChannel();
  await channel.assertExchange(exchange, "direct", { durable: false });

  // Publish the message to the exchange with the specified routing key
  channel.publish(exchange, routingKey, Buffer.from(message));

  // Close the connection
  await channel.close();
  await connection.close();
}
