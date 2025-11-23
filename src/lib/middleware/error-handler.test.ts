import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { withErrorHandler } from './error-handler';
import type { APIContext } from 'astro';
import {
  DomainValidationError,
  EntityNotFoundError,
} from '../../domain/shared/errors/DomainError';

describe('withErrorHandler', () => {
  let mockContext: APIContext;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockContext = {
      request: new Request('http://localhost/api/test'),
      params: {},
      url: new URL('http://localhost/api/test'),
    } as APIContext;

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('successful handler execution', () => {
    it('should return response from handler when no error occurs', async () => {
      const mockResponse = new Response(JSON.stringify({ success: true }), {
        status: 200,
      });

      const handler = vi.fn().mockResolvedValue(mockResponse);
      const wrappedHandler = withErrorHandler(handler);

      const result = await wrappedHandler(mockContext);

      expect(handler).toHaveBeenCalledWith(mockContext);
      expect(result).toBe(mockResponse);
      expect(result.status).toBe(200);
    });

    it('should pass context to handler correctly', async () => {
      const handler = vi.fn().mockResolvedValue(new Response());
      const wrappedHandler = withErrorHandler(handler);

      await wrappedHandler(mockContext);

      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenCalledWith(mockContext);
    });

    it('should handle synchronous handlers', async () => {
      const mockResponse = new Response(JSON.stringify({ data: 'test' }));
      const handler = vi.fn().mockReturnValue(mockResponse);
      const wrappedHandler = withErrorHandler(handler);

      const result = await wrappedHandler(mockContext);

      expect(result).toBe(mockResponse);
    });
  });

  describe('EntityNotFoundError handling', () => {
    it('should return 404 response when EntityNotFoundError is thrown', async () => {
      const error = new EntityNotFoundError('Product not found');
      const handler = vi.fn().mockRejectedValue(error);
      const wrappedHandler = withErrorHandler(handler);

      const result = await wrappedHandler(mockContext);

      expect(result.status).toBe(404);
      const body = await result.json();
      expect(body).toEqual({
        success: false,
        error: {
          message: 'Product not found',
          code: 'NOT_FOUND',
        },
      });
    });

    it('should preserve error message in 404 response', async () => {
      const customMessage = 'product with ID 123 not found';
      const error = new EntityNotFoundError(customMessage);
      const handler = vi.fn().mockRejectedValue(error);
      const wrappedHandler = withErrorHandler(handler);

      const result = await wrappedHandler(mockContext);
      const body = await result.json();

      expect(body.error.message).toBe(customMessage);
    });
  });

  describe('DomainValidationError handling', () => {
    it('should return 400 response when DomainValidationError is thrown', async () => {
      const error = new DomainValidationError('Invalid product name');
      const handler = vi.fn().mockRejectedValue(error);
      const wrappedHandler = withErrorHandler(handler);

      const result = await wrappedHandler(mockContext);

      expect(result.status).toBe(400);
      const body = await result.json();
      expect(body).toEqual({
        success: false,
        error: {
          message: 'Invalid product name',
          code: 'BAD_REQUEST',
        },
      });
    });

    it('should preserve error message in 400 response', async () => {
      const customMessage = 'Price cannot be negative';
      const error = new DomainValidationError(customMessage);
      const handler = vi.fn().mockRejectedValue(error);
      const wrappedHandler = withErrorHandler(handler);

      const result = await wrappedHandler(mockContext);
      const body = await result.json();

      expect(body.error.message).toBe(customMessage);
    });
  });

  describe('unknown error handling', () => {
    it('should return 500 response for unknown errors', async () => {
      const error = new Error('Unexpected database error');
      const handler = vi.fn().mockRejectedValue(error);
      const wrappedHandler = withErrorHandler(handler);

      const result = await wrappedHandler(mockContext);

      expect(result.status).toBe(500);
      const body = await result.json();
      expect(body).toEqual({
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
      });
    });

    it('should log unknown errors to console', async () => {
      const error = new Error('Unexpected error');
      const handler = vi.fn().mockRejectedValue(error);
      const wrappedHandler = withErrorHandler(handler);

      await wrappedHandler(mockContext);

      expect(consoleErrorSpy).toHaveBeenCalledOnce();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Unexpected error in API route:',
        error
      );
    });

  });

  describe('error priority', () => {
    it('should handle EntityNotFoundError before generic errors', async () => {
      const error = new EntityNotFoundError('Not found');
      const handler = vi.fn().mockRejectedValue(error);
      const wrappedHandler = withErrorHandler(handler);

      const result = await wrappedHandler(mockContext);

      expect(result.status).toBe(404);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should handle DomainValidationError before generic errors', async () => {
      const error = new DomainValidationError('Validation failed');
      const handler = vi.fn().mockRejectedValue(error);
      const wrappedHandler = withErrorHandler(handler);

      const result = await wrappedHandler(mockContext);

      expect(result.status).toBe(400);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should not log domain errors to console', async () => {
      const errors = [
        new EntityNotFoundError('Not found'),
        new DomainValidationError('Invalid'),
      ];

      for (const error of errors) {
        consoleErrorSpy.mockClear();
        const handler = vi.fn().mockRejectedValue(error);
        const wrappedHandler = withErrorHandler(handler);

        await wrappedHandler(mockContext);

        expect(consoleErrorSpy).not.toHaveBeenCalled();
      }
    });
  });

  describe('response format', () => {
    it('should return responses with correct Content-Type header', async () => {
      const error = new EntityNotFoundError('Not found');
      const handler = vi.fn().mockRejectedValue(error);
      const wrappedHandler = withErrorHandler(handler);

      const result = await wrappedHandler(mockContext);

      expect(result.headers.get('Content-Type')).toBe('application/json');
    });

    it('should return valid JSON for all error types', async () => {
      const errors = [
        new EntityNotFoundError('Not found'),
        new DomainValidationError('Invalid'),
        new Error('Unknown'),
      ];

      for (const error of errors) {
        const handler = vi.fn().mockRejectedValue(error);
        const wrappedHandler = withErrorHandler(handler);

        const result = await wrappedHandler(mockContext);
        const body = await result.json();

        expect(body).toHaveProperty('success', false);
        expect(body).toHaveProperty('error');
        expect(body.error).toHaveProperty('message');
        expect(body.error).toHaveProperty('code');
      }
    });
  });
});

