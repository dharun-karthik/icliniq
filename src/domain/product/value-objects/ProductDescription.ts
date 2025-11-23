import { DomainValidationError } from '../../shared/errors/DomainError';

export class ProductDescription {
  private static readonly MAX_LENGTH = 2000;

  private constructor(private readonly value: string) {
    if (value.length > ProductDescription.MAX_LENGTH) {
      throw new DomainValidationError(`Product description cannot exceed ${ProductDescription.MAX_LENGTH} characters`);
    }
  }

  static create(value: string = ''): ProductDescription {
    return new ProductDescription(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ProductDescription): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

