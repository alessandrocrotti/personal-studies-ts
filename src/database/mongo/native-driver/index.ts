import express from "express";
import { connectToDatabase } from "./services/database.service";
import { gamesRouter } from "./routes/games.router";
import { companiesRouter } from "./routes/companies.router";

const app = express();
const port = process.env.PORT || 3000;

connectToDatabase()
  .then(() => {
    app.use("/games", gamesRouter);
    app.use("/companies", companiesRouter);

    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
