import { useState, useEffect } from 'react';
import type { ProductResponseDTO } from '../../../application/product/dto/ProductDTOs';

interface ApiResponse {
  success: boolean;
  data: ProductResponseDTO[];
}

export function useAvailableProducts(cartProductIds: string[]) {
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/product/all');
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        // Filter out products that are already in cart
        const availableProducts = data.data.filter(
          product => !cartProductIds.includes(product.id)
        );
        setProducts(availableProducts);
        setError(null);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('An error occurred while fetching products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [cartProductIds.join(',')]);

  return {
    products,
    loading,
    error,
  };
}

