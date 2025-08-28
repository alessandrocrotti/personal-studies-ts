// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Game from "../models/game";

// Global Config
export const gamesRouter = express.Router();

// Mongo usa BSON (Binary JSON-like) per salvare i dati e accetta quindi anche i JSON, quindi possiamo mettere il middleware per usare il JSON come body input (cioè le chiamate in ingresso come POST e PUT).
gamesRouter.use(express.json());

// GET
gamesRouter.get("/", async (_req: Request, res: Response) => {
  try {
    // Recupero tutti i "games" della collezione. Il primo paramatro di find() è il filtro ({} vuoto significa che non filtro nulla, quindi prendo tutti i documenti)
    const games = (await collections.games?.find({}).toArray()) as unknown as Game[];

    // Ritorna l'array di games al client con status 200 (OK)
    res.status(200).send(games);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

gamesRouter.get("/:id", async (req: Request, res: Response) => {
  // Prendo l'id dal route parameter della request
  const id = req?.params?.id;

  try {
    // Converto l'id in ObjectId (tipo usato da MongoDB) e lo uso per cercare il documento creando un filtro
    const query = { _id: new ObjectId(id) };
    // Cerco il documento con findOne() che ritorna il primo documento che matcha il filtro
    const game = (await collections.games?.findOne(query)) as unknown as Game;

    if (game) {
      res.status(200).send(game);
    }

    // Credo che se non trova il documento, findOne() vada nel catch ma devo testare meglio
  } catch (error) {
    res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
  }
});

// GET con aggregazione per unire i dati del documento Company
gamesRouter.get("/:id/with-company", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const pipeline = [
      {
        $match: { _id: new ObjectId(id) }, // filtro per ID del gioco
      },
      {
        $lookup: {
          from: "companies", // nome della collezione Company
          localField: "companyId", // campo nel documento Game
          foreignField: "_id", // campo nel documento Company
          as: "company", // nome del campo risultante
        },
      },
      {
        $unwind: {
          path: "$company", // trasforma l'array in oggetto singolo
          preserveNullAndEmptyArrays: true, // mantiene il documento anche se non c'è match
        },
      },
      {
        $project: {
          // Remove _id se non serve
          _id: 0,
          name: 1,
          price: 1,
          category: 1,
          companyId: 1,
          company: {
            // campi specifici da includere dall'oggetto company, escludo _id e headerquarters
            name: "$company.name",
            // headquarters: "$company.headquarters",
            logo: "$company.logo",
          },
        },
      },
    ];

    const result = await collections.games?.aggregate(pipeline).toArray();

    if (result && result.length > 0) {
      res.status(200).send(result[0]); // restituisci il primo (e unico) documento
    } else {
      res.status(404).send(`Game with id ${id} not found`);
    }
  } catch (error) {
    console.error("Error during aggregation:", error);
    res.status(500).send("Internal server error");
  }
});

// POST
gamesRouter.post("/", async (req: Request, res: Response) => {
  try {
    const {
      name,
      price,
      category,
      companyId,
    }: {
      name: string;
      price: number;
      category: string;
      companyId: string;
    } = req.body;

    // Verifica che companyId sia valido
    if (!ObjectId.isValid(companyId)) {
      return res.status(400).send("Invalid companyId format");
    }

    // Verifica che la company esista
    const companyExists = await collections.companies?.findOne({ _id: new ObjectId(companyId) });

    if (!companyExists) {
      return res.status(404).send("Company with given ID does not exist");
    }

    // Costruisci il nuovo documento con conversione corretta
    const newGame: Game = {
      name,
      price,
      category,
      companyId: new ObjectId(companyId),
    };

    // Inserisco il nuovo documento nella collezione, se non esiste la collection, questa viene creata. Se non esiste il db questo viene creato
    const result = await collections.games?.insertOne(newGame);

    result ? res.status(201).send(`Successfully created a new game with id ${result.insertedId}`) : res.status(500).send("Failed to create a new game.");
  } catch (error: any) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

// PUT
gamesRouter.put("/:id", async (req: Request, res: Response) => {
  // Prendo l'id dal route parameter della request
  const id = req?.params?.id;

  try {
    const {
      name,
      price,
      category,
      companyId,
    }: {
      name: string;
      price: number;
      category: string;
      companyId: string;
    } = req.body;

    // Validazione dell'ID del gioco
    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid game ID format");
    }

    // Validazione dell'ID della company
    if (!ObjectId.isValid(companyId)) {
      return res.status(400).send("Invalid companyId format");
    }

    // Verifica che la company esista
    const companyExists = await collections.companies?.findOne({ _id: new ObjectId(companyId) });
    if (!companyExists) {
      return res.status(404).send("Company with given ID does not exist");
    }

    // Costruzione del documento aggiornato
    const updatedGame: Game = {
      name,
      price,
      category,
      companyId: new ObjectId(companyId),
    };

    // Converto l'id in ObjectId (tipo usato da MongoDB) e lo uso per cercare il documento creando un filtro
    const query = { _id: new ObjectId(id) };
    // updateOne recupera l'oggetto e lo aggiorna grazie alla property $set che aggiorna e aggiunge i campi mancanti.
    // Come terzo parametro si possono mettere delle opzioni (es. upsert: true che crea il documento se non esiste)
    const result = await collections.games?.updateOne(query, { $set: updatedGame });

    // Se non viene fatto un update con successo si restituisce 304 (Not Modified)
    result ? res.status(200).send(`Successfully updated game with id ${id}`) : res.status(304).send(`Game with id: ${id} not updated`);
  } catch (error: any) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});

// DELETE
gamesRouter.delete("/:id", async (req: Request, res: Response) => {
  // Prendo l'id dal route parameter della request
  const id = req?.params?.id;

  try {
    // Converto l'id in ObjectId (tipo usato da MongoDB) e lo uso per cercare il documento creando un filtro
    const query = { _id: new ObjectId(id) };
    // Elimino il documento con deleteOne() che elimina il primo documento che matcha il filtro
    const result = await collections.games?.deleteOne(query);

    if (result && result.deletedCount) {
      // Response 202 (Accepted) indica che la richiesta è stata accettata per essere processata, ma il processo non è ancora completato. Questo perchè la cancellazione in MongoDB è asincrona.
      res.status(202).send(`Successfully removed game with id ${id}`);
    } else if (!result) {
      res.status(400).send(`Failed to remove game with id ${id}`);
    } else if (!result.deletedCount) {
      res.status(404).send(`Game with id ${id} does not exist`);
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});
