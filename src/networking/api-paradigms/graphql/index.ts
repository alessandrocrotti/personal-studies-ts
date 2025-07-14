import { runClient } from "./client";
import { startServer } from "./server";

async function startGraphQLDemo() {
  await startServer();
  await runClient();
}

startGraphQLDemo();
