import app from "./app";

/**
 * @openapi
 * /saluto:
 *   get:
 *     summary: Saluta l'utente
 *     responses:
 *       200:
 *         description: Messaggio di benvenuto
 */
app.get("/saluto", (req, res) => {
  res.json({ messaggio: "👋 Ciao Alessandro, benvenuto nel server REST!" });
});

/**
 * @openapi
 * /eco:
 *   post:
 *     summary: Ripete il testo inviato
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               testo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Testo ripetuto
 */
app.post("/eco", (req, res) => {
  const { testo } = req.body;
  res.json({ eco: `📣 Hai detto: ${testo}` });
});

export async function startRestServer() {
  return new Promise<void>((resolve) => {
    app.listen(4000, () => {
      console.log("Server REST: avviato su http://localhost:4000");
      resolve();
    });
  });
}
