import { createClient } from "redis";
import express from "express";

const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`Server attivo su http://localhost:${port}`);
});

// Connessione al client locale. Non servono parametri di connessione perchè quelli di default sono "localhost:6379" senza password
const redis = createClient();

redis.on("error", (err) => console.error("Redis Client Error", err));

async function run() {
  await redis.connect();

  // Test hard-coded per mettere e recuperare una chiave "nome"
  await redis.set("nome", "Alessandro");
  const value = await redis.get("nome");
  console.log("Valore da Redis:", value);

  counterApp();
  cacheResponse();
}

run();

/**
 * Counter app che espone un url per incrementare un contatore su redis e un url per recuperare il valore per quel contatore
 */
async function counterApp() {
  // Ogni volta che vai sull'url di un contatore questo si incrementa su redis
  app.get("/count/:counter", async (req, res) => {
    const counter = req.params.counter;
    await redis.incr(`contatore:${counter}`);
    res.send(`Incremento registrato per ${counter}`);
  });

  // Ogni volta che richiedi il valore di un contatore, viene recuperato da redis
  app.get("/countervalue/:counter", async (req, res) => {
    const counter = req.params.counter;
    const count = await redis.get(`contatore:${counter}`);
    res.send(`Il counter ${counter} ha valore ${count || 0}`);
  });
}

/**
 * Caching app che cacha la risposta per 5 min nella modalità cache-aside (dove l'applicazione gestisce manualmente l'inserimento, la lettura e l'eventuale rimozione delle chiavi).
 * Recupera la lista dei posts, il singolo post e cancella un post.
 * IMPORTANTE: la cancellazione risponde come se fosse stata effettuata, ma non modifica realmente le risorse, quindi i post non vengono realmente cancellati
 */
async function cacheResponse() {
  app.get("/posts", async (req, res) => {
    const cacheKey = `posts:all`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return res.json({
          from: "cache",
          result: JSON.parse(cached),
        });
      }

      const response = await fetch(`https://jsonplaceholder.typicode.com/posts`);
      const data = await response.json();

      if (!data) {
        return res.status(404).send("Posts non trovati");
      }

      // Con le versioni avanzate di Redis (come enterprise o redis-stack) puoi anche definire i tipi complessi.
      // In questo caso gli avresti passato una stringa che potevi indicare come se fosse di tipo JSON
      await redis.set(cacheKey, JSON.stringify(data), { EX: 300 }); // cache per 5 minuti

      res.json({
        from: "live",
        result: data,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Errore nella richiesta");
    }
  });

  app.get("/posts/:id", async (req, res) => {
    const id = req.params.id;
    const cacheKey = `posts:${id}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return res.send(`Post ${id} (cache): ${cached}`);
      }

      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
      const data = await response.json();

      if (!data || !data.id) {
        return res.status(404).send("Post non trovato");
      }

      const risultato = `Titolo: ${data.title}\nContenuto: ${data.body}`;
      await redis.set(cacheKey, risultato, { EX: 300 }); // cache per 5 minuti

      res.send(`Post ${id} (live): ${risultato}`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Errore nella richiesta");
    }
  });

  app.delete("/posts/:id", async (req, res) => {
    const id = req.params.id;
    const cacheKey = `posts:${id}`;
    const cacheKeyAll = `posts:all`;

    try {
      // Invalida la key di tutti i post e del post cancellato

      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        return res.status(502).send("Post non cancellato");
      }
      const cached = await redis.del([cacheKey, cacheKeyAll]);

      res.send(`Post ${id} cancellato`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Errore nella richiesta");
    }
  });
}
