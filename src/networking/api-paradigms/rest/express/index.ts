import { runRestClient } from "./client";
import { startRestServer } from "./server";

async function startRestDemo() {
  await startRestServer();
  await runRestClient();
}

startRestDemo();
