import { runGraphQLClient } from "./client";
import { startGraphQLServer } from "./server";

async function startGraphQLDemo() {
  await startGraphQLServer();
  await runGraphQLClient();
}

startGraphQLDemo();
