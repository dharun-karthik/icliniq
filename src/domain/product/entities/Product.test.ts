import { describe, it, expect } from 'vitest';
import { Product } from './Product';

describe('Product', () => {
  describe('create', () => {
    it('should create a product with valid data', () => {
      const product = Product.create(
        'Test Product',
        'Test Description',
        99.99,
        10
      );

      expect(product).toBeDefined();
      expect(product.toJSON().name).toBe('Test Product');
      expect(product.toJSON().description).toBe('Test Description');
      expect(product.toJSON().price).toBe(99.99);
      expect(product.toJSON().stock).toBe(10);
    });

    it('should create a product with empty description', () => {
      const product = Product.create(
        'Test Product',
        '',
        99.99,
        10
      );

      expect(product).toBeDefined();
      expect(product.toJSON().description).toBe('');
    });

    it('should create a product with zero price', () => {
      const product = Product.create(
        'Test Product',
        'Test Description',
        0,
        10
      );

      expect(product).toBeDefined();
      expect(product.toJSON().price).toBe(0);
    });

    it('should create a product with zero stock', () => {
      const product = Product.create(
        'Test Product',
        'Test Description',
        99.99,
        0
      );

      expect(product).toBeDefined();
      expect(product.toJSON().stock).toBe(0);
    });

    it('should trim whitespace from product name', () => {
      const product = Product.create(
        '  Test Product  ',
        'Test Description',
        99.99,
        10
      );

      expect(product.toJSON().name).toBe('Test Product');
    });

    it('should trim whitespace from product description', () => {
      const product = Product.create(
        'Test Product',
        '  Test Description  ',
        99.99,
        10
      );

      expect(product.toJSON().description).toBe('Test Description');
    });

    it('should generate a unique ID for each product', () => {
      const product1 = Product.create('Product 1', 'Description 1', 10, 5);
      const product2 = Product.create('Product 2', 'Description 2', 20, 10);

      expect(product1.toJSON().id).toBeDefined();
      expect(product2.toJSON().id).toBeDefined();
      expect(product1.toJSON().id).not.toBe(product2.toJSON().id);
    });

    it('should throw error when product name is empty', () => {
      expect(() => {
        Product.create('', 'Test Description', 99.99, 10);
      }).toThrow('Product name cannot be empty');
    });

    it('should throw error when product name is only whitespace', () => {
      expect(() => {
        Product.create('   ', 'Test Description', 99.99, 10);
      }).toThrow('Product name cannot be empty');
    });

    it('should throw error when product name exceeds max length', () => {
      const longName = 'a'.repeat(101);
      expect(() => {
        Product.create(longName, 'Test Description', 99.99, 10);
      }).toThrow('Product name cannot exceed 100 characters');
    });

    it('should throw error when description exceeds max length', () => {
      const longDescription = 'a'.repeat(2001);
      expect(() => {
        Product.create('Test Product', longDescription, 99.99, 10);
      }).toThrow('Product description cannot exceed 2000 characters');
    });

    it('should throw error when price is negative', () => {
      expect(() => {
        Product.create('Test Product', 'Test Description', -10, 10);
      }).toThrow('Money amount cannot be negative');
    });

    it('should throw error when stock is negative', () => {
      expect(() => {
        Product.create('Test Product', 'Test Description', 99.99, -5);
      }).toThrow('Stock quantity cannot be negative');
    });

    it('should throw error when stock is not an integer', () => {
      expect(() => {
        Product.create('Test Product', 'Test Description', 99.99, 5.5);
      }).toThrow('Stock quantity must be an integer');
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON representation', () => {
      const product = Product.create(
        'Test Product ',
        ' Test Description',
        99.99,
        10
      );

      const json = product.toJSON();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('name', 'Test Product');
      expect(json).toHaveProperty('description', 'Test Description');
      expect(json).toHaveProperty('price', 99.99);
      expect(json).toHaveProperty('stock', 10);
    });
  });
});

