import express from "express";

const app = express();
// Middleware per body JSON
app.use(express.json());

// 👮 Secret per autenticazione
const WEBHOOK_SECRET = "super-segreto";

// Middleware autenticazione tramite header
app.use((req, res, next) => {
  const token = req.headers["x-api-key"];
  if (token !== WEBHOOK_SECRET) {
    console.warn("WH Middleware: Accesso negato (token errato)");
    return res.status(403).send("Accesso negato");
  }
  next();
});

export default app;
