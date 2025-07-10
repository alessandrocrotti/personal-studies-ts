import { connect, ChannelModel } from "amqplib";

let connection: ChannelModel | null = null;

export async function getConnection(): Promise<ChannelModel> {
  if (!connection) {
    // Username and password are hardcoded, they are the same in docker-compose.yml
    connection = await connect("amqp://admin:password@localhost");
  }
  return connection;
}
