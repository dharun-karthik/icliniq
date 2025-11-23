import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withBodyValidation, withParamsValidation } from './validation';
import type { APIContext } from 'astro';
import { z } from 'zod';

describe('validation middleware', () => {
  let mockContext: APIContext;

  beforeEach(() => {
    mockContext = {
      request: new Request('http://localhost/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
      params: {},
      url: new URL('http://localhost/api/test'),
    } as APIContext;
  });

  describe('withBodyValidation', () => {
    const testSchema = z.object({
      name: z.string().min(1, 'Name is required'),
      age: z.number().min(0, 'Age must be positive'),
    });

    describe('successful validation', () => {
      it('should call handler with validated data when body is valid', async () => {
        const validBody = { name: 'John', age: 30 };
        mockContext.request = new Request('http://localhost/api/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validBody),
        });

        const mockResponse = new Response(JSON.stringify({ success: true }));
        const handler = vi.fn().mockResolvedValue(mockResponse);
        const wrappedHandler = withBodyValidation(testSchema, handler);

        const result = await wrappedHandler(mockContext);

        expect(handler).toHaveBeenCalledWith(mockContext, validBody);
        expect(result).toBe(mockResponse);
      });

      it('should handle synchronous handlers', async () => {
        const validBody = { name: 'Jane', age: 25 };
        mockContext.request = new Request('http://localhost/api/test', {
          method: 'POST',
          body: JSON.stringify(validBody),
        });

        const mockResponse = new Response();
        const handler = vi.fn().mockReturnValue(mockResponse);
        const wrappedHandler = withBodyValidation(testSchema, handler);

        const result = await wrappedHandler(mockContext);

        expect(handler).toHaveBeenCalledWith(mockContext, validBody);
        expect(result).toBe(mockResponse);
      });

      it('should apply schema defaults', async () => {
        const schemaWithDefaults = z.object({
          name: z.string(),
          active: z.boolean().default(true),
        });

        const body = { name: 'Test' };
        mockContext.request = new Request('http://localhost/api/test', {
          method: 'POST',
          body: JSON.stringify(body),
        });

        const handler = vi.fn().mockResolvedValue(new Response());
        const wrappedHandler = withBodyValidation(schemaWithDefaults, handler);

        await wrappedHandler(mockContext);

        expect(handler).toHaveBeenCalledWith(mockContext, {
          name: 'Test',
          active: true,
        });
      });

      it('should transform data according to schema', async () => {
        const transformSchema = z.object({
          name: z.string().transform(s => s.toUpperCase()),
          age: z.number(),
        });

        const body = { name: 'john', age: 30 };
        mockContext.request = new Request('http://localhost/api/test', {
          method: 'POST',
          body: JSON.stringify(body),
        });

        const handler = vi.fn().mockResolvedValue(new Response());
        const wrappedHandler = withBodyValidation(transformSchema, handler);

        await wrappedHandler(mockContext);

        expect(handler).toHaveBeenCalledWith(mockContext, {
          name: 'JOHN',
          age: 30,
        });
      });
    });

    describe('validation errors', () => {
      it('should return 400 when required field is missing', async () => {
        const invalidBody = { age: 30 };
        mockContext.request = new Request('http://localhost/api/test', {
          method: 'POST',
          body: JSON.stringify(invalidBody),
        });

        const handler = vi.fn();
        const wrappedHandler = withBodyValidation(testSchema, handler);

        const result = await wrappedHandler(mockContext);

        expect(result.status).toBe(400);
        expect(handler).not.toHaveBeenCalled();

        const body = await result.json();
        expect(body.success).toBe(false);
        expect(body.error.message).toContain('Validation failed');
      });

      it('should return 400 when field type is invalid', async () => {
        const invalidBody = { name: 'John', age: 'thirty' };
        mockContext.request = new Request('http://localhost/api/test', {
          method: 'POST',
          body: JSON.stringify(invalidBody),
        });

        const handler = vi.fn();
        const wrappedHandler = withBodyValidation(testSchema, handler);

        const result = await wrappedHandler(mockContext);

        expect(result.status).toBe(400);
        expect(handler).not.toHaveBeenCalled();
      });

      it('should return 400 when validation constraint fails', async () => {
        const invalidBody = { name: '', age: 30 };
        mockContext.request = new Request('http://localhost/api/test', {
          method: 'POST',
          body: JSON.stringify(invalidBody),
        });

        const handler = vi.fn();
        const wrappedHandler = withBodyValidation(testSchema, handler);

        const result = await wrappedHandler(mockContext);

        expect(result.status).toBe(400);
        const body = await result.json();
        expect(body.error.message).toContain('Name is required');
      });

      it('should include all validation errors in response', async () => {
        const invalidBody = { name: '', age: -5 };
        mockContext.request = new Request('http://localhost/api/test', {
          method: 'POST',
          body: JSON.stringify(invalidBody),
        });

        const handler = vi.fn();
        const wrappedHandler = withBodyValidation(testSchema, handler);

        const result = await wrappedHandler(mockContext);

        expect(result.status).toBe(400);
        const body = await result.json();
        expect(body.error.message).toContain('Validation failed');
        expect(body.error.message).toContain('Name is required');
        expect(body.error.message).toContain('Age must be positive');
      });

      it('should handle nested object validation errors', async () => {
        const nestedSchema = z.object({
          user: z.object({
            name: z.string().min(1),
            email: z.string().email(),
          }),
        });

        const invalidBody = { user: { name: '', email: 'invalid' } };
        mockContext.request = new Request('http://localhost/api/test', {
          method: 'POST',
          body: JSON.stringify(invalidBody),
        });

        const handler = vi.fn();
        const wrappedHandler = withBodyValidation(nestedSchema, handler);

        const result = await wrappedHandler(mockContext);

        expect(result.status).toBe(400);
      });
    });


    describe('JSON parsing errors', () => {
      it('should return 400 when body is not valid JSON', async () => {
        mockContext.request = new Request('http://localhost/api/test', {
          method: 'POST',
          body: 'invalid json {',
        });

        const handler = vi.fn();
        const wrappedHandler = withBodyValidation(testSchema, handler);

        const result = await wrappedHandler(mockContext);

        expect(result.status).toBe(400);
        expect(handler).not.toHaveBeenCalled();

        const body = await result.json();
        expect(body.error.message).toBe('Invalid JSON in request body');
      });

    });
  });

  describe('withParamsValidation', () => {
    const paramsSchema = z.object({
      id: z.string().min(1, 'ID is required'),
    });

    describe('successful validation', () => {
      it('should call handler with validated params when params are valid', async () => {
        mockContext.params = { id: '123' };

        const mockResponse = new Response(JSON.stringify({ success: true }));
        const handler = vi.fn().mockResolvedValue(mockResponse);
        const wrappedHandler = withParamsValidation(paramsSchema, handler);

        const result = await wrappedHandler(mockContext);

        expect(handler).toHaveBeenCalledWith(mockContext, { id: '123' });
        expect(result).toBe(mockResponse);
      });

      it('should handle synchronous handlers', async () => {
        mockContext.params = { id: 'abc-123' };

        const mockResponse = new Response();
        const handler = vi.fn().mockReturnValue(mockResponse);
        const wrappedHandler = withParamsValidation(paramsSchema, handler);

        const result = await wrappedHandler(mockContext);

        expect(handler).toHaveBeenCalledWith(mockContext, { id: 'abc-123' });
        expect(result).toBe(mockResponse);
      });

      it('should handle multiple params', async () => {
        const multiParamsSchema = z.object({
          userId: z.string(),
          postId: z.string(),
        });

        mockContext.params = { userId: 'user-1', postId: 'post-2' };

        const handler = vi.fn().mockResolvedValue(new Response());
        const wrappedHandler = withParamsValidation(multiParamsSchema, handler);

        await wrappedHandler(mockContext);

        expect(handler).toHaveBeenCalledWith(mockContext, {
          userId: 'user-1',
          postId: 'post-2',
        });
      });

      it('should apply schema transformations', async () => {
        const transformSchema = z.object({
          id: z.string().transform(s => s.toUpperCase()),
        });

        mockContext.params = { id: 'abc' };

        const handler = vi.fn().mockResolvedValue(new Response());
        const wrappedHandler = withParamsValidation(transformSchema, handler);

        await wrappedHandler(mockContext);

        expect(handler).toHaveBeenCalledWith(mockContext, { id: 'ABC' });
      });

      it('should coerce types when specified', async () => {
        const coerceSchema = z.object({
          page: z.coerce.number(),
        });

        mockContext.params = { page: '5' };

        const handler = vi.fn().mockResolvedValue(new Response());
        const wrappedHandler = withParamsValidation(coerceSchema, handler);

        await wrappedHandler(mockContext);

        expect(handler).toHaveBeenCalledWith(mockContext, { page: 5 });
      });
    });

    describe('validation errors', () => {
      it('should return 400 when required param is missing', async () => {
        mockContext.params = {}; 

        const handler = vi.fn();
        const wrappedHandler = withParamsValidation(paramsSchema, handler);

        const result = await wrappedHandler(mockContext);

        expect(result.status).toBe(400);
        expect(handler).not.toHaveBeenCalled();

        const body = await result.json();
        expect(body.success).toBe(false);
        expect(body.error.message).toContain('Invalid parameters');
      });

      it('should return 400 when param is empty string', async () => {
        mockContext.params = { id: '' };

        const handler = vi.fn();
        const wrappedHandler = withParamsValidation(paramsSchema, handler);

        const result = await wrappedHandler(mockContext);

        expect(result.status).toBe(400);
        const body = await result.json();
        expect(body.error.message).toContain('ID is required');
      });

      it('should return 400 when param type is invalid', async () => {
        const numberParamsSchema = z.object({
          id: z.number(),
        });

        mockContext.params = { id: 'not-a-number' };

        const handler = vi.fn();
        const wrappedHandler = withParamsValidation(numberParamsSchema, handler);

        const result = await wrappedHandler(mockContext);

        expect(result.status).toBe(400);
      });

      it('should include all validation errors for multiple params', async () => {
        const multiParamsSchema = z.object({
          userId: z.string().min(1),
          postId: z.string().min(1),
        });

        mockContext.params = { userId: '', postId: '' };

        const handler = vi.fn();
        const wrappedHandler = withParamsValidation(multiParamsSchema, handler);

        const result = await wrappedHandler(mockContext);

        expect(result.status).toBe(400);
        const body = await result.json();
        expect(body.error.message).toContain('Invalid parameters');
      });
    });
  });
});

