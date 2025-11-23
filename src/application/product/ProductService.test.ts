import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductService } from './ProductService';
import type { IProductRepository } from '../../domain/product/repositories/IProductRepository';
import { Product } from '../../domain/product/entities/Product';
import type { CreateProductDTO } from './dto/ProductDTOs';

describe('ProductService', () => {
  let productService: ProductService;
  let mockRepository: IProductRepository;

  beforeEach(() => {
    mockRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
    };
    productService = new ProductService(mockRepository);
  });

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      vi.mocked(mockRepository.save).mockResolvedValue(undefined);

      const dto: CreateProductDTO = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
      };

      const result = await productService.createProduct(dto);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe('Test Product');
      expect(result.description).toBe('Test Description');
      expect(result.price).toBe(99.99);
      expect(result.stock).toBe(10);
    });

    it('should call repository save method', async () => {
      vi.mocked(mockRepository.save).mockResolvedValue(undefined);

      const dto: CreateProductDTO = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
      };

      await productService.createProduct(dto);

      expect(mockRepository.save).toHaveBeenCalledOnce();
    });



  });

  describe('getProduct', () => {
    it('should return a product when it exists', async () => {
      const product = Product.create('Test Product', 'Test Description', 99.99, 10);

      vi.mocked(mockRepository.findById).mockResolvedValue(product);

      const result = await productService.getProduct('test-id-123');

      expect(result).toBeDefined();
      expect(result.name).toBe('Test Product');
      expect(result.description).toBe('Test Description');
      expect(result.price).toBe(99.99);
      expect(result.stock).toBe(10);
    });

    it('should call repository findById with correct ProductId', async () => {
      const product = Product.create('Test Product', 'Test Description', 99.99, 10);

      vi.mocked(mockRepository.findById).mockResolvedValue(product);

      await productService.getProduct('test-id-123');

      expect(mockRepository.findById).toHaveBeenCalledOnce();
      const callArg = vi.mocked(mockRepository.findById).mock.calls[0][0];
      expect(callArg.getValue()).toBe('test-id-123');
    });

    it('should throw error when product does not exist', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      await expect(productService.getProduct('non-existent-id')).rejects.toThrow('Product not found');
    });
  });

  describe('getAllProducts', () => {
    it('should return empty array when no products exist', async () => {
      vi.mocked(mockRepository.findAll).mockResolvedValue([]);

      const result = await productService.getAllProducts();

      expect(result).toEqual([]);
    });

    it('should return all products', async () => {
      const products = [
        Product.create('Product 1', 'Description 1', 10.99, 5),
        Product.create('Product 2', 'Description 2', 20.99, 10),
        Product.create('Product 3', 'Description 3', 30.99, 15),
      ];

      vi.mocked(mockRepository.findAll).mockResolvedValue(products);

      const result = await productService.getAllProducts();

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('Product 1');
      expect(result[1].name).toBe('Product 2');
      expect(result[2].name).toBe('Product 3');
    });

    it('should call repository findAll', async () => {
      vi.mocked(mockRepository.findAll).mockResolvedValue([]);

      await productService.getAllProducts();

      expect(mockRepository.findAll).toHaveBeenCalledOnce();
    });

    it('should return products with correct DTO structure', async () => {
      const products = [
        Product.create('Test Product', 'Test Description', 99.99, 10),
      ];

      vi.mocked(mockRepository.findAll).mockResolvedValue(products);

      const result = await productService.getAllProducts();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('price');
      expect(result[0]).toHaveProperty('stock');
    });
  });
});

