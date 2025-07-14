# GraphQL

- [GraphQL](#graphql)

## Descrizione

Le GraphQL sono una struttura API che permette di chiamare un singolo endpoint e, tramite un body con delle query, richiedere dei dati al server. Le query permettono di chiedere al server esattamente i dati che servono, in modo da evitare un over-fetching o under-fetching.
Oltre che le query, si possono fare anche mutation che permettono di modificare i dati e subscription che permettono di ricevere in tempo reale degli aggiornamenti.

Si tratta di un paradigma centrato sul client e sulla possibilità che esso abbia il massimo controllo sui dati che deve ricevere.

## Struttura

Le GraphQL si strutturano in questo modo:

- **Schema**: definisce la mappa delle API con tipi, campi, relazioni e operazioni
- **Operazioni**:
  - **Query**: lettura dei dati richiesti dal client
  - **Mutation**: scrittura dei dati, come creazione, aggiornamento, cancellazione
- **Subscription**: canale per ricevere aggiornamenti in tempo reale, come le notifiche push
- **Types**: tipi di dato: oggetti, scalari, input, enum, interfacce, union
- **Resolvers**: funzioni che risolvono i campi richiesti nel body, collegando lo schema ai dati reali

## Server GraphQL

Normalmente un microservizio espone un singolo server GraphQL che gestisce le operazioni al suo interno. Nei vari linguaggi ci sono diversi tipi di server e client GraphQL che si possono usare. Uno di questo è Apollo Gateway, che permette di essere usato in node per Typescript.

### Apollo Federation

Oltre ai singoli server GraphQL esiste anche una versione di Apollo che si chiama Apollo Federation che fa da orchestrator per vari server GraphQL di vari microservizi. Questi in gergo vengono chiamati _subgraph_ e devono esportare in GraphQL compatibile con Federation.
Grazie a dei connector può anche orchestare servizi REST come se fossero GraphQL

Questo permette di avere un layer al di sopra di tutti i microservizi, con cui il client si interfaccia.

## Persisted Query

Sono un meccanismo per migliorare le performance e la sicurezza delle API. Sul server ogni query viene identificata da un hash univoco in modo che il client possa inviare solo l'hash e non tutta la query.

Flusso:

- Il client invia la prima volta la query completa e il relativo hash
- Il server memorizza la query con quell'hash
- Il cliente nei successivi invii manda solamente l'hash della query
- Se il server non riconosce l'hash della query, invia `PersistedQueryNotFound` e il client deve inviare nuovamente la query completa con l'hash

In produzione questo da diversi vantaggi:

- Performance migliori, per meno payload inviato
- Caching delle query via GET tramite CDN
  - Invece di inviare l'hash in POST come si fa normalmente con GraphQL, si può mandare l'hash ne querystring in modo che la CDN possa cachare la request. Questo vale per le query, non le mutation che rimangono via POST.
  - Importante essere consapevoli che anche le variable devono essere passate nel queryparams, essendoci un limite nella lunghezza è meglio utilizzare le GET con variable contenute e query semplici
- Sicurezza che solo le query pre-approvate vengono eseguite
  - Invece di ricevere automaticamente l'hash dal client, si può determinare manualmente la list di hash lato server come se fosse un whitelisting delle query approvate
- Stabilità sul come devono comunicare client e server

## Quickstart: Apollo GraphQL Server & Client

La configurazione è stata aggiunta anche a `src/index.ts` e può essere eseguita anche tramite `pnpm dev`

### 1. Avviare il server GraphQL

```bash
pnpm ts-node src/networking/api-paradigms/graphql/server.ts
```

Il server sarà disponibile su `http://localhost:4000/graphql`.

### 2. Testare il server con Postman

- Metodo: `POST`
- URL: `http://localhost:4000/graphql`
- Headers: `Content-Type: application/json`
- Body (raw):

```json
{
  "query": "{ hello }"
}
```

### 3. Eseguire il client GraphQL

Assicurati che il server sia in esecuzione, poi:

```bash
pnpm ts-node src/networking/api-paradigms/graphql/client.ts
```

Vedrai la risposta della query nel terminale del client.

---

Questa configurazione non richiede database e serve solo per testare la tecnologia GraphQL con Apollo.
