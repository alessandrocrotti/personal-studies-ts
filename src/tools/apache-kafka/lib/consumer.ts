import { Kafka } from "kafkajs";

const kafka = new Kafka({ clientId: "consumer-client", brokers: ["localhost:9092"] });

export async function startConsumer(topic: string, groupId: string, logId: string) {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  await consumer.subscribe({ topic });

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log(`<- Consumer ${logId} on topic ${topic} with group ${groupId} received at ${new Date().toISOString()}: ${message.value?.toString()}`);
      // Simula un'elaborazione di 1 secondo
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  });
  return consumer;
}
