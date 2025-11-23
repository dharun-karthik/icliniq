import { useState } from 'react';
import { useProductForm } from './useProductForm';
import { useProductActions } from './useProductActions';
import type { ProductResponseDTO } from '../../../application/product/dto/ProductDTOs';

export function useEditProduct(onSuccess: () => void) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<ProductResponseDTO | null>(null);
  const form = useProductForm();
  const { updateProduct, submitting, error } = useProductActions(onSuccess);

  const handleOpen = (productToEdit: ProductResponseDTO) => {
    setProduct(productToEdit);
    form.setFormDataValues({
      name: productToEdit.name,
      description: productToEdit.description,
      price: productToEdit.price.toString(),
      stock: productToEdit.stock.toString(),
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setProduct(null);
    form.resetForm();
  };

  const handleSubmit = async () => {
    if (!product) return;
    if (!form.validateForm()) return;
    
    const success = await updateProduct(product.id, form.formData);
    if (success) {
      handleClose();
    } else {
      form.setFormError(error || 'Failed to update product');
    }
  };

  return {
    open,
    formData: form.formData,
    formError: form.formError,
    submitting,
    handleOpen,
    handleClose,
    handleSubmit,
    handleInputChange: form.handleInputChange,
  };
}

