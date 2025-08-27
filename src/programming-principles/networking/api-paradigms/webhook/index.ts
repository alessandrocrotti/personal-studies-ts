import { sendCommentEvent } from "./sender";
import { startWebHookReceiver } from "./receiver";

async function startWebHookDemo() {
  await startWebHookReceiver();
  const interval = setInterval(() => {
    sendCommentEvent();
  }, 5000);

  setTimeout(() => {
    clearInterval(interval);
    console.log("WH Client: Intervallo di invio commenti fermato");
  }, 30000); // Ferma l'invio dopo 30 secondi
}

startWebHookDemo();
