import fastify, { setupSwagger } from "./app";

export type bodySaluto = {
  testo: string;
};

async function setupServer() {
  await setupSwagger();

  // API with Swagger documentation
  fastify.get(
    "/saluto",
    {
      schema: {
        description: "Saluta l’utente",
        tags: ["Saluti"],
        response: {
          200: {
            description: "Messaggio di benvenuto",
            type: "object",
            properties: {
              messaggio: { type: "string" },
            },
          },
        },
      },
    },
    async () => {
      return { messaggio: "Ciao Alessandro, Fastify è attivo!" };
    }
  );

  fastify.post(
    "/eco",
    {
      schema: {
        description: "Ripete il testo inviato",
        tags: ["Eco"],
        body: {
          type: "object",
          required: ["testo"],
          properties: {
            testo: { type: "string" },
          },
        },
        response: {
          200: {
            description: "Testo ripetuto",
            type: "object",
            properties: {
              eco: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { testo } = request.body as bodySaluto;
      reply.send({ eco: `Hai detto: ${testo}` });
    }
  );
}

export async function startFastifyRestServer() {
  await setupServer();
  return new Promise<void>((resolve, reject) => {
    fastify.listen({ port: 4000 }, (err, address) => {
      if (err) {
        console.error("Server REST: Errore nell'avvio del server Fastify:", err);
        reject(err);
      }
      console.log(`Server REST: attivo su ${address}`);
      resolve();
    });
  });
}
