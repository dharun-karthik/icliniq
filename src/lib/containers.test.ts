import { describe, it, expect } from 'vitest';
import { getProductService, getProductRepository } from './containers';

describe('containers', () => {
  describe('getProductRepository', () => {
    it('should return a ProductInMemoryReporsitory instance', () => {
      const repository = getProductRepository();

      expect(repository).toBeDefined();
      expect(repository.constructor.name).toBe('ProductInMemoryReporsitory');
    });

    it('should return the same instance on multiple calls (singleton)', () => {
      const repository1 = getProductRepository();
      const repository2 = getProductRepository();

      expect(repository1).toBe(repository2);
    });

  });

  describe('getProductService', () => {
    it('should return a ProductService instance', () => {
      const service = getProductService();

      expect(service).toBeDefined();
      expect(service.constructor.name).toBe('ProductService');
    });

    it('should return the same instance on multiple calls (singleton)', () => {
      const service1 = getProductService();
      const service2 = getProductService();

      expect(service1).toBe(service2);
    });

  });
  
});

