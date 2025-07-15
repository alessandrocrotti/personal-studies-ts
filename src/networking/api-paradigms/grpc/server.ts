import * as grpc from "@grpc/grpc-js";
import { GreeterService, HelloReply, GreeterServer } from "./generated/unary";
import { UpdateMessage, UpdateServiceServer, UpdateServiceService } from "./generated/server-side-streaming";
import { LogEntry, LogServiceServer, LogServiceService, UploadSummary } from "./generated/client-side-streaming";
import { ChatMessage, ChatServiceServer, ChatServiceService } from "./generated/bidirectional-streaming";

// Implementazione del servizio
// Nel file generato c'è un'interfaccia GreeterServer che definisce i metodi del servizio
// Qui implementiamo il metodo SayHello con la logica desiderata
const greeterServiceImpl: GreeterServer = {
  sayHello: (call, callback) => {
    // Validazione del campo "name" nella richiesta
    // Se il campo non è presente o è vuoto, restituiamo un errore
    const name = call.request.name?.trim();
    if (!name) {
      return callback(
        {
          code: grpc.status.INVALID_ARGUMENT,
          message: "Il campo 'name' è obbligatorio",
        },
        null
      );
    }

    const reply: HelloReply = {
      message: `Ciao ${name}, benvenuto nel mondo gRPC! 👋`,
    };
    callback(null, reply);
  },
};

// Implementazione del servizio server streaming
const updateServiceImpl: UpdateServiceServer = {
  streamUpdates: (call) => {
    const topic = call.request.topic || "default";
    let count = 0;

    const interval = setInterval(() => {
      const update: UpdateMessage = {
        content: `Aggiornamento #${++count} per il topic "${topic}"`,
        timestamp: Date.now().toString(),
      };
      call.write(update);

      if (count >= 5) {
        clearInterval(interval);
        call.end();
      }
    }, 1000);
  },
};

// Implementazione del servizio client streaming
const logServiceImpl: LogServiceServer = {
  // Call è l'oggetto che rappresenta la connessione con il client e su cui possiamo leggere i dati inviati
  // Callback è la funzione che invierà la risposta al client una volta terminato lo stream
  uploadLogs: (call, callback) => {
    let total = 0;
    let errors = 0;

    call.on("data", (entry: LogEntry) => {
      total++;
      if (entry.level === "ERROR") errors++;
      console.log(`ClientStreaming - Server: [${entry.level}] ${entry.message}`);
    });

    call.on("end", () => {
      const summary: UploadSummary = {
        totalEntries: total,
        errors: errors,
      };
      callback(null, summary);
    });

    call.on("error", (err) => {
      console.error("ClientStreaming - Server: Errore nello stream:", err);
    });
  },
};

// Implementazione del servizio bidirectional streaming
const chatServiceImpl: ChatServiceServer = {
  // Call rappresenta la connessione con il client e permette di leggere i dati inviati e inviare risposte
  chat: (call) => {
    call.on("data", (msg: ChatMessage) => {
      console.log(`BidirectionalStreaming - Server: messaggio ricevuto da ${msg.user}: ${msg.message}`);
      const reply: ChatMessage = {
        user: "Server",
        message: `Ciao ${msg.user}, ho ricevuto: "${msg.message}"`,
        timestamp: Date.now().toString(),
      };
      call.write(reply);
    });

    call.on("end", () => {
      console.log("BidirectionalStreaming - Server: Stream terminato dal client");
      call.end();
    });

    call.on("error", (err) => {
      console.error("BidirectionalStreaming - Server: Errore nello stream:", err);
    });
  },
};

// Creazione e avvio del server
export async function startGRPCServer() {
  // Crea un'istanza del server gRPC per tutti i servizi definiti
  const server = new grpc.Server();
  // Aggiungi il servizio unary
  server.addService(GreeterService, greeterServiceImpl);
  // Aggiungi il servizio server streaming
  server.addService(UpdateServiceService, updateServiceImpl);
  // Aggiungi il servizio client streaming
  server.addService(LogServiceService, logServiceImpl);
  // Aggiungi il servizio bidirectional streaming
  server.addService(ChatServiceService, chatServiceImpl);
  // Avvia il server sulla porta 50051 per tutte le interfacce di rete in quanto è stato indicato "0.0.0.0". Corretto visto che si usa in locale. La porta 50051 è la porta standard per gRPC
  server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) throw err;
    console.log(`gRPC Server: in ascolto su ${port}`);
  });
}
