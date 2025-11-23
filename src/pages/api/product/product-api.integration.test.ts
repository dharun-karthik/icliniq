import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { APIContext } from 'astro';
import { POST as createProduct } from './index';
import { GET as getProduct, PUT as updateProduct, DELETE as deleteProduct } from './[productId]';
import { GET as getAllProducts } from './all';
import { ProductInMemoryReporsitory } from '../../../infrastructure/datapersistence/ProductInMemoryReporsitory';
import { ProductService } from '../../../application/product/ProductService';

let testRepository: ProductInMemoryReporsitory;
let testService: ProductService;

vi.mock('../../../lib/containers', () => ({
  getProductRepository: () => testRepository,
  getProductService: () => testService,
}));

describe('Product API Integration Tests', () => {
  let mockContext: APIContext;

  beforeEach(async () => {
    testRepository = new ProductInMemoryReporsitory();
    testService = new ProductService(testRepository);

    mockContext = {
      request: new Request('http://localhost/api/product'),
      params: {},
      url: new URL('http://localhost/api/product'),
    } as APIContext;
  });

  describe('POST /api/product - Create Product', () => {
    it('should create a product successfully with valid data', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
      };

      mockContext.request = new Request('http://localhost/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const response = await createProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('id');
      expect(body.data.name).toBe('Test Product');
      expect(body.data.description).toBe('Test Description');
      expect(body.data.price).toBe(99.99);
      expect(body.data.stock).toBe(10);
    });

    it('should create a product with default empty description', async () => {
      const productData = {
        name: 'Product Without Description',
        price: 49.99,
        stock: 5,
      };

      mockContext.request = new Request('http://localhost/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const response = await createProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body.success).toBe(true);
      expect(body.data.description).toBe('');
    });

    it('should return 400 when required fields are missing', async () => {
      const invalidData = {
        name: 'Test Product',
      };

      mockContext.request = new Request('http://localhost/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const response = await createProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Validation failed');
    });

    it('should return 400 when name is empty', async () => {
      const invalidData = {
        name: '',
        description: 'Test',
        price: 99.99,
        stock: 10,
      };

      mockContext.request = new Request('http://localhost/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const response = await createProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Product name cannot be empty');
    });

    it('should return 400 when price or stock are not numbers', async () => {
      const invalidData = {
        name: 'Test Product',
        description: 'Test',
        price: 'not-a-number',
        stock: 10,
      };

      mockContext.request = new Request('http://localhost/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const response = await createProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
    });

    it('should return 400 when body is not valid JSON', async () => {
      mockContext.request = new Request('http://localhost/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json {',
      });

      const response = await createProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error.message).toBe('Invalid JSON in request body');
    });

    it('should return 400 when price is negative', async () => {
      const invalidData = {
        name: 'Test Product',
        description: 'Test',
        price: -10,
        stock: 10,
      };

      mockContext.request = new Request('http://localhost/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const response = await createProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Money amount cannot be negative');
    });

    it('should return 400 when stock is negative', async () => {
      const invalidData = {
        name: 'Test Product',
        description: 'Test',
        price: 99.99,
        stock: -5,
      };

      mockContext.request = new Request('http://localhost/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const response = await createProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Stock quantity cannot be negative');
    });
  });

  describe('GET /api/product/all - Get All Products', () => {
    it('should return empty array when no products exist', async () => {
      const response = await getAllProducts(mockContext);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toEqual([]);
    });

    it('should return all products', async () => {
      const products = [
        { name: 'Product 1', description: 'Desc 1', price: 10.99, stock: 5 },
        { name: 'Product 2', description: 'Desc 2', price: 20.99, stock: 10 },
        { name: 'Product 3', description: 'Desc 3', price: 30.99, stock: 15 },
      ];

      for (const product of products) {
        mockContext.request = new Request('http://localhost/api/product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        });
        await createProduct(mockContext);
      }

      const response = await getAllProducts(mockContext);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toHaveLength(3);
      expect(body.data[0].name).toBe('Product 1');
      expect(body.data[1].name).toBe('Product 2');
      expect(body.data[2].name).toBe('Product 3');
    });
  });

  describe('GET /api/product/[id] - Get Product by ID', () => {
    it('should return a product when it exists', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
      };

      mockContext.request = new Request('http://localhost/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const createResponse = await createProduct(mockContext);
      const createBody = await createResponse.json();
      const productId = createBody.data.id;

      mockContext.params = { productId: productId };
      const response = await getProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(productId);
      expect(body.data.name).toBe('Test Product');
      expect(body.data.description).toBe('Test Description');
      expect(body.data.price).toBe(99.99);
      expect(body.data.stock).toBe(10);
    });

    it('should return 404 when product does not exist', async () => {
      mockContext.params = { productId: 'non-existent-id' };
      const response = await getProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.success).toBe(false);
      expect(body.error.message).toBe('Product not found');
      expect(body.error.code).toBe('NOT_FOUND');
    });

    it('should return 400 when id parameter is missing', async () => {
      mockContext.params = {};
      const response = await getProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Invalid parameters');
    });

    it('should return 400 when id parameter is empty', async () => {
      mockContext.params = { productId: '' };
      const response = await getProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Product ID cannot be empty');
    });
  });

  describe('PUT /api/product/[id] - Update Product', () => {
    it('should update a product successfully with all fields', async () => {
      // Create a product first
      const productData = {
        name: 'Original Product',
        description: 'Original Description',
        price: 50.00,
        stock: 5,
      };

      mockContext.request = new Request('http://localhost/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const createResponse = await createProduct(mockContext);
      const createBody = await createResponse.json();
      const productId = createBody.data.id;

      const updateData = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 75.00,
        stock: 15,
      };

      mockContext.params = { productId: productId };
      mockContext.request = new Request(`http://localhost/api/product/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const response = await updateProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(productId);
      expect(body.data.name).toBe('Updated Product');
      expect(body.data.description).toBe('Updated Description');
      expect(body.data.price).toBe(75.00);
      expect(body.data.stock).toBe(15);
    });

    it('should update a product with partial fields', async () => {
      // Create a product first
      const productData = {
        name: 'Original Product',
        description: 'Original Description',
        price: 50.00,
        stock: 5,
      };

      mockContext.request = new Request('http://localhost/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const createResponse = await createProduct(mockContext);
      const createBody = await createResponse.json();
      const productId = createBody.data.id;

      const updateData = {
        name: 'Updated Name Only',
      };

      mockContext.params = { productId: productId };
      mockContext.request = new Request(`http://localhost/api/product/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const response = await updateProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.name).toBe('Updated Name Only');
      expect(body.data.description).toBe('Original Description');
      expect(body.data.price).toBe(50.00);
      expect(body.data.stock).toBe(5);
    });

    it('should return 404 when updating non-existent product', async () => {
      const updateData = {
        name: 'Updated Product',
      };

      mockContext.params = { productId: 'non-existent-id' };
      mockContext.request = new Request('http://localhost/api/product/non-existent-id', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const response = await updateProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.success).toBe(false);
      expect(body.error.message).toBe('Product not found');
    });

    it('should return 400 when no fields are provided for update', async () => {
      // Create a product first
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
      };

      mockContext.request = new Request('http://localhost/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const createResponse = await createProduct(mockContext);
      const createBody = await createResponse.json();
      const productId = createBody.data.id;

      const updateData = {};

      mockContext.params = { productId: productId };
      mockContext.request = new Request(`http://localhost/api/product/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const response = await updateProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('At least one field must be provided for update');
    });

    it('should return 400 when update name is empty', async () => {
      // Create a product first
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
      };

      mockContext.request = new Request('http://localhost/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const createResponse = await createProduct(mockContext);
      const createBody = await createResponse.json();
      const productId = createBody.data.id;

      // Try to update with empty name
      const updateData = {
        name: '',
      };

      mockContext.params = { productId: productId };
      mockContext.request = new Request(`http://localhost/api/product/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const response = await updateProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Product name cannot be empty');
    });
  });

  describe('DELETE /api/product/[id] - Delete Product', () => {
    it('should delete a product successfully', async () => {
      // Create a product first
      const productData = {
        name: 'Product to Delete',
        description: 'Will be deleted',
        price: 99.99,
        stock: 10,
      };

      mockContext.request = new Request('http://localhost/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const createResponse = await createProduct(mockContext);
      const createBody = await createResponse.json();
      const productId = createBody.data.id;

      // Delete the product
      mockContext.params = { productId: productId };
      const response = await deleteProduct(mockContext);

      expect(response.status).toBe(204);
      expect(response.body).toBeNull();

      // Verify product is deleted by trying to get it
      const getResponse = await getProduct(mockContext);
      const getBody = await getResponse.json();

      expect(getResponse.status).toBe(404);
      expect(getBody.error.message).toBe('Product not found');
    });

    it('should return 404 when deleting non-existent product', async () => {
      mockContext.params = { productId: 'non-existent-id' };
      const response = await deleteProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.success).toBe(false);
      expect(body.error.message).toBe('Product not found');
    });

    it('should return 400 when id parameter is missing', async () => {
      mockContext.params = {};
      const response = await deleteProduct(mockContext);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Invalid parameters');
    });
  });

  describe('End-to-End Workflow Tests', () => {
    it('should handle complete CRUD workflow', async () => {
      // 1. Create a product
      const createData = {
        name: 'Workflow Product',
        description: 'Testing complete workflow',
        price: 100.00,
        stock: 20,
      };

      mockContext.request = new Request('http://localhost/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createData),
      });

      const createResponse = await createProduct(mockContext);
      const createBody = await createResponse.json();
      const productId = createBody.data.id;

      expect(createResponse.status).toBe(201);
      expect(createBody.data.name).toBe('Workflow Product');

      // 2. Read the product
      mockContext.params = { productId: productId };
      const readResponse = await getProduct(mockContext);
      const readBody = await readResponse.json();

      expect(readResponse.status).toBe(200);
      expect(readBody.data.id).toBe(productId);
      expect(readBody.data.name).toBe('Workflow Product');

      // 3. Update the product
      const updateData = {
        name: 'Updated Workflow Product',
        price: 150.00,
      };

      mockContext.request = new Request(`http://localhost/api/product/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const updateResponse = await updateProduct(mockContext);
      const updateBody = await updateResponse.json();

      expect(updateResponse.status).toBe(200);
      expect(updateBody.data.name).toBe('Updated Workflow Product');
      expect(updateBody.data.price).toBe(150.00);
      expect(updateBody.data.stock).toBe(20); // Should remain unchanged

      // 4. Verify update by reading again
      const verifyResponse = await getProduct(mockContext);
      const verifyBody = await verifyResponse.json();

      expect(verifyResponse.status).toBe(200);
      expect(verifyBody.data.name).toBe('Updated Workflow Product');
      expect(verifyBody.data.price).toBe(150.00);

      // 5. Delete the product
      const deleteResponse = await deleteProduct(mockContext);
      expect(deleteResponse.status).toBe(204);

      // 6. Verify deletion
      const deletedResponse = await getProduct(mockContext);
      expect(deletedResponse.status).toBe(404);
    });

    it('should handle multiple products independently', async () => {
      // Create multiple products
      const products = [
        { name: 'Product A', description: 'Description A', price: 10.00, stock: 5 },
        { name: 'Product B', description: 'Description B', price: 20.00, stock: 10 },
        { name: 'Product C', description: 'Description C', price: 30.00, stock: 15 },
      ];

      const productIds: string[] = [];

      for (const product of products) {
        mockContext.request = new Request('http://localhost/api/product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        });

        const response = await createProduct(mockContext);
        const body = await response.json();
        productIds.push(body.data.id);
      }

      // Verify all products exist
      const allResponse = await getAllProducts(mockContext);
      const allBody = await allResponse.json();

      expect(allResponse.status).toBe(200);
      expect(allBody.data).toHaveLength(3);

      // Update one product
      const updateData = { price: 25.00 };
      mockContext.params = { productId: productIds[1] };
      mockContext.request = new Request(`http://localhost/api/product/${productIds[1]}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const updateResponse = await updateProduct(mockContext);
      const updateBody = await updateResponse.json();

      expect(updateResponse.status).toBe(200);
      expect(updateBody.data.price).toBe(25.00);

      // Delete one product
      mockContext.params = { productId: productIds[0] };
      const deleteResponse = await deleteProduct(mockContext);
      expect(deleteResponse.status).toBe(204);

      // Verify remaining products
      const finalResponse = await getAllProducts(mockContext);
      const finalBody = await finalResponse.json();

      expect(finalResponse.status).toBe(200);
      expect(finalBody.data).toHaveLength(2);
      expect(finalBody.data.find((p: any) => p.id === productIds[1]).price).toBe(25.00);
      expect(finalBody.data.find((p: any) => p.id === productIds[0])).toBeUndefined();
    });

    it('should maintain data consistency across operations', async () => {
      // Create a product
      const productData = {
        name: 'Consistency Test',
        description: 'Testing data consistency',
        price: 50.00,
        stock: 10,
      };

      mockContext.request = new Request('http://localhost/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const createResponse = await createProduct(mockContext);
      const createBody = await createResponse.json();
      const productId = createBody.data.id;

      // Perform multiple updates
      const updates = [
        { stock: 15 },
        { price: 60.00 },
        { description: 'Updated description' },
      ];

      for (const update of updates) {
        mockContext.params = { productId: productId };
        mockContext.request = new Request(`http://localhost/api/product/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update),
        });

        await updateProduct(mockContext);
      }

      // Verify final state
      mockContext.params = { productId: productId };
      const finalResponse = await getProduct(mockContext);
      const finalBody = await finalResponse.json();

      expect(finalResponse.status).toBe(200);
      expect(finalBody.data.name).toBe('Consistency Test');
      expect(finalBody.data.description).toBe('Updated description');
      expect(finalBody.data.price).toBe(60.00);
      expect(finalBody.data.stock).toBe(15);
    });
  });
});

