import { runGRPCClient } from "./client";
import { startGRPCServer } from "./server";

async function startGRPCDemo() {
  await startGRPCServer();
  await runGRPCClient();
}

startGRPCDemo();
