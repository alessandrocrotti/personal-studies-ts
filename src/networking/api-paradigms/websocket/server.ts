import { WebSocket, WebSocketServer } from "ws";

/**
 * Gestione dell'avvio di un server WebSocket tramite una Promise che si risolve quando il server è pronto.
 * @param port Porta su cui avviare il server WebSocket
 * @returns
 */
function startServer(port: number) {
  return new Promise<WebSocketServer>((resolve, reject) => {
    const wss = new WebSocketServer({ port });

    wss.on("listening", () => {
      console.log(`WebSocket Server: in ascolto su ws://localhost:${port}`);
      resolve(wss);
    });

    wss.on("error", (err) => {
      console.error("WebSocket Server: Errore:", err);
      reject(err);
    });
  });
}

export async function startWebSocketServer() {
  const wss = await startServer(5050);

  wss.on("connection", (ws) => {
    console.log("WS - Server: Client connesso");

    ws.on("message", (data) => {
      console.log("WS - Server: Messaggio ricevuto:", data.toString());

      ws.send(`Ciao client, ho ricevuto: ${data.toString()}`);
    });

    ws.on("close", () => {
      console.log("WS - Server:  Connessione chiusa");
    });

    ws.send("WS - Server: Connessione stabilita con il server");
  });

  console.log("WS - Server: WebSocket server attivo su ws://localhost:5050");

  return wss;
}

export async function startWebSocketServerWithInterval() {
  const wss = await startServer(5051);
  const clients = new Set<WebSocket>();

  wss.on("connection", (ws) => {
    console.log("WS - ServerInterval: Client connesso");
    clients.add(ws);

    ws.send(
      JSON.stringify({
        type: "system",
        payload: "Connessione stabilita",
      })
    );

    ws.on("close", () => {
      console.log("WS - ServerInterval: Connessione chiusa");
      clients.delete(ws);
    });
  });

  console.log("WS - ServerInterval: Inviando notifiche ai client connessi");
  const notification = {
    type: "notification",
    payload: {
      message: `Nuova notifica dal server alle ${new Date().toLocaleTimeString()}`,
    },
  };

  for (const client of clients) {
    if (client.readyState === 1) {
      client.send(JSON.stringify(notification));
    }
  }

  // Simula invio notifiche ogni 5 secondi
  setInterval(() => {
    const notification = {
      type: "notification",
      payload: {
        message: `Nuova notifica dal server alle ${new Date().toLocaleTimeString()}`,
      },
    };

    for (const client of clients) {
      if (client.readyState === 1) {
        client.send(JSON.stringify(notification));
      }
    }
  }, 5000);

  console.log("WS - ServerInterval: WebSocket server attivo su ws://localhost:5051");

  return wss;
}

export enum SubscriptionType {
  CHAT = "chat",
  NEWS = "news",
  ALERT = "alert",
}

export async function startWebSocketServerWithSubscription() {
  const wss = await startServer(5052);

  // Mappa: client => Set dei tipi di evento sottoscritti
  const subscriptions = new Map<WebSocket, Set<string>>();

  wss.on("connection", (ws) => {
    console.log("WS - ServerSubscription: Client connesso");
    subscriptions.set(ws, new Set<string>());

    ws.send(
      JSON.stringify({
        type: "system",
        payload: "Connesso. Manda {type: 'subscribe', payload: 'chat|news|alert'} per iscriverti!",
      })
    );

    ws.on("message", (data) => {
      console.log("WS - ServerSubscription: Messaggio ricevuto:", data.toString());
      const msg = JSON.parse(data.toString());

      // Gestione sottoscrizione
      if (msg.type === "subscribe") {
        subscriptions.get(ws)?.add(msg.payload);
        ws.send(
          JSON.stringify({
            type: "system",
            payload: `Sottoscritto a: ${msg.payload}`,
          })
        );
      }
    });

    ws.on("close", () => {
      subscriptions.delete(ws);
    });
  });

  // Invio periodico di eventi simulati
  setInterval(() => {
    console.log("WS - ServerSubscription: Inviando eventi ai client sottoscritti");
    const events = [
      { type: SubscriptionType.CHAT, payload: "CHAT: Messaggio dalla chat" },
      { type: SubscriptionType.NEWS, payload: "NEWS: Ultime notizie" },
      { type: SubscriptionType.ALERT, payload: "ALERT: Allerta sistema" },
    ];

    for (const [client, subscribedTypes] of subscriptions.entries()) {
      if (client.readyState !== 1) continue;

      for (const event of events) {
        if (subscribedTypes.has(event.type)) {
          client.send(JSON.stringify(event));
        }
      }
    }
  }, 5000);
}
