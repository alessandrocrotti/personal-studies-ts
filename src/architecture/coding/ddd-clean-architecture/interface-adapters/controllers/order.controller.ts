import { Request, Response } from "express";
import { CreateOrderUseCase } from "../../application/use-cases/create-order.usecase";
import { CreateOrderDto } from "../../application/dtos/create-order.dto";

export class OrderController {
  constructor(private readonly useCase: CreateOrderUseCase) {}

  async create(req: Request, res: Response) {
    const dto: CreateOrderDto = req.body;
    await this.useCase.execute(dto);
    res.status(201).json({ message: "Order created successfully" });
  }
}
