import { DomainValidationError } from '../../shared/errors/DomainError';

export class Quantity {
  private static readonly MIN_QUANTITY = 1;
  private static readonly MAX_QUANTITY = 999;

  private constructor(private readonly value: number) {
    if (!Number.isInteger(value)) {
      throw new DomainValidationError('Quantity must be an integer');
    }
    if (value < Quantity.MIN_QUANTITY) {
      throw new DomainValidationError(`Quantity must be at least ${Quantity.MIN_QUANTITY}`);
    }
    if (value > Quantity.MAX_QUANTITY) {
      throw new DomainValidationError(`Quantity cannot exceed ${Quantity.MAX_QUANTITY}`);
    }
  }

  static create(value: number): Quantity {
    return new Quantity(value);
  }

  getValue(): number {
    return this.value;
  }

  equals(other: Quantity): boolean {
    return this.value === other.value;
  }

  add(amount: number): Quantity {
    return new Quantity(this.value + amount);
  }

  toString(): string {
    return this.value.toString();
  }
}

