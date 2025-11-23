import { useState } from 'react';
import { useProductActions } from './useProductActions';
import type { ProductResponseDTO } from '../../../application/product/dto/ProductDTOs';

export function useDeleteProduct(onSuccess: () => void) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<ProductResponseDTO | null>(null);
  const { deleteProduct, submitting } = useProductActions(onSuccess);

  const handleOpen = (productToDelete: ProductResponseDTO) => {
    setProduct(productToDelete);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setProduct(null);
  };

  const handleConfirm = async () => {
    if (!product) return;
    
    const success = await deleteProduct(product.id);
    if (success) {
      handleClose();
    }
  };

  return {
    open,
    productName: product?.name,
    submitting,
    handleOpen,
    handleClose,
    handleConfirm,
  };
}

