import { DomainValidationError } from '../../shared/errors/DomainError';

export class Money {
  private constructor(
    private readonly amount: number,
  ) {
    if (amount < 0) {
      throw new DomainValidationError('Money amount cannot be negative');
    }
  }

  static create(amount: number): Money {
    return new Money(amount);
  }

  getAmount(): number {
    return this.amount;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount;
  }

}

