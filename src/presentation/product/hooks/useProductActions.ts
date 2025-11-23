import { useState } from 'react';
import type { CreateProductDTO, UpdateProductDTO } from '../../../application/product/dto/ProductDTOs';
import type { ProductFormData } from './useProductForm';

export function useProductActions(onSuccess: () => void) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (formData: ProductFormData) => {
    setError(null);
    setSubmitting(true);

    try {
      const dto: CreateProductDTO = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      const response = await fetch('/api/product', {
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
        setError(data.error?.message || 'Failed to create product');
        return false;
      }
    } catch (err) {
      setError('An error occurred while creating the product');
      console.error(err);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateProduct = async (productId: string, formData: ProductFormData) => {
    setError(null);
    setSubmitting(true);

    try {
      const dto: UpdateProductDTO = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      const response = await fetch(`/api/product/${productId}`, {
        method: 'PUT',
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
        setError(data.error?.message || 'Failed to update product');
        return false;
      }
    } catch (err) {
      setError('An error occurred while updating the product');
      console.error(err);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    setSubmitting(true);

    try {
      const response = await fetch(`/api/product/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onSuccess();
        return true;
      }
      return false;
    } catch (err) {
      console.error('An error occurred while deleting the product', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    submitting,
    error,
    setError,
  };
}

