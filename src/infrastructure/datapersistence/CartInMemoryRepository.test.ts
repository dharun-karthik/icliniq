import { describe, it, expect, beforeEach } from 'vitest';
import { CartInMemoryRepository } from './CartInMemoryRepository';
import { CartItem } from '../../domain/cart/entities/CartItem';

describe('CartInMemoryRepository', () => {
  let repository: CartInMemoryRepository;

  beforeEach(() => {
    repository = new CartInMemoryRepository();
  });

  describe('save', () => {
    it('should save a cart item successfully', async () => {
      const item = CartItem.create('product-1', 5);

      await repository.save(item);

      const found = await repository.findByProductId('product-1');

      expect(found).toBeDefined();
      expect(found?.toJSON()).toEqual({ productId: 'product-1', quantity: 5 });
    });

    it('should save multiple different cart items', async () => {
      const item1 = CartItem.create('product-1', 5);
      const item2 = CartItem.create('product-2', 10);
      const item3 = CartItem.create('product-3', 15);

      await repository.save(item1);
      await repository.save(item2);
      await repository.save(item3);

      const allItems = await repository.findAll();
      expect(allItems).toHaveLength(3);
    });
  });

  describe('findByProductId', () => {
    it('should return a cart item when it exists', async () => {
      const item = CartItem.create('product-1', 5);
      await repository.save(item);

      const found = await repository.findByProductId('product-1');

      expect(found).toBeDefined();
      expect(found?.toJSON().productId).toBe('product-1');
      expect(found?.toJSON().quantity).toBe(5);
    });

    it('should return null when cart item does not exist', async () => {
      const found = await repository.findByProductId('non-existent-id');

      expect(found).toBeNull();
    });

    it('should return the correct item when multiple items exist', async () => {
      const item1 = CartItem.create('product-1', 5);
      const item2 = CartItem.create('product-2', 10);
      const item3 = CartItem.create('product-3', 15);

      await repository.save(item1);
      await repository.save(item2);
      await repository.save(item3);

      const found = await repository.findByProductId('product-2');

      expect(found).toBeDefined();
      expect(found?.toJSON().productId).toBe('product-2');
      expect(found?.toJSON().quantity).toBe(10);
    });
  });

  describe('findAll', () => {
    it('should return empty array when no items exist', async () => {
      const items = await repository.findAll();

      expect(items).toEqual([]);
      expect(items).toHaveLength(0);
    });

    it('should return all saved cart items', async () => {
      const item1 = CartItem.create('product-1', 5);
      const item2 = CartItem.create('product-2', 10);
      const item3 = CartItem.create('product-3', 15);

      await repository.save(item1);
      await repository.save(item2);
      await repository.save(item3);

      const items = await repository.findAll();

      expect(items).toHaveLength(3);
      expect(items[0].toJSON().productId).toBe('product-1');
      expect(items[1].toJSON().productId).toBe('product-2');
      expect(items[2].toJSON().productId).toBe('product-3');
    });

    it('should return a single item when only one exists', async () => {
      const item = CartItem.create('product-1', 5);
      await repository.save(item);

      const items = await repository.findAll();

      expect(items).toHaveLength(1);
      expect(items[0].toJSON().productId).toBe('product-1');
    });

    it('should return actual CartItem instances', async () => {
      const item = CartItem.create('product-1', 5);
      await repository.save(item);

      const items = await repository.findAll();

      expect(items[0]).toBeInstanceOf(CartItem);
      expect(items[0].toJSON).toBeDefined();
      expect(typeof items[0].toJSON).toBe('function');
    });
  });

  describe('deleteByProductId', () => {
    it('should delete a cart item successfully', async () => {
      const item = CartItem.create('product-1', 5);
      await repository.save(item);

      await repository.deleteByProductId('product-1');

      const found = await repository.findByProductId('product-1');
      expect(found).toBeNull();
    });
  });
});

