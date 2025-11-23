import { v4 as uuidv4 } from 'uuid';
import { DomainValidationError } from '../../shared/errors/DomainError';

export class ProductId {
  private constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new DomainValidationError('ProductId cannot be empty');
    }
    if (!/^[a-zA-Z0-9-]+$/.test(value)) {
      throw new DomainValidationError('ProductId cannot be empty');
    }
  }

  static create(id?: string): ProductId {
    if (id) {
      return new ProductId(id);
    }
    return new ProductId(uuidv4());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ProductId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

