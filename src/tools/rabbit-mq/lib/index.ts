import { consumeQueue, consumeFanoutExchange, consumeTopicExchange, consumeHeadersExchange, consumeRpcRequests } from "./consumer";
import { sendToQueue, sendToFanoutExchange, sendToTopicExchange, sendToHeadersExchange, sendRpcRequest } from "./producer";

async function main() {
  // await simpleSendReceiveOnQueue();
  // await fanoutExample();
  // await topicExample();
  // await headersExample();
  // await rpcExample();
}

async function simpleSendReceiveOnQueue() {
  const queueName = "my-temporary-queue";
  await consumeQueue(queueName, (msg) => {
    console.log(`Message received: ${msg}`);
  });

  setTimeout(() => {
    sendToQueue(queueName, `Here my message: ${new Date().toISOString()}`);
  }, 1000);
}

async function fanoutExample() {
  const exchangeName = "my-fanout-exchange";

  // Start two consumers to show fanout behavior
  await consumeFanoutExchange(exchangeName, (msg) => {
    console.log(`[Consumer 1] Message received from fanout: ${msg}`);
  });
  await consumeFanoutExchange(exchangeName, (msg) => {
    console.log(`[Consumer 2] Message received from fanout: ${msg}`);
  });

  setTimeout(() => {
    sendToFanoutExchange(exchangeName, `Broadcast message: ${new Date().toISOString()}`);
  }, 1000);
}

async function topicExample() {
  const exchangeName = "my-topic-exchange";

  // Consumer 1: listens to all logs from 'app1'
  await consumeTopicExchange(exchangeName, "app1.*", (msg) => {
    console.log(`[Consumer 1] Received (app1.*): ${msg}`);
  });

  // Consumer 2: listens to all error logs from any app
  await consumeTopicExchange(exchangeName, "*.error", (msg) => {
    console.log(`[Consumer 2] Received (*.error): ${msg}`);
  });

  setTimeout(() => {
    sendToTopicExchange(exchangeName, "app1.info", "Info log from app1");
    sendToTopicExchange(exchangeName, "app1.error", "Error log from app1");
    sendToTopicExchange(exchangeName, "app2.error", "Error log from app2");
    sendToTopicExchange(exchangeName, "app2.info", "Info log from app2");
  }, 1000);
}

async function headersExample() {
  const exchangeName = "my-headers-exchange";

  // Consumer 1: matches type=error and format=json (all must match)
  await consumeHeadersExchange(exchangeName, { "type": "error", "format": "json", "x-match": "all" }, (msg) => {
    console.log(`[Consumer 1] Received (type=error, format=json, all): ${msg}`);
  });

  // Consumer 2: matches type=info or format=xml (any can match)
  await consumeHeadersExchange(exchangeName, { "type": "info", "format": "xml", "x-match": "any" }, (msg) => {
    console.log(`[Consumer 2] Received (type=info or format=xml, any): ${msg}`);
  });

  setTimeout(() => {
    sendToHeadersExchange(exchangeName, { type: "error", format: "json" }, "Error in JSON");
    sendToHeadersExchange(exchangeName, { type: "info", format: "xml" }, "Info in XML");
    sendToHeadersExchange(exchangeName, { type: "error", format: "xml" }, "Error in XML");
    sendToHeadersExchange(exchangeName, { type: "info", format: "json" }, "Info in JSON");
  }, 1000);
}

async function rpcExample() {
  const queueName = "rpc-queue";

  // Start the RPC server
  await consumeRpcRequests(queueName, async (msg) => {
    // Example: return the reversed string
    return msg.split("").reverse().join("");
  });

  // Give the server a moment to start because RabbitMQ is async internally. In real life, you should perform a health check on the server.
  setTimeout(async () => {
    const response = await sendRpcRequest(queueName, "Hello RPC!");
    console.log(`[RPC Client] Got response: ${response}`);
  }, 1000);
}

main().catch(console.error);
