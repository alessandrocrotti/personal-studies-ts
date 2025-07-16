import { runWebSocketClient, runWebSocketClientWithInterval, runWebSocketClientWithSubscription } from "./client";
import { startWebSocketServer, startWebSocketServerWithInterval, startWebSocketServerWithSubscription, SubscriptionType } from "./server";

async function startWebSocketDemo() {
  const wss = await startWebSocketServer();
  const wsc01 = await runWebSocketClient("01");
  const wsc02 = await runWebSocketClient("02");

  // setTimeout(() => {
  console.log(wss.clients.size, "client connessi al server");
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      console.log("WS - Server: Inviando messaggio a tutti i client connessi");
      client.send("Messaggio di prova dal server a tutti i client connessi");
    }
  });
  // }, 5000);

  // await startWebSocketServerWithInterval();
  // await runWebSocketClientWithInterval();

  // await startWebSocketServerWithSubscription();
  // await runWebSocketClientWithSubscription(new Set([SubscriptionType.CHAT, SubscriptionType.ALERT]));
  // await runWebSocketClientWithSubscription(new Set([SubscriptionType.NEWS]));
}

startWebSocketDemo();
