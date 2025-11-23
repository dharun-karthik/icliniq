import { describe, it, expect } from 'vitest';
import { ProductId } from './ProductId';

describe('ProductId', () => {
  describe('create', () => {
    it('should create ProductId with provided id', () => {
      const id = ProductId.create('test-id-123');

      expect(id).toBeDefined();
      expect(id.getValue()).toBe('test-id-123');
    });

    it('should create ProductId with auto-generated UUID when no id provided', () => {
      const id = ProductId.create();

      expect(id).toBeDefined();
      expect(id.getValue()).toBeDefined();
      expect(id.getValue().length).toBeGreaterThan(0);
    });

    it('should generate unique ids when called multiple times without parameter', () => {
      const id1 = ProductId.create();
      const id2 = ProductId.create();

      expect(id1.getValue()).not.toBe(id2.getValue());
    });

    it('should create ProductId with auto-generated UUID when id is empty string', () => {
      const id = ProductId.create('');

      expect(id).toBeDefined();
      expect(id.getValue()).toBeDefined();
      expect(id.getValue()).not.toBe('');
      expect(id.getValue().length).toBeGreaterThan(0);
    });

    it('should throw error when id is not alphanumberic and hyphens', () => {
      expect(() => ProductId.create('$%^&*()')).toThrow('ProductId cannot be empty');
    });

  });

  describe('getValue', () => {
    it('should return the correct value', () => {
      const id = ProductId.create('my-product-id');

      expect(id.getValue()).toBe('my-product-id');
    });
  });

  describe('equals', () => {
    it('should return true when ids are equal', () => {
      const id1 = ProductId.create('same-id');
      const id2 = ProductId.create('same-id');

      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false when ids are different', () => {
      const id1 = ProductId.create('id-1');
      const id2 = ProductId.create('id-2');

      expect(id1.equals(id2)).toBe(false);
    });

  });

  describe('toString', () => {
    it('should return the id value as string', () => {
      const id = ProductId.create('test-id');

      expect(id.toString()).toBe('test-id');
    });
  });
});

