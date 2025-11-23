import { DomainValidationError } from '../../shared/errors/DomainError';

export class ProductName {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 100;

  private constructor(private readonly value: string) {
    if (!value || value.trim().length < ProductName.MIN_LENGTH) {
      throw new DomainValidationError('Product name cannot be empty');
    }
    if (value.length > ProductName.MAX_LENGTH) {
      throw new DomainValidationError(`Product name cannot exceed ${ProductName.MAX_LENGTH} characters`);
    }
  }

  static create(value: string): ProductName {
    return new ProductName(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ProductName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

