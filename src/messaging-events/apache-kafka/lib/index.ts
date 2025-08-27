import { admin, createTopic } from "./admin";
import { producer, sendMessage } from "./producer";
import { startConsumer } from "./consumer";

const topicOnePartition = "personal-studies-topic-one-partition";
const topicTwoPartition = "personal-studies-topic-two-partition";
const groupId = "personal-studies-group";
const groupIdAlternative = "personal-studies-group-alternative";

async function main() {
  // create topics: handling the connection to the admin client here, otherwise it would be closed after the first createTopic call
  await admin.connect();
  await createTopic(topicOnePartition, 1);
  await createTopic(topicTwoPartition, 2);
  await admin.disconnect();
  // start consumers: on topicOnePartition we have two consumers on the different groups, on topicTwoPartition we have two consumers on same group
  // IMPORTANT: you can't use the same groupId for different topics, otherwise you will have a single consumer that would be to different topics and this causes a problem o Kafka consumer
  await startConsumer(topicOnePartition, groupId + "-one-partition", "consumer-one-partition-1");
  await startConsumer(topicOnePartition, groupIdAlternative + "-one-partition", "consumer-alternative-one-partition-1");
  await startConsumer(topicTwoPartition, groupId + "-two-partition", "consumer-two-partition-1");
  await startConsumer(topicTwoPartition, groupId + "-two-partition", "consumer-two-partition-2");

  // Attendi un po' prima di inviare i messaggi
  setTimeout(async () => {
    await producer.connect();
    // collect all messages and send them asynchronously since we don't need to sort them
    const messages = [
      // send message to topic with one partition
      sendMessage(topicOnePartition, `Message 01 on topic ${topicOnePartition} from producer at ${new Date().toISOString()}}`),
      sendMessage(topicOnePartition, `Message 02 on topic ${topicOnePartition} from producer at ${new Date().toISOString()}}`),
      sendMessage(topicOnePartition, `Message 03 on topic ${topicOnePartition} from producer at ${new Date().toISOString()}}`),
      sendMessage(topicOnePartition, `Message 04 on topic ${topicOnePartition} from producer at ${new Date().toISOString()}}`),
      sendMessage(topicOnePartition, `Message 05 on topic ${topicOnePartition} from producer at ${new Date().toISOString()}}`),
      sendMessage(topicOnePartition, `Message 06 on topic ${topicOnePartition} from producer at ${new Date().toISOString()}}`),
      sendMessage(topicOnePartition, `Message 07 on topic ${topicOnePartition} from producer at ${new Date().toISOString()}}`),
      sendMessage(topicOnePartition, `Message 08 on topic ${topicOnePartition} from producer at ${new Date().toISOString()}}`),
      sendMessage(topicOnePartition, `Message 09 on topic ${topicOnePartition} from producer at ${new Date().toISOString()}}`),
      sendMessage(topicOnePartition, `Message 10 on topic ${topicOnePartition} from producer at ${new Date().toISOString()}}`),
      // send message to topic with two partitions
      sendMessage(topicTwoPartition, `Message 01 on topic ${topicTwoPartition} from producer at ${new Date().toISOString()}}`),
      sendMessage(topicTwoPartition, `Message 02 on topic ${topicTwoPartition} from producer at ${new Date().toISOString()}}`),
      sendMessage(topicTwoPartition, `Message 03 on topic ${topicTwoPartition} from producer at ${new Date().toISOString()}}`),
      sendMessage(topicTwoPartition, `Message 04 on topic ${topicTwoPartition} from producer at ${new Date().toISOString()}}`),
      sendMessage(topicTwoPartition, `Message 05 on topic ${topicTwoPartition} from producer at ${new Date().toISOString()}}`),
      sendMessage(topicTwoPartition, `Message 06 on topic ${topicTwoPartition} from producer at ${new Date().toISOString()}}`),
      sendMessage(topicTwoPartition, `Message 07 on topic ${topicTwoPartition} from producer at ${new Date().toISOString()}}`),
      sendMessage(topicTwoPartition, `Message 08 on topic ${topicTwoPartition} from producer at ${new Date().toISOString()}}`),
      sendMessage(topicTwoPartition, `Message 09 on topic ${topicTwoPartition} from producer at ${new Date().toISOString()}}`),
      sendMessage(topicTwoPartition, `Message 10 on topic ${topicTwoPartition} from producer at ${new Date().toISOString()}}`),
    ];
    // send all messages and wait for all of them to be sent before disconnecting the producer
    await Promise.all(messages);

    // Send sync messages with the same key, they will be sent to the same partition and the consumer will receive them in order
    const key1 = "key-1";
    await sendMessage(topicTwoPartition, `Message 01 on topic ${topicTwoPartition} with key ${key1} from producer at ${new Date().toISOString()}}`, key1);
    await sendMessage(topicTwoPartition, `Message 02 on topic ${topicTwoPartition} with key ${key1} from producer at ${new Date().toISOString()}}`, key1);
    await sendMessage(topicTwoPartition, `Message 03 on topic ${topicTwoPartition} with key ${key1} from producer at ${new Date().toISOString()}}`, key1);
    await sendMessage(topicTwoPartition, `Message 04 on topic ${topicTwoPartition} with key ${key1} from producer at ${new Date().toISOString()}}`, key1);
    await sendMessage(topicTwoPartition, `Message 05 on topic ${topicTwoPartition} with key ${key1} from producer at ${new Date().toISOString()}}`, key1);

    const key2 = "key-2";
    await sendMessage(topicTwoPartition, `Message 01 on topic ${topicTwoPartition} with key ${key2} from producer at ${new Date().toISOString()}}`, key2);
    await sendMessage(topicTwoPartition, `Message 02 on topic ${topicTwoPartition} with key ${key2} from producer at ${new Date().toISOString()}}`, key2);
    await sendMessage(topicTwoPartition, `Message 03 on topic ${topicTwoPartition} with key ${key2} from producer at ${new Date().toISOString()}}`, key2);
    await sendMessage(topicTwoPartition, `Message 04 on topic ${topicTwoPartition} with key ${key2} from producer at ${new Date().toISOString()}}`, key2);
    await sendMessage(topicTwoPartition, `Message 05 on topic ${topicTwoPartition} with key ${key2} from producer at ${new Date().toISOString()}}`, key2);

    await producer.disconnect();
  }, 10000);
}

main().catch(console.error);
