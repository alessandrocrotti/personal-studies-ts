import express from "express";
import { OrderController } from "./interface-adapters/controllers/order.controller";
import { CreateOrderUseCase } from "./application/use-cases/create-order.usecase";
import { InMemoryOrderRepository } from "./infrastructure/persistence/in-memory-order.repository";

const app = express();
app.use(express.json());

// Wiring dependencies manually
const orderRepo = new InMemoryOrderRepository();
const createOrderUseCase = new CreateOrderUseCase(orderRepo);
const orderController = new OrderController(createOrderUseCase);

// Route
app.post("/orders", (req, res) => orderController.create(req, res));

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
