import { Order } from "../../domain/entities/order.entity";

export interface OrderRepository {
  save(order: Order): Promise<void>;
}
