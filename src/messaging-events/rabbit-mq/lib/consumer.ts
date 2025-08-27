import { getConnection } from "./connection";

export async function consumeQueue(queue: string, onMessage: (msg: string) => void) {
  const connection = await getConnection();
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: false });

  console.log(`Consumer started for queue "${queue}"...`);

  channel.consume(
    queue,
    (msg) => {
      if (msg) {
        const content = msg.content.toString();
        console.log(`Received message: ${content}`);
        onMessage(content);
      }
    },
    { noAck: true }
  );
}

export async function consumeFanoutExchange(exchange: string, onMessage: (msg: string) => void) {
  const connection = await getConnection();
  const channel = await connection.createChannel();

  await channel.assertExchange(exchange, "fanout", { durable: false });
  const q = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(q.queue, exchange, "");

  console.log(`Consumer started for fanout exchange "${exchange}" (queue: ${q.queue})...`);

  channel.consume(
    q.queue,
    (msg) => {
      if (msg) {
        const content = msg.content.toString();
        console.log(`Received message from fanout exchange: ${content}`);
        onMessage(content);
      }
    },
    { noAck: true }
  );
}

export async function consumeTopicExchange(exchange: string, pattern: string, onMessage: (msg: string) => void) {
  const connection = await getConnection();
  const channel = await connection.createChannel();

  await channel.assertExchange(exchange, "topic", { durable: false });
  const q = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(q.queue, exchange, pattern);

  console.log(`Consumer started for topic exchange "${exchange}" with pattern "${pattern}" (queue: ${q.queue})...`);

  channel.consume(
    q.queue,
    (msg) => {
      if (msg) {
        const content = msg.content.toString();
        console.log(`Received message from topic exchange: ${content}`);
        onMessage(content);
      }
    },
    { noAck: true }
  );
}

export async function consumeHeadersExchange(exchange: string, bindingHeaders: Record<string, any>, onMessage: (msg: string) => void) {
  const connection = await getConnection();
  const channel = await connection.createChannel();

  await channel.assertExchange(exchange, "headers", { durable: false });
  const q = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(q.queue, exchange, "", bindingHeaders);

  console.log(`Consumer started for headers exchange "${exchange}" with binding headers ${JSON.stringify(bindingHeaders)} (queue: ${q.queue})...`);

  channel.consume(
    q.queue,
    (msg) => {
      if (msg) {
        const content = msg.content.toString();
        console.log(`Received message from headers exchange: ${content}`);
        onMessage(content);
      }
    },
    { noAck: true }
  );
}

export async function consumeRpcRequests(queue: string, onRequest: (msg: string) => Promise<string> | string) {
  const connection = await getConnection();
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: false });
  channel.consume(queue, async (msg) => {
    if (msg) {
      const content = msg.content.toString();
      const reply = await onRequest(content);
      channel.sendToQueue(msg.properties.replyTo, Buffer.from(reply), { correlationId: msg.properties.correlationId });
      channel.ack(msg);
      console.log(`RPC request processed: ${content} -> ${reply}`);
    }
  });
  console.log(`RPC server listening on queue "${queue}"...`);
}
