import { runFastifyRestClient } from "./client";
import { startFastifyRestServer } from "./server";

async function startFastifyRestDemo() {
  await startFastifyRestServer();
  await runFastifyRestClient();
}

startFastifyRestDemo();
