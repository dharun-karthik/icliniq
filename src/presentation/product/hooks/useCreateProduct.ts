import { useState } from 'react';
import { useProductForm } from './useProductForm';
import { useProductActions } from './useProductActions';

export function useCreateProduct(onSuccess: () => void) {
  const [open, setOpen] = useState(false);
  const form = useProductForm();
  const { createProduct, submitting, error } = useProductActions(onSuccess);

  const handleOpen = () => {
    form.resetForm();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    form.resetForm();
  };

  const handleSubmit = async () => {
    if (!form.validateForm()) return;
    
    const success = await createProduct(form.formData);
    if (success) {
      handleClose();
    } else {
      form.setFormError(error || 'Failed to create product');
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

