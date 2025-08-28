import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Company from "../models/company";

// Global Config
export const companiesRouter = express.Router();

// Mongo usa BSON (Binary JSON-like) per salvare i dati e accetta quindi anche i JSON, quindi possiamo mettere il middleware per usare il JSON come body input (cioè le chiamate in ingresso come POST e PUT).
companiesRouter.use(express.json());

// GET
companiesRouter.get("/", async (_req: Request, res: Response) => {
  try {
    // Recupero tutti i "companies" della collezione. Il primo paramatro di find() è il filtro ({} vuoto significa che non filtro nulla, quindi prendo tutti i documenti)
    const companies = (await collections.companies?.find({}).toArray()) as unknown as Company[];

    // Ritorna l'array di companies al client con status 200 (OK)
    res.status(200).send(companies);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

companiesRouter.get("/:id", async (req: Request, res: Response) => {
  // Prendo l'id dal route parameter della request
  const id = req?.params?.id;

  try {
    // Converto l'id in ObjectId (tipo usato da MongoDB) e lo uso per cercare il documento creando un filtro
    const query = { _id: new ObjectId(id) };
    // Cerco il documento con findOne() che ritorna il primo documento che matcha il filtro
    const company = (await collections.companies?.findOne(query)) as unknown as Company;

    if (company) {
      res.status(200).send(company);
    }

    // Credo che se non trova il documento, findOne() vada nel catch ma devo testare meglio
  } catch (error) {
    res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
  }
});

// POST
companiesRouter.post("/", async (req: Request, res: Response) => {
  try {
    // Prendo il body della request e lo casto come Company
    const newCompany = req.body as Company;
    // Inserisco il nuovo documento nella collezione, se non esiste la collection, questa viene creata. Se non esiste il db questo viene creato
    const result = await collections.companies?.insertOne(newCompany);

    result ? res.status(201).send(`Successfully created a new company with id ${result.insertedId}`) : res.status(500).send("Failed to create a new company.");
  } catch (error: any) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

// PUT
companiesRouter.put("/:id", async (req: Request, res: Response) => {
  // Prendo l'id dal route parameter della request
  const id = req?.params?.id;

  try {
    // Prendo il body della request e lo casto come Company
    const updatedCompany: Company = req.body as Company;
    // Converto l'id in ObjectId (tipo usato da MongoDB) e lo uso per cercare il documento creando un filtro
    const query = { _id: new ObjectId(id) };
    // updateOne recupera l'oggetto e lo aggiorna grazie alla property $set che aggiorna e aggiunge i campi mancanti.
    // Come terzo parametro si possono mettere delle opzioni (es. upsert: true che crea il documento se non esiste)
    const result = await collections.companies?.updateOne(query, { $set: updatedCompany });

    // Se non viene fatto un update con successo si restituisce 304 (Not Modified)
    result ? res.status(200).send(`Successfully updated company with id ${id}`) : res.status(304).send(`company with id: ${id} not updated`);
  } catch (error: any) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});

// DELETE
companiesRouter.delete("/:id", async (req: Request, res: Response) => {
  // Prendo l'id dal route parameter della request
  const id = req?.params?.id;

  try {
    // Converto l'id in ObjectId (tipo usato da MongoDB) e lo uso per cercare il documento creando un filtro
    const query = { _id: new ObjectId(id) };
    // Elimino il documento con deleteOne() che elimina il primo documento che matcha il filtro
    const result = await collections.companies?.deleteOne(query);

    if (result && result.deletedCount) {
      // Response 202 (Accepted) indica che la richiesta è stata accettata per essere processata, ma il processo non è ancora completato. Questo perchè la cancellazione in MongoDB è asincrona.
      res.status(202).send(`Successfully removed company with id ${id}`);
    } else if (!result) {
      res.status(400).send(`Failed to remove company with id ${id}`);
    } else if (!result.deletedCount) {
      res.status(404).send(`company with id ${id} does not exist`);
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});
