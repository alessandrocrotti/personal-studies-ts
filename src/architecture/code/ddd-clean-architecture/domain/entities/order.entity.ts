export class Order {
  constructor(public readonly id: string, public readonly customerId: string, public total: number) {}

  applyDiscount(amount: number) {
    this.total -= amount;
  }
}
