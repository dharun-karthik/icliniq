import { describe, it, expect } from 'vitest';
import { ProductName } from './ProductName';

describe('ProductName', () => {
  describe('create', () => {
    it('should create ProductName with valid name', () => {
      const name = ProductName.create('Test Product');

      expect(name).toBeDefined();
      expect(name.getValue()).toBe('Test Product');
    });

    it('should trim whitespace from name', () => {
      const name = ProductName.create('  Product Name  ');

      expect(name.getValue()).toBe('Product Name');
    });

    it('should create ProductName with single character', () => {
      const name = ProductName.create('A');

      expect(name.getValue()).toBe('A');
    });

    it('should create ProductName with maximum length (100 characters)', () => {
      const longName = 'A'.repeat(100);
      const name = ProductName.create(longName);

      expect(name.getValue()).toBe(longName);
      expect(name.getValue().length).toBe(100);
    });

    it('should create ProductName with special characters', () => {
      const name = ProductName.create('Product-123 & Co.');

      expect(name.getValue()).toBe('Product-123 & Co.');
    });

    it('should throw error when name is empty string', () => {
      expect(() => ProductName.create('')).toThrow('Product name cannot be empty');
    });

    it('should throw error when name is only whitespace', () => {
      expect(() => ProductName.create('   ')).toThrow('Product name cannot be empty');
    });

    it('should throw error when name exceeds 100 characters', () => {
      const tooLongName = 'A'.repeat(101);

      expect(() => ProductName.create(tooLongName)).toThrow('Product name cannot exceed 100 characters');
    });

    it('should throw error when name is much longer than limit', () => {
      const tooLongName = 'A'.repeat(500);

      expect(() => ProductName.create(tooLongName)).toThrow('Product name cannot exceed 100 characters');
    });
  });

  describe('getValue', () => {
    it('should return the correct value', () => {
      const name = ProductName.create('My Product');

      expect(name.getValue()).toBe('My Product');
    });
  });

  describe('equals', () => {
    it('should return true when names are equal', () => {
      const name1 = ProductName.create('Product Name');
      const name2 = ProductName.create('Product Name');

      expect(name1.equals(name2)).toBe(true);
    });

    it('should return false when names are different', () => {
      const name1 = ProductName.create('Product A');
      const name2 = ProductName.create('Product B');

      expect(name1.equals(name2)).toBe(false);
    });

    it('should be case-sensitive', () => {
      const name1 = ProductName.create('Product');
      const name2 = ProductName.create('product');

      expect(name1.equals(name2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the name value as string', () => {
      const name = ProductName.create('Test Product');

      expect(name.toString()).toBe('Test Product');
    });

  });
});

