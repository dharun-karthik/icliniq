import { describe, it, expect } from 'vitest';
import { Quantity } from './Quantity';
import { DomainValidationError } from '../../shared/errors/DomainError';

describe('Quantity', () => {
  describe('create', () => {
    it('should create Quantity with valid positive value', () => {
      const quantity = Quantity.create(5);

      expect(quantity).toBeDefined();
      expect(quantity.getValue()).toBe(5);
    });

    it('should create Quantity with minimum value (1)', () => {
      const quantity = Quantity.create(1);

      expect(quantity).toBeDefined();
      expect(quantity.getValue()).toBe(1);
    });

    it('should create Quantity with maximum value (999)', () => {
      const quantity = Quantity.create(999);

      expect(quantity).toBeDefined();
      expect(quantity.getValue()).toBe(999);
    });

    it('should create Quantity with mid-range value', () => {
      const quantity = Quantity.create(50);

      expect(quantity).toBeDefined();
      expect(quantity.getValue()).toBe(50);
    });

    it('should throw error when quantity is zero', () => {
      expect(() => Quantity.create(0)).toThrow(DomainValidationError);
      expect(() => Quantity.create(0)).toThrow('Quantity must be at least 1');
    });

    it('should throw error when quantity is negative', () => {
      expect(() => Quantity.create(-1)).toThrow(DomainValidationError);
      expect(() => Quantity.create(-1)).toThrow('Quantity must be at least 1');
    });

    it('should throw error when quantity is not an integer', () => {
      expect(() => Quantity.create(5.5)).toThrow(DomainValidationError);
      expect(() => Quantity.create(5.5)).toThrow('Quantity must be an integer');
    });

    it('should throw error when quantity is negative decimal', () => {
      expect(() => Quantity.create(-5.5)).toThrow(DomainValidationError);
      expect(() => Quantity.create(-5.5)).toThrow('Quantity must be an integer');
    });

    it('should throw error when quantity exceeds maximum (1000)', () => {
      expect(() => Quantity.create(1000)).toThrow(DomainValidationError);
      expect(() => Quantity.create(1000)).toThrow('Quantity cannot exceed 999');
    });

    it('should throw error when quantity is much larger than maximum', () => {
      expect(() => Quantity.create(10000)).toThrow(DomainValidationError);
      expect(() => Quantity.create(10000)).toThrow('Quantity cannot exceed 999');
    });
  });

  describe('getValue', () => {
    it('should return the correct value', () => {
      const quantity = Quantity.create(25);

      expect(quantity.getValue()).toBe(25);
    });

    it('should return minimum value correctly', () => {
      const quantity = Quantity.create(1);

      expect(quantity.getValue()).toBe(1);
    });

    it('should return maximum value correctly', () => {
      const quantity = Quantity.create(999);

      expect(quantity.getValue()).toBe(999);
    });
  });

  describe('equals', () => {
    it('should return true when quantities are equal', () => {
      const quantity1 = Quantity.create(10);
      const quantity2 = Quantity.create(10);

      expect(quantity1.equals(quantity2)).toBe(true);
    });

    it('should return false when quantities are different', () => {
      const quantity1 = Quantity.create(10);
      const quantity2 = Quantity.create(20);

      expect(quantity1.equals(quantity2)).toBe(false);
    });

    it('should return true when comparing same instance', () => {
      const quantity = Quantity.create(15);

      expect(quantity.equals(quantity)).toBe(true);
    });

    it('should return true when comparing minimum values', () => {
      const quantity1 = Quantity.create(1);
      const quantity2 = Quantity.create(1);

      expect(quantity1.equals(quantity2)).toBe(true);
    });

    it('should return true when comparing maximum values', () => {
      const quantity1 = Quantity.create(999);
      const quantity2 = Quantity.create(999);

      expect(quantity1.equals(quantity2)).toBe(true);
    });
  });

  describe('add', () => {
    it('should add positive amount to quantity', () => {
      const quantity = Quantity.create(5);
      const newQuantity = quantity.add(3);

      expect(newQuantity.getValue()).toBe(8);
      expect(quantity.getValue()).toBe(5); // Original should remain unchanged
    });

    it('should add zero to quantity', () => {
      const quantity = Quantity.create(10);
      const newQuantity = quantity.add(0);

      expect(newQuantity.getValue()).toBe(10);
    });

    it('should subtract by adding negative amount', () => {
      const quantity = Quantity.create(10);
      const newQuantity = quantity.add(-3);

      expect(newQuantity.getValue()).toBe(7);
    });

    it('should throw error when result is below minimum', () => {
      const quantity = Quantity.create(5);

      expect(() => quantity.add(-5)).toThrow(DomainValidationError);
      expect(() => quantity.add(-5)).toThrow('Quantity must be at least 1');
    });

    it('should throw error when result exceeds maximum', () => {
      const quantity = Quantity.create(990);

      expect(() => quantity.add(10)).toThrow(DomainValidationError);
      expect(() => quantity.add(10)).toThrow('Quantity cannot exceed 999');
    });
  });

  describe('toString', () => {
    it('should return the quantity value as string', () => {
      const quantity = Quantity.create(42);

      expect(quantity.toString()).toBe('42');
    });

    it('should return minimum value as string', () => {
      const quantity = Quantity.create(1);

      expect(quantity.toString()).toBe('1');
    });

    it('should return maximum value as string', () => {
      const quantity = Quantity.create(999);

      expect(quantity.toString()).toBe('999');
    });
  });
});

