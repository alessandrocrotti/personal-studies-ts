import fastify from "./app";

export type bodySaluto = {
  testo: string;
};

fastify.get("/saluto", async () => {
  return { messaggio: "Ciao Alessandro, Fastify è attivo!" };
});

fastify.post("/eco", async (request, reply) => {
  const { testo } = request.body as bodySaluto;
  reply.send({ eco: `Hai detto: ${testo}` });
});

export async function startFastifyRestServer() {
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
