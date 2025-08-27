import app from "./app";

app.get("/saluto", (req, res) => {
  res.json({ messaggio: "👋 Ciao Alessandro, benvenuto nel server REST!" });
});

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
