import { OrderRepository } from "../interfaces/order-repository.interface";
import { CreateOrderDto } from "../dtos/create-order.dto";
import { Order } from "../../domain/entities/order.entity";

export class CreateOrderUseCase {
  constructor(private readonly orderRepo: OrderRepository) {}

  async execute(dto: CreateOrderDto): Promise<void> {
    const order = new Order(Date.now().toString(), dto.customerId, dto.total);
    await this.orderRepo.save(order);
  }
}
