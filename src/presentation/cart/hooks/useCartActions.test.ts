import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCartActions } from './useCartActions';

describe('useCartActions', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    mockOnSuccess.mockClear();
  });

  describe('addItemToCart', () => {
    it('should add item to cart successfully', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        json: async () => ({ success: true }),
      } as Response);

      const { result } = renderHook(() => useCartActions(mockOnSuccess));

      let success = false;
      await act(async () => {
        success = await result.current.addItemToCart('product-123', 2);
      });

      expect(success).toBe(true);
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(result.current.error).toBeNull();
    });

    it('should handle add item error', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        json: async () => ({ success: false, error: { message: 'Failed to add item' } }),
      } as Response);

      const { result } = renderHook(() => useCartActions(mockOnSuccess));

      let success = false;
      await act(async () => {
        success = await result.current.addItemToCart('product-123', 2);
      });

      expect(success).toBe(false);
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(result.current.error).toBe('Failed to add item');
    });

    it('should handle network error', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useCartActions(mockOnSuccess));

      let success = false;
      await act(async () => {
        success = await result.current.addItemToCart('product-123', 2);
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('An error occurred while adding item to cart');
    });
  });

  describe('updateItemQuantity', () => {
    it('should update item quantity successfully', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        json: async () => ({ success: true }),
      } as Response);

      const { result } = renderHook(() => useCartActions(mockOnSuccess));

      let success = false;
      await act(async () => {
        success = await result.current.updateItemQuantity('product-123', 5);
      });

      expect(success).toBe(true);
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });

    it('should handle update quantity error', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        json: async () => ({ success: false, error: { message: 'Failed to update' } }),
      } as Response);

      const { result } = renderHook(() => useCartActions(mockOnSuccess));

      let success = false;
      await act(async () => {
        success = await result.current.updateItemQuantity('product-123', 5);
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('Failed to update');
    });
  });

  describe('removeItemFromCart', () => {
    it('should remove item from cart successfully with 204 status', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as Response);

      const { result } = renderHook(() => useCartActions(mockOnSuccess));

      let success = false;
      await act(async () => {
        success = await result.current.removeItemFromCart('product-123');
      });

      expect(success).toBe(true);
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });

    it('should remove item from cart successfully with ok status', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
      } as Response);

      const { result } = renderHook(() => useCartActions(mockOnSuccess));

      let success = false;
      await act(async () => {
        success = await result.current.removeItemFromCart('product-123');
      });

      expect(success).toBe(true);
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });

    it('should handle remove item error', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      const { result } = renderHook(() => useCartActions(mockOnSuccess));

      let success = false;
      await act(async () => {
        success = await result.current.removeItemFromCart('product-123');
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('Failed to remove item from cart');
    });
  });

  it('should set submitting state during operations', async () => {
    vi.mocked(global.fetch).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useCartActions(mockOnSuccess));

    act(() => {
      result.current.addItemToCart('product-123', 2);
    });

    expect(result.current.submitting).toBe(true);
  });
});

