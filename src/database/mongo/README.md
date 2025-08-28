# Mongo DB

Database NoSQL documentale gratuito

## Installazione

Si può installare tramite docker, sia col comando diretto che col docker-compose.

```shell
docker volume create personal-studies-mongo-data
docker run -d \
  --name personal-studies-mongo-8.0.13 \
  -p 27017:27017 \
  -v personal-studies-mongo-data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=example \
  mongo:8.0.13
```

Io preferisco il docker-compose perchè rimane il file e si può versionare e aggiornare:

```shell
cd src/database/mongo
docker-compose up -d
```

Nel caso fosse necessario cancellare sia il container che il relativo volume:

```shell
cd src/database/mongo
docker-compose down -v
```

## Descrizione

Tutorial `native-drive` basato sul [tutoria ufficiale](https://www.mongodb.com/resources/products/compatibilities/using-typescript-with-mongodb-tutorial) di MongoDB.

MongoDB sostanzialmente crea delle `collection` di `document` con un UUID. Quindi ogni volta che devi creare un nuovo `document` lo aggiungi alla relativa `collection` e questa è una transazione atomica.

### Transazioni

Attraverso un concetto di `session` si può creare anche una transazione che atomicizza le operazioni tra più `document` insieme. Questo è da usare con parsimonia, perchè rende più lenta le operazioni e va un po' contro la logica di base di un NoSQL, ma in certi contesti potrebbe essere utile. Come in SQL, quando si apre una transazione ogni operazione rimane sospesa fintanto che non si esegue il `commit`.

```typescript
const session = client.startSession();

try {
  session.startTransaction();

  const users = client.db("bank").collection("users");
  const logs = client.db("bank").collection("logs");

  await users.updateOne({ name: "Alessandro" }, { $inc: { balance: -100 } }, { session });

  await logs.insertOne({ user: "Alessandro", action: "withdrawal", amount: 100 }, { session });

  await session.commitTransaction();
  console.log("Transazione completata!");
} catch (error) {
  await session.abortTransaction();
  console.error("Transazione annullata:", error);
} finally {
  session.endSession();
}
```

### Index

Per migliorare la ricerca all'interno di una `collection`, vengono resi disponibili gli `index` che sono analoghi a quelli in SQL. A differenza di SQL però, qui abbiamo un JSON e non delle colonne, per cui ci sono tipi di indici diversi che possono fare riferimento a campi specifici, a combinazioni di campi e altri ancora.

Ovviamente gli indici hanno il vantaggio di rendere più rapide le ricerche fatte utilizzando certi criteri, ma rallentano l'inserimento di nuovi documenti e occupano spazio su disco. Per cui vanno minimizzate ai casi realmente necessari.

### Aggregation

MongoDB permette di fare query come fossero pipeline di un processo che fitra, raggruppa, ordina e applica operatori ai risultati ottenuti. Ci sono numerosissimi operatori possibili, qui un esempio per vedere "quanto hai speso per ogni prodotto dal più costoso":

```typescript
db.ordini.aggregate([
  // Step dove filtra gli ordini per il cliente "Alessandro", ritornando solo i suoi ordini
  { $match: { cliente: "Alessandro" } },
  // Step che raggruppa gli ordini per prodotto un nuovo documento con questa struttura
  {
    $group: {
      // Ogni nuovo document di questo risultato è basato sul valore del campo "prodotto" del document originale
      _id: "$prodotto",
      // Per tutti i prodotti uguali applico l'operazione $sum per sommare il valore nel campo "prezzo" del document originale
      totaleSpeso: { $sum: "$prezzo" },
      // Conta quante istanze di document originale sono state trovate per prodotto e somma 1, questo rappresenta il numero di ordini effettuati con questo prodotto
      ordiniEffettuati: { $sum: 1 },
    },
  },
  // Step di ordinamento per il valore del nuovo document nel campo "totaleSpeso" in ordine decrescente (usando -1)
  { $sort: { totaleSpeso: -1 } },
]);
```

### Lookup / Join

Tra le aggregation, c'è anche l'operator `$lookup` che è un analogo del LEFT OUTER JOIN in SQL.

```typescript
{
  $lookup: {
    from: "altraCollezione",
    localField: "campoLocale",
    foreignField: "campoEsterno",
    as: "risultatoJoin"
  }
}
```

- **from**: nome della collezione da cui vuoi prendere i dati
- **localField**: campo nella collezione corrente
- **foreignField**: campo nella collezione esterna
- **as**: nome del nuovo array che conterrà i documenti uniti

Con un esempio reale dove andiamo a popolare per ogni document "ordini" il campo "datiCliente" popolandolo con un **array** dei document `clienti` che soddisfano la condizione `ordini.clienteId = clienti._id`:

```typescript
db.ordini.aggregate([
  {
    $lookup: {
      from: "clienti",
      localField: "clienteId",
      foreignField: "_id",
      as: "datiCliente",
    },
  },
]);
```

Ovviamente anche questo da usare con parsimonia, perchè le relazioni in un database non relazionale non dovrebbero essere così tanto usate. Rallentano le performance, soprattutto se non si usano index, se il match del JOIN non è perfetto, risulterà un valore di array vuoto.

Se si vuole ritornare dentro il campo risultante "datiCliente" un oggetto singolo, utile quando si fa match con una chiave per cui sei certo restituisca 0 o 1 elemento, si può usare l'operator `$unwind`. Questo operatore crea un documento per ogni elemento dentro un array, quindi se l'array contiene solo un elemento, il risultato sarà comunque un solo documento.

Inoltre si può usare l'operator $project che permette di rimappare le chiavi del documento attuale in un nuovo documento, in modo da posizionare i campi in maniera più comoda e avere solo i campi necessari in output.

Qui un esempio completo:

```typescript
db.ordini.aggregate([
  // 🔗 JOIN tra ordini e clienti
  {
    $lookup: {
      from: "clienti", // collezione da unire
      localField: "clienteId", // campo in ordini
      foreignField: "_id", // campo in clienti
      as: "datiCliente", // nuovo campo array
    },
  },

  // 🔄 Trasforma l'array datiCliente in oggetto singolo
  {
    $unwind: {
      path: "$datiCliente",
      preserveNullAndEmptyArrays: true, // mantiene ordini senza cliente
    },
  },

  // 🧹 Seleziona e formatta i campi desiderati
  {
    $project: {
      _id: 0, // esclude l'ID dell'ordine
      prodotto: 1, // include il nome del prodotto
      prezzo: 1, // include il prezzo
      cliente: "$datiCliente.nome", // estrae il nome del cliente
      email: "$datiCliente.email", // estrae l'email
      tipoCliente: "$datiCliente.tipo", // estrae il tipo di cliente
    },
  },
]);
```

## Native Client VS Mongoose

Il suggerimento di MongoDB è di non usare la libreria `Mongoose` come Object Data Modeling perchè MongoDB gestisce i JSON Schema validation direttamente dal loro client ufficiale. [Qui](https://www.mongodb.com/developer/languages/javascript/mongoose-versus-nodejs-driver/) l'articolo a riguardo.
La ragione è che:

- Mongoose è un Object Data Modeling valido solamente per la tua applicazione nodeJS, non è trasversale a chiunque usi quel database di Mongo, quindi può creare complessità e disallineamente
- Inoltre la JSON Schema validation è valida solo per le Insert e Update e volendo si può anche mettere la validazione solo per le Insert, in questo modo le modifiche dello schema non intaccano i dati già esistenti
- Se si vuole si può bypassare la Document Validation sul singolo insert/update se fosse necessario, mentre con Mongoose non si può
- Questa flessibilità non c'è in Mongoose. Poi avendo un JSON Schema comune, ogni client può usarlo per creare le sua classi automaticamente.
