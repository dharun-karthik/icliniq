import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { APIContext } from 'astro';
import { POST as addItemToCart, PATCH as updateItemQuantity } from '../../pages/api/cart/index';
import { GET as getAllCartItems } from '../../pages/api/cart/all';
import { DELETE as removeItemFromCart } from '../../pages/api/cart/[productId]';
import { CartInMemoryRepository } from '../../infrastructure/datapersistence/CartInMemoryRepository';
import { CartService } from '../../application/cart/CartService';
import { ProductService } from '../../application/product/ProductService';
import { ProductInMemoryReporsitory } from '../../infrastructure/datapersistence/ProductInMemoryReporsitory';
import { Product } from '../../domain/product/entities/Product';

let testCartRepository: CartInMemoryRepository;
let testCartService: CartService;
let testProductRepository: ProductInMemoryReporsitory;
let testProductService: ProductService;

vi.mock('../../lib/containers', () => ({
  getCartRepository: () => testCartRepository,
  getCartService: () => testCartService,
  getProductRepository: () => testProductRepository,
  getProductService: () => testProductService,
}));

describe('Cart API Integration Tests', () => {
  let mockContext: APIContext;

  beforeEach(async () => {
    testCartRepository = new CartInMemoryRepository();
    testProductRepository = new ProductInMemoryReporsitory();
    testProductService = new ProductService(testProductRepository);
    testCartService = new CartService(testCartRepository, testProductService);

    // Add some test products
    const product1 = Product.create('Test Product 1', 'Description 1', 99.99, 100);
    const product2 = Product.create('Test Product 2', 'Description 2', 49.99, 50);
    await testProductRepository.save(product1);
    await testProductRepository.save(product2);

    mockContext = {
      request: new Request('http://localhost/api/cart'),
      params: {},
      url: new URL('http://localhost/api/cart'),
    } as APIContext;
  });

  describe('POST /api/cart - Add Item to Cart', () => {
    it('should add item to cart with valid data', async () => {
      // Get the product ID from the test products
      const products = await testProductRepository.findAll();
      const productId = products[0].toJSON().id;

      mockContext.request = new Request('http://localhost/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId,
          quantity: 2,
        }),
      });

      const response = await addItemToCart(mockContext);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('productId');
      expect(body.data.productId).toBe(productId);
      expect(body.data.quantity).toBe(2);
    });

    it('should add another item to existing cart', async () => {
      const products = await testProductRepository.findAll();
      const productId1 = products[0].toJSON().id;
      const productId2 = products[1].toJSON().id;

      const firstRequest = new Request('http://localhost/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId1,
          quantity: 2,
        }),
      });
      mockContext.request = firstRequest;
      await addItemToCart(mockContext);

      const secondRequest = new Request('http://localhost/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId2,
          quantity: 3,
        }),
      });
      mockContext.request = secondRequest;
      const secondResponse = await addItemToCart(mockContext);
      const secondBody = await secondResponse.json();

      expect(secondResponse.status).toBe(201);
      expect(secondBody.data.productId).toBe(productId2);
      expect(secondBody.data.quantity).toBe(3);
    });

    it('should throw error when adding same product to cart', async () => {
      const products = await testProductRepository.findAll();
      const productId = products[0].toJSON().id;

      const firstRequest = new Request('http://localhost/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId,
          quantity: 2,
        }),
      });
      mockContext.request = firstRequest;
      await addItemToCart(mockContext);

      const secondRequest = new Request('http://localhost/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId,
          quantity: 3,
        }),
      });
      mockContext.request = secondRequest;
      const secondResponse = await addItemToCart(mockContext);
      const secondBody = await secondResponse.json();

      expect(secondResponse.status).toBe(500);
      expect(secondBody.success).toBe(false);
      expect(secondBody.error.message).toBe('Internal server error');
    });

    it('should return 400 when productId is missing', async () => {
      mockContext.request = new Request('http://localhost/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: 2,
        }),
      });

      const response = await addItemToCart(mockContext);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
    });

    it('should return 400 when quantity is missing', async () => {
      mockContext.request = new Request('http://localhost/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'product-123',
        }),
      });

      const response = await addItemToCart(mockContext);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
    });

    it('should return 400 when quantity is zero', async () => {
      mockContext.request = new Request('http://localhost/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'product-123',
          quantity: 0,
        }),
      });

      const response = await addItemToCart(mockContext);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
    });

    it('should return 400 when quantity is negative', async () => {
      mockContext.request = new Request('http://localhost/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'product-123',
          quantity: -1,
        }),
      });

      const response = await addItemToCart(mockContext);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
    });
  });

  describe('GET /api/cart/all - View All Cart Items', () => {
    it('should return cart with items', async () => {
      const products = await testProductRepository.findAll();
      const productId = products[0].toJSON().id;

      const addRequest = new Request('http://localhost/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId,
          quantity: 2,
        }),
      });
      mockContext.request = addRequest;
      await addItemToCart(mockContext);

      mockContext.request = new Request('http://localhost/api/cart/all');

      const response = await getAllCartItems(mockContext);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].productId).toBe(productId);
      expect(body.data[0].quantity).toBe(2);
    });

    it('should return empty array when no items added', async () => {
      mockContext.request = new Request('http://localhost/api/cart/all');

      const response = await getAllCartItems(mockContext);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toHaveLength(0);
    });
  });

  describe('DELETE /api/cart/[productId] - Remove Item from Cart', () => {
    it('should remove item from cart successfully', async () => {
      const products = await testProductRepository.findAll();
      const productId = products[0].toJSON().id;

      const addRequest = new Request('http://localhost/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId,
          quantity: 2,
        }),
      });
      mockContext.request = addRequest;
      await addItemToCart(mockContext);

      mockContext.request = new Request(`http://localhost/api/cart/${productId}`, {
        method: 'DELETE',
      });
      mockContext.params = { productId };

      const response = await removeItemFromCart(mockContext);

      expect(response.status).toBe(204);
    });

    it('should return 404 when item does not exist in cart', async () => {
      const products = await testProductRepository.findAll();
      const productId = products[0].toJSON().id;

      mockContext.request = new Request(`http://localhost/api/cart/${productId}`, {
        method: 'DELETE',
      });
      mockContext.params = { productId };

      const response = await removeItemFromCart(mockContext);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Item not found in cart');
    });

    it('should return 404 when removing non-existent product', async () => {
      const products = await testProductRepository.findAll();
      const productId1 = products[0].toJSON().id;

      const addRequest = new Request('http://localhost/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId1,
          quantity: 2,
        }),
      });
      mockContext.request = addRequest;
      await addItemToCart(mockContext);

      const nonExistentId = 'non-existent-product-id';
      mockContext.request = new Request(`http://localhost/api/cart/${nonExistentId}`, {
        method: 'DELETE',
      });
      mockContext.params = { productId: nonExistentId };

      const response = await removeItemFromCart(mockContext);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Item not found in cart');
    });
  });

  describe('PATCH /api/cart - Update Item Quantity', () => {
    it('should update item quantity successfully', async () => {
      const products = await testProductRepository.findAll();
      const productId = products[0].toJSON().id;

      const addRequest = new Request('http://localhost/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId,
          quantity: 2,
        }),
      });
      mockContext.request = addRequest;
      await addItemToCart(mockContext);

      mockContext.request = new Request('http://localhost/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId,
          quantity: 5,
        }),
      });

      const response = await updateItemQuantity(mockContext);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.productId).toBe(productId);
      expect(body.data.quantity).toBe(5);
    });

    it('should return 404 when item does not exist in cart', async () => {
      const products = await testProductRepository.findAll();
      const productId = products[0].toJSON().id;

      mockContext.request = new Request('http://localhost/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId,
          quantity: 5,
        }),
      });

      const response = await updateItemQuantity(mockContext);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Item not found in cart');
    });

    it('should return 404 when updating non-existent product in cart', async () => {
      const products = await testProductRepository.findAll();
      const productId1 = products[0].toJSON().id;

      const addRequest = new Request('http://localhost/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId1,
          quantity: 2,
        }),
      });
      mockContext.request = addRequest;
      await addItemToCart(mockContext);

      mockContext.request = new Request('http://localhost/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'non-existent-product',
          quantity: 5,
        }),
      });

      const response = await updateItemQuantity(mockContext);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Item not found in cart');
    });

    it('should return 400 when quantity is zero', async () => {
      const products = await testProductRepository.findAll();
      const productId = products[0].toJSON().id;

      const addRequest = new Request('http://localhost/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId,
          quantity: 2,
        }),
      });
      mockContext.request = addRequest;
      await addItemToCart(mockContext);

      mockContext.request = new Request('http://localhost/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId,
          quantity: 0,
        }),
      });

      const response = await updateItemQuantity(mockContext);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
    });

    it('should return 400 when quantity is negative', async () => {
      const products = await testProductRepository.findAll();
      const productId = products[0].toJSON().id;

      const addRequest = new Request('http://localhost/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId,
          quantity: 2,
        }),
      });
      mockContext.request = addRequest;
      await addItemToCart(mockContext);

      mockContext.request = new Request('http://localhost/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId,
          quantity: -1,
        }),
      });

      const response = await updateItemQuantity(mockContext);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
    });
  });

  describe('End-to-End Cart Workflow Tests', () => {
    it('should handle complete cart workflow', async () => {
      const products = await testProductRepository.findAll();
      const productId1 = products[0].toJSON().id;
      const productId2 = products[1].toJSON().id;

      let addRequest = new Request('http://localhost/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId1,
          quantity: 2,
        }),
      });
      mockContext.request = addRequest;
      let response = await addItemToCart(mockContext);
      let body = await response.json();

      expect(response.status).toBe(201);
      expect(body.data.productId).toBe(productId1);
      expect(body.data.quantity).toBe(2);

      addRequest = new Request('http://localhost/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId2,
          quantity: 3,
        }),
      });
      mockContext.request = addRequest;
      response = await addItemToCart(mockContext);
      body = await response.json();

      expect(response.status).toBe(201);
      expect(body.data.productId).toBe(productId2);
      expect(body.data.quantity).toBe(3);

      mockContext.request = new Request('http://localhost/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId1,
          quantity: 5,
        }),
      });
      response = await updateItemQuantity(mockContext);
      body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data.productId).toBe(productId1);
      expect(body.data.quantity).toBe(5);

      mockContext.request = new Request(`http://localhost/api/cart/${productId2}`, {
        method: 'DELETE',
      });
      mockContext.params = { productId: productId2 };
      response = await removeItemFromCart(mockContext);

      expect(response.status).toBe(204);

      mockContext.request = new Request('http://localhost/api/cart/all');
      response = await getAllCartItems(mockContext);
      body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].productId).toBe(productId1);
      expect(body.data[0].quantity).toBe(5);
    });
  });
});

