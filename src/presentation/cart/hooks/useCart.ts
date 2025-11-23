import { useState, useEffect } from 'react';
import type { CartResponseDTO } from '../../../application/cart/dto/CartDTOs';
import type { ProductResponseDTO } from '../../../application/product/dto/ProductDTOs';

interface CartItemWithProduct extends CartResponseDTO {
  product?: ProductResponseDTO;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart/all');
      const data: ApiResponse<CartResponseDTO[]> = await response.json();
      
      if (data.success) {
        // Fetch product details for each cart item
        const itemsWithProducts = await Promise.all(
          data.data.map(async (item) => {
            try {
              const productResponse = await fetch(`/api/product/${item.productId}`);
              const productData: ApiResponse<ProductResponseDTO> = await productResponse.json();
              
              if (productData.success) {
                return { ...item, product: productData.data };
              }
              return item;
            } catch (err) {
              console.error(`Failed to fetch product ${item.productId}`, err);
              return item;
            }
          })
        );
        
        setCartItems(itemsWithProducts);
        setError(null);
      } else {
        setError('Failed to fetch cart items');
      }
    } catch (err) {
      setError('An error occurred while fetching cart items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cartItems,
    loading,
    error,
    refetch: fetchCart,
  };
}

