import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Todo from "./models/Todo";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("✅ Connessione a MongoDB riuscita"))
  .catch((err) => console.error("❌ Errore connessione MongoDB:", err));

const app = express();
const PORT = 8000;

// Middleware
app.use(cors()); // Abilita CORS per tutte le origini
app.use(express.json());

type Todo = {
  _id: string;
  content: string;
};

// Inizializza un array di Todo (commentato perché ora usiamo MongoDB)
// let todos: Todo[] = [];

// Lista todos
app.get("/todos", async (_, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Aggiungi todo
app.post("/todos", async (req, res) => {
  const { content } = req.body;
  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Content obbligatorio" });
  }
  // const newTodo: Todo = { _id: randomUUID(), content };
  // todos.push(newTodo);
  const newTodo = await Todo.create({ content });
  res.status(201).json(newTodo);
});

// Elimina todo
app.delete("/todos/:_id", async (req, res) => {
  const { _id } = req.params;
  // const index = todos.findIndex((t) => t._id === id);
  // if (index === -1) {
  //   return res.status(404).json({ error: "Todo non trovato" });
  // }
  // todos.splice(index, 1);
  const deleted = await Todo.findByIdAndDelete(_id);
  if (!deleted) {
    return res.status(404).json({ error: "Todo non trovato" });
  }
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ API attiva su http://localhost:${PORT}`);
});
