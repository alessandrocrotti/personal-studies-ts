import WebSocket from "ws";
import { SubscriptionType } from "./server";
import { randomUUID } from "crypto";

function startClientConnection(port: number): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://localhost:${port}`);

    ws.on("open", () => resolve(ws));
    ws.on("error", (err) => reject(err));
  });
}

export async function runWebSocketClient(id = "01") {
  const ws = await startClientConnection(5050);

  ws.on("open", () => {
    console.log(`WS - Client ${id}: Connesso al server`);
    ws.send("Ciao dal client!");
  });

  ws.on("message", (data) => {
    console.log(`WS - Client ${id}: Risposta dal server:`, data.toString());
  });

  ws.on("close", () => {
    console.log(`WS - Client ${id}: Connessione chiusa dal server`);
  });

  return ws;
}

export async function runWebSocketClientWithInterval() {
  const ws = await startClientConnection(5051);

  ws.on("open", () => {
    console.log("WS - ClientInterval: Connesso al server");
  });

  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.type === "notification") {
      console.log("WS - ClientInterval: Notifica ricevuta:", msg.payload.message);
    } else if (msg.type === "system") {
      console.log("WS - ClientInterval: Info:", msg.payload);
    }
  });

  ws.on("close", () => {
    console.log("WS - ClientInterval: Connessione chiusa dal server");
  });
  return ws;
}

export async function runWebSocketClientWithSubscription(subscription: Set<SubscriptionType>) {
  const id = randomUUID();
  console.log(`WS - ClientSubscription: Avvio client con ID ${id}`);
  const ws = await startClientConnection(5052);

  ws.on("open", () => {
    console.log(`WS - ClientSubscription ${id}: Connesso al server`);

    subscription.forEach((sub) => {
      ws.send(JSON.stringify({ type: "subscribe", payload: sub }));
    });
  });

  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());
    console.log(`WS - ClientSubscription ${id}: [${msg.type.toUpperCase()}]`, msg.payload);
  });

  ws.on("close", () => {
    console.log(`WS - ClientSubscription ${id}: Connessione chiusa`);
  });
}
