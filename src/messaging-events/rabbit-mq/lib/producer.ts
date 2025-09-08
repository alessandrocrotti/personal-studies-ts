import { getConnection } from "./connection";
import { v4 as uuidv4 } from "uuid";

export async function sendToQueue(queue: string, message: string) {
  const connection = await getConnection();
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: false });
  channel.sendToQueue(queue, Buffer.from(message));

  console.log(`Message sent to "${queue}": ${message}`);
}

export async function sendToFanoutExchange(exchange: string, message: string) {
  const connection = await getConnection();
  const channel = await connection.createChannel();

  await channel.assertExchange(exchange, "fanout", { durable: false });
  channel.publish(exchange, "", Buffer.from(message));

  console.log(`Message sent to fanout exchange "${exchange}": ${message}`);
}

export async function sendToTopicExchange(exchange: string, routingKey: string, message: string) {
  const connection = await getConnection();
  const channel = await connection.createChannel();

  await channel.assertExchange(exchange, "topic", { durable: false });
  channel.publish(exchange, routingKey, Buffer.from(message));

  console.log(`Message sent to topic exchange "${exchange}" with routing key "${routingKey}": ${message}`);
}

export async function sendToHeadersExchange(exchange: string, headers: Record<string, any>, message: string) {
  const connection = await getConnection();
  const channel = await connection.createChannel();

  await channel.assertExchange(exchange, "headers", { durable: false });
  channel.publish(exchange, "", Buffer.from(message), { headers });

  console.log(`Message sent to headers exchange "${exchange}" with headers ${JSON.stringify(headers)}: ${message}`);
}

/**
 * Invia una richiesta RPC inviando un messaggio sulla coda principale e una coda replyTo temporanea su cui leggere il risultato.
 * @param requestQueue coda principale dove inviare la richiesta
 * @param message string del messaggio da inviare
 * @returns
 */
export async function sendRpcRequest(requestQueue: string, message: string): Promise<string> {
  const connection = await getConnection();
  const channel = await connection.createChannel();

  // Create a temporary exclusive queue for the reply
  const { queue: replyQueue } = await channel.assertQueue("", { exclusive: true });
  const correlationId = uuidv4();

  return new Promise((resolve) => {
    // Listen for messages on the reply queue
    channel.consume(
      replyQueue,
      (msg) => {
        // Check if the correlationId matches. This message is the result of our RPC request
        if (msg && msg.properties.correlationId === correlationId) {
          // Resolve let the caller going on when you have await. This means the deleteQueue will be completed asynchronously.
          resolve(msg.content.toString());
          channel.deleteQueue(replyQueue);
        }
      },
      { noAck: true }
    );

    channel.sendToQueue(requestQueue, Buffer.from(message), {
      correlationId,
      replyTo: replyQueue,
    });
    console.log(`RPC request sent: ${message} (correlationId: ${correlationId})`);
  });
}
