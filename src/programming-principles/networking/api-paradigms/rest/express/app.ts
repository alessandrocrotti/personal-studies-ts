import express from "express";
import { swaggerUiMiddleware, swaggerUiSetup } from "./swagger";

const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUiMiddleware, swaggerUiSetup);

export default app;
