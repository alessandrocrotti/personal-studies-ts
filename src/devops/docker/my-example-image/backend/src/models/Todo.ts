import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const todoSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  content: { type: String, required: true },
});

export default mongoose.model("Todo", todoSchema);
