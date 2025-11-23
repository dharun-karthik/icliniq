import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from './useProducts';
import type { ProductResponseDTO } from '../../../application/product/dto/ProductDTOs';

describe('useProducts', () => {
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
  ];

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with loading state', () => {
    vi.mocked(global.fetch).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useProducts());

    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch products successfully', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => ({ success: true, data: mockProducts }),
    } as Response);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => ({ success: false }),
    } as Response);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch products');
  });

  it('should handle network error', async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe('An error occurred while fetching products');
  });

  it('should refetch products when refetch is called', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      json: async () => ({ success: true, data: mockProducts }),
    } as Response);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);

    // Clear the mock and set up new response
    vi.mocked(global.fetch).mockClear();
    const updatedProducts = [...mockProducts, {
      id: 'product-3',
      name: 'Product 3',
      description: 'Description 3',
      price: 29.99,
      stock: 15,
    }];

    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => ({ success: true, data: updatedProducts }),
    } as Response);

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.products).toEqual(updatedProducts);
    });
  });
});

