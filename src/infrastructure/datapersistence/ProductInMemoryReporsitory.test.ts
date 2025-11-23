import { describe, it, expect, beforeEach } from 'vitest';
import { ProductInMemoryReporsitory } from './ProductInMemoryReporsitory';
import { Product } from '../../domain/product/entities/Product';
import { ProductId } from '../../domain/product/value-objects/ProductId';

describe('InMemoryProductRepository', () => {
  let repository: ProductInMemoryReporsitory;

  beforeEach(() => {
    repository = new ProductInMemoryReporsitory();
  });

  describe('save', () => {
    it('should save a product successfully', async () => {
      const product = Product.create('Test Product', 'Test Description', 99.99, 10);

      await repository.save(product);

      const productJson = product.toJSON();
      const found = await repository.findById(ProductId.create(productJson.id));

      expect(found).toBeDefined();
      expect(found?.toJSON()).toEqual(productJson);
    });

    it('should save multiple different products', async () => {
      const product1 = Product.create('Product 1', 'Description 1', 10.99, 5);
      const product2 = Product.create('Product 2', 'Description 2', 20.99, 10);
      const product3 = Product.create('Product 3', 'Description 3', 30.99, 15);

      await repository.save(product1);
      await repository.save(product2);
      await repository.save(product3);

      const allProducts = await repository.findAll();
      expect(allProducts).toHaveLength(3);
    });
  });

  describe('findById', () => {
    it('should return a product when it exists', async () => {
      const product = Product.create('Test Product', 'Test Description', 99.99, 10);
      await repository.save(product);

      const productJson = product.toJSON();
      const found = await repository.findById(ProductId.create(productJson.id));

      expect(found).toBeDefined();
      expect(found?.toJSON().id).toBe(productJson.id);
      expect(found?.toJSON().name).toBe('Test Product');
      expect(found?.toJSON().description).toBe('Test Description');
      expect(found?.toJSON().price).toBe(99.99);
      expect(found?.toJSON().stock).toBe(10);
    });

    it('should return null when product does not exist', async () => {
      const nonExistentId = ProductId.create('non-existent-id');

      const found = await repository.findById(nonExistentId);

      expect(found).toBeNull();
    });

    it('should return the correct product when multiple products exist', async () => {
      const product1 = Product.create('Product 1', 'Description 1', 10.99, 5);
      const product2 = Product.create('Product 2', 'Description 2', 20.99, 10);
      const product3 = Product.create('Product 3', 'Description 3', 30.99, 15);

      await repository.save(product1);
      await repository.save(product2);
      await repository.save(product3);

      const product2Json = product2.toJSON();
      const found = await repository.findById(ProductId.create(product2Json.id));

      expect(found).toBeDefined();
      expect(found?.toJSON().name).toBe('Product 2');
      expect(found?.toJSON().price).toBe(20.99);
    });
  });

  describe('findAll', () => {
    it('should return empty array when no products exist', async () => {
      const products = await repository.findAll();

      expect(products).toEqual([]);
      expect(products).toHaveLength(0);
    });

    it('should return all saved products', async () => {
      const product1 = Product.create('Product 1', 'Description 1', 10.99, 5);
      const product2 = Product.create('Product 2', 'Description 2', 20.99, 10);
      const product3 = Product.create('Product 3', 'Description 3', 30.99, 15);

      await repository.save(product1);
      await repository.save(product2);
      await repository.save(product3);

      const products = await repository.findAll();

      expect(products).toHaveLength(3);
      expect(products[0].toJSON().name).toBe('Product 1');
      expect(products[1].toJSON().name).toBe('Product 2');
      expect(products[2].toJSON().name).toBe('Product 3');
    });

    it('should return a single product when only one exists', async () => {
      const product = Product.create('Single Product', 'Single Description', 99.99, 10);
      await repository.save(product);

      const products = await repository.findAll();

      expect(products).toHaveLength(1);
      expect(products[0].toJSON().name).toBe('Single Product');
    });

    it('should return actual Product instances', async () => {
      const product = Product.create('Test Product', 'Test Description', 99.99, 10);
      await repository.save(product);

      const products = await repository.findAll();

      expect(products[0]).toBeInstanceOf(Product);
      expect(products[0].toJSON).toBeDefined();
      expect(typeof products[0].toJSON).toBe('function');
    });
  });
});

