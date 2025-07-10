import { Kafka } from "kafkajs";

// Client ID is used to identify the admin client in the Kafka cluster.
const kafka = new Kafka({ clientId: "admin-client", brokers: ["localhost:9092"] });
export const admin = kafka.admin();

/**
 * Create a new topic if it doesn't exist, otherwise do nothing. admin.createTopics() returns false if the topic already exists.
 * @param topic
 */
export async function createTopic(topic: string, numPartitions: number) {
  const created = await admin.createTopics({
    topics: [{ topic, numPartitions }],
    waitForLeaders: true,
  });
  if (created) {
    console.log("Topic creato");
  } else {
    console.log("Topic già esistente, riutilizzato");
  }
}
