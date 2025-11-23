import { DomainValidationError } from '../../shared/errors/DomainError';

export class Stock {
  private constructor(private readonly quantity: number) {
    if (quantity < 0) {
      throw new DomainValidationError('Stock quantity cannot be negative');
    }
    if (!Number.isInteger(quantity)) {
      throw new DomainValidationError('Stock quantity must be an integer');
    }
  }

  static create(quantity: number): Stock {
    return new Stock(quantity);
  }

  getQuantity(): number {
    return this.quantity;
  }

  equals(other: Stock): boolean {
    return this.quantity === other.quantity;
  }
}

