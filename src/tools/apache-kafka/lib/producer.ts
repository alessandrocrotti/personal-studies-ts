import { Kafka } from "kafkajs";

// Client ID is used to identify the producer in the Kafka cluster.
const kafka = new Kafka({ clientId: "producer-client", brokers: ["localhost:9092"] });
export const producer = kafka.producer();

export async function sendMessage(topic: string, message: string, key?: string) {
  await producer.send({
    topic,
    messages: [{ value: message, key }],
  });
  console.log(`-> Producer on topic ${topic} with key ${key} sent message: ${message}`);
}
