import { ObjectId } from "mongodb";

/**
 * Company model/document.
 * Aggiunta rispetto al tutorial per mostrare come gestire più modelli/documenti.
 *
 * Per ottenere il JSON Schema si può lanciare da questa cartella il comando:
 * npx ts-json-schema-generator --path "company.ts" --type "Company"
 *
 * Dal risultato, si prende la parte "properties", "required" e si incolla nel validatore della collezione in database.service.ts
 * Si aggiungono anche "bsonType: "object"" e "additionalProperties: false"
 */
export default class Company {
  constructor(public name: string, public headquarters: string, public logo?: string, public id?: ObjectId) {}
}
