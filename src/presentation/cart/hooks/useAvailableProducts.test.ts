import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAvailableProducts } from './useAvailableProducts';
import type { ProductResponseDTO } from '../../../application/product/dto/ProductDTOs';

describe('useAvailableProducts', () => {
  const mockProducts: ProductResponseDTO[] = [
    {
      id: 'product-1',
      name: 'Product 1',
      description: 'Description 1',
      price: 99.99,
      stock: 10,
    },
    {
      id: 'product-2',
      name: 'Product 2',
      description: 'Description 2',
      price: 49.99,
      stock: 5,
    },
    {
      id: 'product-3',
      name: 'Product 3',
      description: 'Description 3',
      price: 29.99,
      stock: 15,
    },
  ];

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with loading state', () => {
    vi.mocked(global.fetch).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useAvailableProducts([]));

    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch all products when cart is empty', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => ({ success: true, data: mockProducts }),
    } as Response);

    const { result } = renderHook(() => useAvailableProducts([]));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBeNull();
  });

  it('should filter out products already in cart', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => ({ success: true, data: mockProducts }),
    } as Response);

    const cartProductIds = ['product-1', 'product-3'];
    const { result } = renderHook(() => useAvailableProducts(cartProductIds));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].id).toBe('product-2');
  });

  it('should return empty array when all products are in cart', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => ({ success: true, data: mockProducts }),
    } as Response);

    const cartProductIds = ['product-1', 'product-2', 'product-3'];
    const { result } = renderHook(() => useAvailableProducts(cartProductIds));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
  });

  it('should handle fetch error', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => ({ success: false }),
    } as Response);

    const { result } = renderHook(() => useAvailableProducts([]));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch products');
  });

  it('should handle network error', async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useAvailableProducts([]));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe('An error occurred while fetching products');
  });

  it('should refetch when cartProductIds change', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      json: async () => ({ success: true, data: mockProducts }),
    } as Response);

    const { result, rerender } = renderHook(
      ({ ids }) => useAvailableProducts(ids),
      { initialProps: { ids: [] } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toHaveLength(3);

    // Change cart product IDs
    rerender({ ids: ['product-1'] });

    await waitFor(() => {
      expect(result.current.products).toHaveLength(2);
    });
  });
});

