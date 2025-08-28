import * as mongoDB from "mongodb";

// Aggiunta companies per mostrare come gestire più modelli/documenti
export const collections: { games?: mongoDB.Collection; companies?: mongoDB.Collection } = {};

export async function connectToDatabase() {
  // MongoDB URL è solitamente definito in un file .env per motivi di sicurezza, ma per semplicità lo definisco direttamente qui.
  const client: mongoDB.MongoClient = new mongoDB.MongoClient("mongodb://root:example@localhost:27017");

  await client.connect();

  // Il nome del database potrebbe essere anch'esso definito in un file .env. Per semplicità lo definisco direttamente qui.
  const db: mongoDB.Db = client.db("personal-studies-mongo-native-driver");

  const gameCollectionName = "games";
  const companyCollectionName = "companies";

  // Aggiungi uno schema di validazione (JSON Schema) per assicurarti che i documenti inseriti nella collezione "games" abbiano il formato corretto
  // (aggiunta companyId per mostrare la relazione con il documento Company)
  // IMPORTANTE: il command è stato inserito dopo che la collezione era già stata creata (la prima volta che si è lanciato il codice). Altrimenti sarebbe stato necessario creare la collezione prima dello schema di validazione.
  await db.command({
    // collection name
    collMod: gameCollectionName,
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "price", "category", "companyId"],
        additionalProperties: false,
        properties: {
          _id: {},
          name: {
            bsonType: "string",
            description: "'name' is required and is a string",
          },
          price: {
            bsonType: "number",
            description: "'price' is required and is a number",
          },
          category: {
            bsonType: "string",
            description: "'category' is required and is a string",
          },
          companyId: {
            bsonType: "objectId",
            description: "'companyId' is required and must be an ObjectId",
          },
        },
      },
    },
  });

  // Aggiunto lo schema anche per la collezione "companies".
  // IMPORTANTE: se la collezione non esiste, collMod fallisce. Quindi prima creo la collezione (se non esiste) e poi applico il validatore. Comunque si deve creare solo se non esiste
  const companyCollectionExisting = await db.listCollections({ name: companyCollectionName }).toArray();
  if (companyCollectionExisting.length === 0) {
    await db.createCollection(companyCollectionName);
  }
  await db.command({
    collMod: companyCollectionName,
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "headquarters"],
        additionalProperties: false,
        properties: {
          _id: {},
          name: {
            bsonType: "string",
            description: "'name' is required and is a string",
          },
          headquarters: {
            bsonType: "string",
            description: "'headquarters' is required and is a string",
          },
          logo: {
            bsonType: "string",
            description: "'logo' is optional and is a string",
          },
        },
      },
    },
  });

  // Definisco e creo (se non esiste) la collezione "games". Il nome della collezione potrebbe essere anch'esso definito in un file .env. Per semplicità lo definisco direttamente qui.
  const gamesCollection: mongoDB.Collection = db.collection(gameCollectionName);
  collections.games = gamesCollection;

  const companiesCollection: mongoDB.Collection = db.collection(companyCollectionName);
  collections.companies = companiesCollection;

  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${gamesCollection.collectionName}, ${companiesCollection.collectionName}`);
}
