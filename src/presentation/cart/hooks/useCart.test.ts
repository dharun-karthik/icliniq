import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCart } from './useCart';
import type { CartResponseDTO } from '../../../application/cart/dto/CartDTOs';
import type { ProductResponseDTO } from '../../../application/product/dto/ProductDTOs';

describe('useCart', () => {
  const mockCartItems: CartResponseDTO[] = [
    {
      id: 'cart-item-1',
      productId: 'product-1',
      quantity: 2,
    },
    {
      id: 'cart-item-2',
      productId: 'product-2',
      quantity: 1,
    },
  ];

  const mockProduct1: ProductResponseDTO = {
    id: 'product-1',
    name: 'Product 1',
    description: 'Description 1',
    price: 99.99,
    stock: 10,
  };

  const mockProduct2: ProductResponseDTO = {
    id: 'product-2',
    name: 'Product 2',
    description: 'Description 2',
    price: 49.99,
    stock: 5,
  };

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with loading state', () => {
    vi.mocked(global.fetch).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useCart());

    expect(result.current.loading).toBe(true);
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch cart items with product details', async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        json: async () => ({ success: true, data: mockCartItems }),
      } as Response)
      .mockResolvedValueOnce({
        json: async () => ({ success: true, data: mockProduct1 }),
      } as Response)
      .mockResolvedValueOnce({
        json: async () => ({ success: true, data: mockProduct2 }),
      } as Response);

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cartItems).toHaveLength(2);
    expect(result.current.cartItems[0].product).toEqual(mockProduct1);
    expect(result.current.cartItems[1].product).toEqual(mockProduct2);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch cart error', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => ({ success: false }),
    } as Response);

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cartItems).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch cart items');
  });

  it('should handle network error', async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cartItems).toEqual([]);
    expect(result.current.error).toBe('An error occurred while fetching cart items');
  });

  it('should handle product fetch failure gracefully', async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        json: async () => ({ success: true, data: mockCartItems }),
      } as Response)
      .mockRejectedValueOnce(new Error('Product fetch failed'))
      .mockResolvedValueOnce({
        json: async () => ({ success: true, data: mockProduct2 }),
      } as Response);

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cartItems).toHaveLength(2);
    expect(result.current.cartItems[0].product).toBeUndefined();
    expect(result.current.cartItems[1].product).toEqual(mockProduct2);
  });

  it('should refetch cart when refetch is called', async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        json: async () => ({ success: true, data: mockCartItems }),
      } as Response)
      .mockResolvedValueOnce({
        json: async () => ({ success: true, data: mockProduct1 }),
      } as Response)
      .mockResolvedValueOnce({
        json: async () => ({ success: true, data: mockProduct2 }),
      } as Response);

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cartItems).toHaveLength(2);

    // Setup for refetch
    vi.mocked(global.fetch).mockClear();
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => ({ success: true, data: [] }),
    } as Response);

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.cartItems).toEqual([]);
    });
  });
});

