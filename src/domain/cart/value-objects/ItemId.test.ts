import { describe, it, expect } from 'vitest';
import { ItemId } from './ItemId';
import { DomainValidationError } from '../../shared/errors/DomainError';

describe('ItemId', () => {
  describe('create', () => {
    it('should create ItemId with provided id', () => {
      const id = ItemId.create('test-item-123');

      expect(id).toBeDefined();
      expect(id.getValue()).toBe('test-item-123');
    });

    it('should create ItemId with auto-generated UUID when no id provided', () => {
      const id = ItemId.create();

      expect(id).toBeDefined();
      expect(id.getValue()).toBeDefined();
      expect(id.getValue().length).toBeGreaterThan(0);
    });

    it('should generate unique ids when called multiple times without parameter', () => {
      const id1 = ItemId.create();
      const id2 = ItemId.create();

      expect(id1.getValue()).not.toBe(id2.getValue());
    });

    it('should create ItemId with auto-generated UUID when id is empty string', () => {
      const id = ItemId.create('');

      expect(id).toBeDefined();
      expect(id.getValue()).toBeDefined();
      expect(id.getValue()).not.toBe('');
      expect(id.getValue().length).toBeGreaterThan(0);
    });

    it('should throw error when id is whitespace only', () => {
      expect(() => ItemId.create('   ')).toThrow(DomainValidationError);
      expect(() => ItemId.create('   ')).toThrow('ProductId cannot be empty');
    });

    it('should throw error when id contains special characters', () => {
      expect(() => ItemId.create('$%^&*()')).toThrow(DomainValidationError);
      expect(() => ItemId.create('$%^&*()')).toThrow('ProductId cannot be empty');
    });

    it('should throw error when id contains spaces', () => {
      expect(() => ItemId.create('item id with spaces')).toThrow(DomainValidationError);
      expect(() => ItemId.create('item id with spaces')).toThrow('ProductId cannot be empty');
    });

    it('should throw error when id contains underscores', () => {
      expect(() => ItemId.create('item_id_with_underscores')).toThrow(DomainValidationError);
      expect(() => ItemId.create('item_id_with_underscores')).toThrow('ProductId cannot be empty');
    });
  });

  describe('getValue', () => {
    it('should return the correct value', () => {
      const id = ItemId.create('my-item-id');

      expect(id.getValue()).toBe('my-item-id');
    });

    it('should return the auto-generated UUID value', () => {
      const id = ItemId.create();
      const value = id.getValue();

      expect(value).toBeDefined();
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });
  });

  describe('equals', () => {
    it('should return true when ids are equal', () => {
      const id1 = ItemId.create('same-id');
      const id2 = ItemId.create('same-id');

      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false when ids are different', () => {
      const id1 = ItemId.create('id-1');
      const id2 = ItemId.create('id-2');

      expect(id1.equals(id2)).toBe(false);
    });

    it('should return false when comparing auto-generated ids', () => {
      const id1 = ItemId.create();
      const id2 = ItemId.create();

      expect(id1.equals(id2)).toBe(false);
    });

    it('should return true when comparing same instance', () => {
      const id = ItemId.create('test-id');

      expect(id.equals(id)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return the id value as string', () => {
      const id = ItemId.create('test-id');

      expect(id.toString()).toBe('test-id');
    });

    it('should return the auto-generated UUID as string', () => {
      const id = ItemId.create();
      const stringValue = id.toString();

      expect(stringValue).toBe(id.getValue());
      expect(typeof stringValue).toBe('string');
    });
  });
});

