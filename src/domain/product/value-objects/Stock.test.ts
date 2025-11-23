import { describe, it, expect } from 'vitest';
import { Stock } from './Stock';

describe('Stock', () => {
  describe('create', () => {
    it('should create Stock with valid positive quantity', () => {
      const stock = Stock.create(10);

      expect(stock).toBeDefined();
      expect(stock.getQuantity()).toBe(10);
    });

    it('should create Stock with zero quantity', () => {
      const stock = Stock.create(0);

      expect(stock).toBeDefined();
      expect(stock.getQuantity()).toBe(0);
    });

    it('should throw error when quantity is negative', () => {
      expect(() => Stock.create(-1)).toThrow('Stock quantity cannot be negative');
    });

    it('should throw error when quantity is not an integer', () => {
      expect(() => Stock.create(10.5)).toThrow('Stock quantity must be an integer');
    });

    it('should throw error when quantity is negative decimal', () => {
      expect(() => Stock.create(-5.5)).toThrow('Stock quantity cannot be negative');
    });
  });

  describe('getQuantity', () => {
    it('should return the correct quantity', () => {
      const stock = Stock.create(25);

      expect(stock.getQuantity()).toBe(25);
    });

  });

  describe('equals', () => {
    it('should return true when quantities are equal', () => {
      const stock1 = Stock.create(10);
      const stock2 = Stock.create(10);

      expect(stock1.equals(stock2)).toBe(true);
    });

    it('should return false when quantities are different', () => {
      const stock1 = Stock.create(10);
      const stock2 = Stock.create(20);

      expect(stock1.equals(stock2)).toBe(false);
    });

  });
});

