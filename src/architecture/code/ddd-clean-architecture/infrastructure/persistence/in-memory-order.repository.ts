import { OrderRepository } from "../../application/interfaces/order-repository.interface";
import { Order } from "../../domain/entities/order.entity";

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Order[] = [];

  async save(order: Order): Promise<void> {
    this.orders.push(order);
    console.log("Order saved:", order);
  }
}
