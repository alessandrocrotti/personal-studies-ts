# Exercises

Questa cartella serve al solo scopo di avere un ambiente dove creare dei piccoli esercizi, magari Leetcode, da eseguire rapidamente.

Se vuoi aggiungerne:

- Crea una nuova cartella
- Fai il file `index.ts` che eseguirà la funzione principale del tuo script
- Scrivi il tuo script in un file separato
- Aggiungi nel `package.json` il relativo script:
  - `"dev:my-exercise": "nodemon --exec ts-node src/exercises/my-exercise/index.ts",`
- Esegui il tuo script tramite:
  - `pnpm dev:my-exercise`

In questo modo puoi usare `nodemon` in watching, così che riesegua il codice ad ogni modifica.
