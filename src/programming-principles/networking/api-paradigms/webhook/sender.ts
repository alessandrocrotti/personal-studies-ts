import { v4 as uuid } from "uuid";

export async function sendCommentEvent() {
  const event = {
    type: "comment",
    eventId: uuid(),
    payload: {
      user: "Alessandro",
      message: "Test avanzato con sicurezza",
      time: new Date().toISOString(),
    },
  };

  try {
    const res = await fetch("http://localhost:3000/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "super-segreto", // token di accesso
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const data = await res.text();
    console.log("WH Client: Webhook inviato:", data);
  } catch (err) {
    console.error("WH Client: Errore:", err);
  }
}
