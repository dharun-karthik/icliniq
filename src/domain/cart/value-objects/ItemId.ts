import { DomainValidationError } from "../../shared/errors/DomainError";
import { v4 as uuidv4 } from 'uuid';

export class ItemId {
  private constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new DomainValidationError('ProductId cannot be empty');
    }
    if (!/^[a-zA-Z0-9-]+$/.test(value)) {
      throw new DomainValidationError('ProductId cannot be empty');
    }
  }

  static create(id?: string): ItemId {
    if (id) {
      return new ItemId(id);
    }
    return new ItemId(uuidv4());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ItemId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
