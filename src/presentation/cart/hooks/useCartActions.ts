import { useState } from 'react';
import type { AddItemToCartDTO, UpdateItemQuantityDTO } from '../../../application/cart/dto/CartDTOs';

export function useCartActions(onSuccess: () => void) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItemToCart = async (productId: string, quantity: number) => {
    setError(null);
    setSubmitting(true);

    try {
      const dto: AddItemToCartDTO = {
        productId,
        quantity,
      };

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
        return true;
      } else {
        setError(data.error?.message || 'Failed to add item to cart');
        return false;
      }
    } catch (err) {
      setError('An error occurred while adding item to cart');
      console.error(err);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateItemQuantity = async (productId: string, quantity: number) => {
    setError(null);
    setSubmitting(true);

    try {
      const dto: UpdateItemQuantityDTO = {
        productId,
        quantity,
      };

      const response = await fetch('/api/cart', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
        return true;
      } else {
        setError(data.error?.message || 'Failed to update item quantity');
        return false;
      }
    } catch (err) {
      setError('An error occurred while updating item quantity');
      console.error(err);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const removeItemFromCart = async (productId: string) => {
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok || response.status === 204) {
        onSuccess();
        return true;
      } else {
        setError('Failed to remove item from cart');
        return false;
      }
    } catch (err) {
      setError('An error occurred while removing item from cart');
      console.error(err);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    submitting,
    error,
  };
}

