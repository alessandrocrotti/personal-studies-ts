import { bodySaluto } from "./server";

export async function runFastifyRestClient() {
  try {
    const salutoRes = await fetch("http://localhost:4000/saluto");
    const saluto = await salutoRes.json();
    console.log("Client REST: /saluto →", saluto.messaggio);

    const ecoRes = await fetch("http://localhost:4000/eco", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testo: "Test via Fastify" } satisfies bodySaluto),
    });
    const eco = await ecoRes.json();
    console.log("Client REST: /eco →", eco.eco);
  } catch (err) {
    console.error("Client REST: Errore durante richiesta:", err);
  }
}
