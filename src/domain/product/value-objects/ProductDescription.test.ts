import { describe, it, expect } from 'vitest';
import { ProductDescription } from './ProductDescription';

describe('ProductDescription', () => {
  describe('create', () => {
    it('should create ProductDescription with valid description', () => {
      const description = ProductDescription.create('This is a test product description');

      expect(description).toBeDefined();
      expect(description.getValue()).toBe('This is a test product description');
    });

    it('should create ProductDescription with empty string when no value provided', () => {
      const description = ProductDescription.create();

      expect(description).toBeDefined();
      expect(description.getValue()).toBe('');
    });

    it('should create ProductDescription with empty string', () => {
      const description = ProductDescription.create('');

      expect(description.getValue()).toBe('');
    });

    it('should trim whitespace from description', () => {
      const description = ProductDescription.create('  Description with spaces  ');

      expect(description.getValue()).toBe('Description with spaces');
    });

    it('should create ProductDescription with maximum length (2000 characters)', () => {
      const longDescription = 'A'.repeat(2000);
      const description = ProductDescription.create(longDescription);

      expect(description.getValue()).toBe(longDescription);
      expect(description.getValue().length).toBe(2000);
    });

    it('should create ProductDescription with multiline text', () => {
      const multiline = 'Line 1\nLine 2\nLine 3';
      const description = ProductDescription.create(multiline);

      expect(description.getValue()).toBe(multiline);
    });

    it('should throw error when description exceeds 2000 characters', () => {
      const tooLongDescription = 'A'.repeat(2001);

      expect(() => ProductDescription.create(tooLongDescription)).toThrow('Product description cannot exceed 2000 characters');
    });

  });

  describe('getValue', () => {
    it('should return the correct value', () => {
      const description = ProductDescription.create('My description');

      expect(description.getValue()).toBe('My description');
    });
  });

  describe('equals', () => {
    it('should return true when descriptions are equal', () => {
      const desc1 = ProductDescription.create('Same description');
      const desc2 = ProductDescription.create('Same description');

      expect(desc1.equals(desc2)).toBe(true);
    });

    it('should return false when descriptions are different', () => {
      const desc1 = ProductDescription.create('Description A');
      const desc2 = ProductDescription.create('Description B');

      expect(desc1.equals(desc2)).toBe(false);
    });

    it('should be case-sensitive', () => {
      const desc1 = ProductDescription.create('Description');
      const desc2 = ProductDescription.create('description');

      expect(desc1.equals(desc2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the description value as string', () => {
      const description = ProductDescription.create('Test description');

      expect(description.toString()).toBe('Test description');
    });
  });
});

