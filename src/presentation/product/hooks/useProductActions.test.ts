import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useProductActions } from './useProductActions';
import type { ProductFormData } from './useProductForm';

describe('useProductActions', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    mockOnSuccess.mockClear();
  });

  describe('createProduct', () => {
    it('should create product successfully', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        json: async () => ({ success: true }),
      } as Response);

      const { result } = renderHook(() => useProductActions(mockOnSuccess));

      const formData: ProductFormData = {
        name: 'Test Product',
        description: 'Test Description',
        price: '99.99',
        stock: '10',
      };

      let success = false;
      await act(async () => {
        success = await result.current.createProduct(formData);
      });

      expect(success).toBe(true);
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(result.current.error).toBeNull();
    });

    it('should handle create product error', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        json: async () => ({ success: false, error: { message: 'Failed to create' } }),
      } as Response);

      const { result } = renderHook(() => useProductActions(mockOnSuccess));

      const formData: ProductFormData = {
        name: 'Test Product',
        description: 'Test Description',
        price: '99.99',
        stock: '10',
      };

      let success = false;
      await act(async () => {
        success = await result.current.createProduct(formData);
      });

      expect(success).toBe(false);
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(result.current.error).toBe('Failed to create');
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        json: async () => ({ success: true }),
      } as Response);

      const { result } = renderHook(() => useProductActions(mockOnSuccess));

      const formData: ProductFormData = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: '149.99',
        stock: '20',
      };

      let success = false;
      await act(async () => {
        success = await result.current.updateProduct('product-123', formData);
      });

      expect(success).toBe(true);
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });

    it('should handle update product error', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        json: async () => ({ success: false, error: { message: 'Failed to update' } }),
      } as Response);

      const { result } = renderHook(() => useProductActions(mockOnSuccess));

      const formData: ProductFormData = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: '149.99',
        stock: '20',
      };

      let success = false;
      await act(async () => {
        success = await result.current.updateProduct('product-123', formData);
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('Failed to update');
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as Response);

      const { result } = renderHook(() => useProductActions(mockOnSuccess));

      let success = false;
      await act(async () => {
        success = await result.current.deleteProduct('product-123');
      });

      expect(success).toBe(true);
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });

    it('should handle delete product error', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      const { result } = renderHook(() => useProductActions(mockOnSuccess));

      let success = false;
      await act(async () => {
        success = await result.current.deleteProduct('product-123');
      });

      expect(success).toBe(false);
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
});

