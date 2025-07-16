import * as grpc from "@grpc/grpc-js";
import { GreeterClient, HelloRequest } from "./generated/unary";
import { UpdateMessage, UpdateRequest, UpdateServiceClient } from "./generated/server-side-streaming";
import { LogEntry, LogServiceClient } from "./generated/client-side-streaming";
import { ChatMessage, ChatServiceClient } from "./generated/bidirectional-streaming";

// Crea istanza del client unary
const clientUnary = new GreeterClient("localhost:50051", grpc.credentials.createInsecure());

// Richiesta unary
const request: HelloRequest = { name: "Alessandro" };

// Crea istanza del client per server streaming
const clientServerStreaming = new UpdateServiceClient("localhost:50051", grpc.credentials.createInsecure());

// Crea istanza del client per client streaming
// Configura le opzioni del canale per il client streaming
// Queste opzioni sono utili per gestire il keep-alive e altre configurazioni.
// Sono opzionali ma possono migliorare le performance in scenari di lunga durata.
const options: grpc.ChannelOptions = {
  "grpc.keepalive_time_ms": 60000, // invia ping ogni 60s
  "grpc.keepalive_timeout_ms": 20000, // timeout per risposta al ping
  "grpc.keepalive_permit_without_calls": 1, // invia ping anche senza RPC attivi
};
const clientClientStreaming = new LogServiceClient("localhost:50051", grpc.credentials.createInsecure(), options);

// Crea istanza del client per bidirectional streaming
const clientBidirectionalStreaming = new ChatServiceClient("localhost:50051", grpc.credentials.createInsecure());

export async function runGRPCClient() {
  await unaryClientHandling();

  // serverStreamingClientHandling();

  // clientStreamingClientHandling();

  // bidirectionalStreamingClientHandling();
}

async function unaryClientHandling() {
  // Chiamata unary
  return new Promise((resolve, reject) =>
    clientUnary.sayHello(request, (err, response) => {
      if (err) {
        console.error("Unary - Client: Errore nella chiamata:", err);
        reject(err);
      } else {
        console.log("Unary - Client: Risposta del server:", response.message);
        resolve(response);
      }
    })
  );
}

/**
 * Gestisce la chiamata server streaming.
 * Questa funziona non richiede Promise perchè la connessione è aperta dal server quando invia lo stream. Il client si configura immediatamente tramite la creazione del client e la definizione degli eventi.
 */
function serverStreamingClientHandling() {
  // Chiamata server streaming
  const requestServerStreaming: UpdateRequest = { topic: "notizie" };
  const streamSeverStreaming = clientServerStreaming.streamUpdates(requestServerStreaming);

  streamSeverStreaming.on("data", (update: UpdateMessage) => {
    console.log("SeverStreaming - Client: Ricevuto aggiornamento:", update.content, "alle", new Date(parseInt(update.timestamp)));
  });

  streamSeverStreaming.on("end", () => {
    console.log("SeverStreaming - Client: Stream terminato dal server");
  });

  streamSeverStreaming.on("error", (err) => {
    console.error("SeverStreaming - Client: Errore nello stream:", err);
  });
}

function clientStreamingClientHandling() {
  // Chiamata client streaming
  const streamClientStreaming = clientClientStreaming.uploadLogs((err, summary) => {
    if (err) {
      console.error("ClientStreaming - Client: Errore nella risposta:", err);
    } else {
      console.log(`ClientStreaming - Client: Log inviati: ${summary.totalEntries}, errori: ${summary.errors}`);
    }
  });

  // Invia alcuni log di esempio
  const logs: LogEntry[] = [
    { level: "INFO", message: "Avvio sistema", timestamp: Date.now().toString() },
    { level: "ERROR", message: "Connessione fallita", timestamp: Date.now().toString() },
    { level: "INFO", message: "Retry connessione", timestamp: Date.now().toString() },
  ];

  logs.forEach((log) => streamClientStreaming.write(log));
  streamClientStreaming.end();
}

function bidirectionalStreamingClientHandling() {
  // Chiamata bidirectional streaming
  const streamBidirectionalStreaming = clientBidirectionalStreaming.chat();

  // Gestione degli eventi dello stream bidirezionale ricevuti dal server
  streamBidirectionalStreaming.on("data", (msg: ChatMessage) => {
    console.log(`BidirectionalStreaming - Client: messaggio ricevuto da ${msg.user}: ${msg.message}`);
  });

  streamBidirectionalStreaming.on("end", () => {
    console.log("BidirectionalStreaming - Client: Stream chiuso dal server");
  });

  streamBidirectionalStreaming.on("error", (err) => {
    console.error("BidirectionalStreaming - Client: Errore:", err);
  });

  // Invia alcuni messaggi di esempio
  const messages: ChatMessage[] = [
    { user: "Alessandro", message: "Ciao!", timestamp: Date.now().toString() },
    { user: "Alessandro", message: "Come va?", timestamp: Date.now().toString() },
    { user: "Alessandro", message: "Sto testando lo stream", timestamp: Date.now().toString() },
  ];
  messages.forEach((msg) => streamBidirectionalStreaming.write(msg));
  // Chiude lo stream dopo un breve intervallo per simulare una conversazione in modo da aspettare le risposte del server
  setTimeout(() => streamBidirectionalStreaming.end(), 1000);
}
