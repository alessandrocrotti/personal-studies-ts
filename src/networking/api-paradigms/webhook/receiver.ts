import app from "./app";
import { z } from "zod";

// Validazione schema Zod
const EventSchema = z.object({
  type: z.string(),
  eventId: z.uuid(),
  payload: z.object({
    user: z.string(),
    message: z.string(),
    time: z.iso.datetime(),
  }),
});

// Store idempotenza (solo per demo: in RAM)
// Memorizza gli eventi ricevuti per evitare duplicati
const eventiRicevuti = new Set<string>();

app.post("/webhook", (req, res) => {
  const validazione = EventSchema.safeParse(req.body);

  // Validazione del payload
  if (!validazione.success) {
    console.warn("WH Server: Payload non valido:", validazione.error);
    return res.status(400).send("Payload non valido");
  }

  // Controllo eventi duplicati
  const evento = validazione.data;
  if (eventiRicevuti.has(evento.eventId)) {
    console.log("WH Server: Evento duplicato ignorato:", evento.eventId);
    return res.status(200).send("Evento già ricevuto");
  }
  eventiRicevuti.add(evento.eventId);

  console.log("WH Server: Webhook accettato");
  console.log("WH Server: Tipo:", evento.type);
  console.log("WH Server: Payload:", evento.payload);

  res.status(200).send("Evento ricevuto correttamente");
});

export function startWebHookReceiver() {
  return new Promise<void>((resolve, reject) => {
    try {
      app.listen(3000, () => {
        console.log("WH Server: 📡 Ascolto attivo su http://localhost:3000/webhook");
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}
