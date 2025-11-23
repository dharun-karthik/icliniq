import { describe, it, expect } from 'vitest';
import { Money } from './Money';

describe('Money', () => {
  describe('create', () => {
    it('should create Money with valid positive amount', () => {
      const money = Money.create(99.99);

      expect(money).toBeDefined();
      expect(money.getAmount()).toBe(99.99);
    });

    it('should create Money with zero amount', () => {
      const money = Money.create(0);

      expect(money).toBeDefined();
      expect(money.getAmount()).toBe(0);
    });

    it('should throw error when amount is negative', () => {
      expect(() => Money.create(-1)).toThrow('Money amount cannot be negative');
    });

    it('should throw error when amount is negative decimal', () => {
      expect(() => Money.create(-0.01)).toThrow('Money amount cannot be negative');
    });
  });

  describe('getAmount', () => {
    it('should return the correct amount', () => {
      const money = Money.create(50.75);

      expect(money.getAmount()).toBe(50.75);
    });
  });

  describe('equals', () => {
    it('should return true when amounts are equal', () => {
      const money1 = Money.create(99.99);
      const money2 = Money.create(99.99);

      expect(money1.equals(money2)).toBe(true);
    });

    it('should return false when amounts are different', () => {
      const money1 = Money.create(99.99);
      const money2 = Money.create(50.00);

      expect(money1.equals(money2)).toBe(false);
    });

  });
});

