export class Money {
  constructor(public readonly amount: number, public readonly currency: string) {}

  isPositive(): boolean {
    return this.amount > 0;
  }
}
