import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CartService } from './CartService';
import type { ICartRepository } from '../../domain/cart/repositories/ICartRepository';
import type { ProductService } from '../product/ProductService';
import { CartItem } from '../../domain/cart/entities/CartItem';
import type { AddItemToCartDTO, UpdateItemQuantityDTO } from './dto/CartDTOs';
import { EntityNotFoundError } from '../../domain/shared/errors/DomainError';

describe('CartService', () => {
  let cartService: CartService;
  let mockCartRepository: ICartRepository;
  let mockProductService: ProductService;

  beforeEach(() => {
    mockCartRepository = {
      save: vi.fn(),
      findAll: vi.fn(),
      findByProductId: vi.fn(),
      deleteByProductId: vi.fn(),
    };
    mockProductService = {
      getProduct: vi.fn(),
    } as any;
    cartService = new CartService(mockCartRepository, mockProductService);
  });

  describe('addItemToCart', () => {
    it('should add item to cart successfully', async () => {
      const mockProduct = {
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
      };

      vi.mocked(mockProductService.getProduct).mockResolvedValue(mockProduct);
      vi.mocked(mockCartRepository.findByProductId).mockResolvedValue(null);
      vi.mocked(mockCartRepository.save).mockResolvedValue(undefined);

      const dto: AddItemToCartDTO = {
        productId: 'product-123',
        quantity: 2,
      };

      const result = await cartService.addItemToCart(dto);

      expect(result).toBeDefined();
      expect(result.productId).toBe('product-123');
      expect(result.quantity).toBe(2);
    });

    it('should call repository save method', async () => {
      const mockProduct = {
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
      };

      vi.mocked(mockProductService.getProduct).mockResolvedValue(mockProduct);
      vi.mocked(mockCartRepository.findByProductId).mockResolvedValue(null);
      vi.mocked(mockCartRepository.save).mockResolvedValue(undefined);

      const dto: AddItemToCartDTO = {
        productId: 'product-123',
        quantity: 2,
      };

      await cartService.addItemToCart(dto);

      expect(mockCartRepository.save).toHaveBeenCalledOnce();
    });

    it('should throw error when product not found', async () => {
      vi.mocked(mockProductService.getProduct).mockResolvedValue(null as any);

      const dto: AddItemToCartDTO = {
        productId: 'non-existent-product',
        quantity: 2,
      };

      await expect(cartService.addItemToCart(dto)).rejects.toThrow('Product not found');
    });

    it('should throw error when not enough stock', async () => {
      const mockProduct = {
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 5,
      };

      vi.mocked(mockProductService.getProduct).mockResolvedValue(mockProduct);

      const dto: AddItemToCartDTO = {
        productId: 'product-123',
        quantity: 10,
      };

      await expect(cartService.addItemToCart(dto)).rejects.toThrow('Not enough stock');
    });

    it('should throw error when item already exists in cart', async () => {
      const mockProduct = {
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
      };

      const existingCartItem = CartItem.create('product-123', 2);

      vi.mocked(mockProductService.getProduct).mockResolvedValue(mockProduct);
      vi.mocked(mockCartRepository.findByProductId).mockResolvedValue(existingCartItem);

      const dto: AddItemToCartDTO = {
        productId: 'product-123',
        quantity: 3,
      };

      await expect(cartService.addItemToCart(dto)).rejects.toThrow('Item already exists in cart, try updating quantity');
    });
  });

  describe('updateItemQuantity', () => {
    it('should update item quantity successfully', async () => {
      const existingCartItem = CartItem.create('product-123', 2);
      const mockProduct = {
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
      };

      vi.mocked(mockCartRepository.findByProductId).mockResolvedValue(existingCartItem);
      vi.mocked(mockProductService.getProduct).mockResolvedValue(mockProduct);
      vi.mocked(mockCartRepository.save).mockResolvedValue(undefined);

      const dto: UpdateItemQuantityDTO = {
        productId: 'product-123',
        quantity: 5,
      };

      const result = await cartService.updateItemQuantity(dto);

      expect(result).toBeDefined();
      expect(result.productId).toBe('product-123');
      expect(result.quantity).toBe(5);
    });

    it('should call repository save method', async () => {
      const existingCartItem = CartItem.create('product-123', 2);
      const mockProduct = {
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
      };

      vi.mocked(mockCartRepository.findByProductId).mockResolvedValue(existingCartItem);
      vi.mocked(mockProductService.getProduct).mockResolvedValue(mockProduct);
      vi.mocked(mockCartRepository.save).mockResolvedValue(undefined);

      const dto: UpdateItemQuantityDTO = {
        productId: 'product-123',
        quantity: 5,
      };

      await cartService.updateItemQuantity(dto);

      expect(mockCartRepository.save).toHaveBeenCalledOnce();
    });

    it('should throw error when item not found in cart', async () => {
      vi.mocked(mockCartRepository.findByProductId).mockResolvedValue(null);

      const dto: UpdateItemQuantityDTO = {
        productId: 'non-existent-product',
        quantity: 5,
      };

      await expect(cartService.updateItemQuantity(dto)).rejects.toThrow('Item not found in cart');
    });

    it('should throw error when not enough stock', async () => {
      const existingCartItem = CartItem.create('product-123', 2);
      const mockProduct = {
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 3,
      };

      vi.mocked(mockCartRepository.findByProductId).mockResolvedValue(existingCartItem);
      vi.mocked(mockProductService.getProduct).mockResolvedValue(mockProduct);

      const dto: UpdateItemQuantityDTO = {
        productId: 'product-123',
        quantity: 10,
      };

      await expect(cartService.updateItemQuantity(dto)).rejects.toThrow('Not enough stock');
    });
  });

  describe('getAllCartItems', () => {
    it('should return empty array when no items in cart', async () => {
      vi.mocked(mockCartRepository.findAll).mockResolvedValue([]);

      const result = await cartService.getAllCartItems();

      expect(result).toEqual([]);
    });

    it('should return all cart items', async () => {
      const cartItems = [
        CartItem.create('product-1', 2),
        CartItem.create('product-2', 3),
        CartItem.create('product-3', 1),
      ];

      vi.mocked(mockCartRepository.findAll).mockResolvedValue(cartItems);

      const result = await cartService.getAllCartItems();

      expect(result).toHaveLength(3);
      expect(result[0].productId).toBe('product-1');
      expect(result[0].quantity).toBe(2);
      expect(result[1].productId).toBe('product-2');
      expect(result[1].quantity).toBe(3);
      expect(result[2].productId).toBe('product-3');
      expect(result[2].quantity).toBe(1);
    });

    it('should call repository findAll', async () => {
      vi.mocked(mockCartRepository.findAll).mockResolvedValue([]);

      await cartService.getAllCartItems();

      expect(mockCartRepository.findAll).toHaveBeenCalledOnce();
    });

    it('should return cart items with correct DTO structure', async () => {
      const cartItems = [
        CartItem.create('product-123', 5),
      ];

      vi.mocked(mockCartRepository.findAll).mockResolvedValue(cartItems);

      const result = await cartService.getAllCartItems();

      expect(result[0]).toHaveProperty('productId');
      expect(result[0]).toHaveProperty('quantity');
    });
  });

  describe('removeItemFromCart', () => {
    it('should remove item from cart successfully', async () => {
      const cartItem = CartItem.create('product-123', 2);
      vi.mocked(mockCartRepository.findByProductId).mockResolvedValue(cartItem);
      vi.mocked(mockCartRepository.deleteByProductId).mockResolvedValue(undefined);

      await cartService.removeItemFromCart('product-123');

      expect(mockCartRepository.deleteByProductId).toHaveBeenCalledOnce();
    });

    it('should call repository deleteByProductId with correct productId', async () => {
      const cartItem = CartItem.create('product-123', 2);
      vi.mocked(mockCartRepository.findByProductId).mockResolvedValue(cartItem);
      vi.mocked(mockCartRepository.deleteByProductId).mockResolvedValue(undefined);

      await cartService.removeItemFromCart('product-123');

      expect(mockCartRepository.deleteByProductId).toHaveBeenCalledWith('product-123');
    });

    it('should throw error when item not found in cart', async () => {
      vi.mocked(mockCartRepository.findByProductId).mockResolvedValue(null);

      await expect(cartService.removeItemFromCart('non-existent-product')).rejects.toThrow('Item not found in cart');
      expect(mockCartRepository.deleteByProductId).not.toHaveBeenCalled();
    });
  });
});

