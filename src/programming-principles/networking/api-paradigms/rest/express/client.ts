export async function runRestClient() {
  try {
    // 🔍 Richiesta GET
    const getRes = await fetch("http://localhost:4000/saluto");
    const saluto = await getRes.json();
    console.log("Client REST: GET /saluto →", saluto.messaggio);

    // 📝 Richiesta POST
    const postRes = await fetch("http://localhost:4000/eco", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testo: "Questo è un test" }),
    });
    const risposta = await postRes.json();
    console.log("Client REST: POST /eco →", risposta.eco);
  } catch (err) {
    console.error("Client REST: Errore durante le richieste:", err);
  }
}
