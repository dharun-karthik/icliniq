import { useState } from 'react';

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  price: '',
  stock: '',
};

export function useProductForm() {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For stock field, only allow integers
    if (name === 'stock') {
      const intValue = value.replace(/[^\d]/g, '');
      setFormData((prev) => ({
        ...prev,
        [name]: intValue,
      }));
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setFormError('Product name is required');
      return false;
    }
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      setFormError('Price must be greater than 0');
      return false;
    }
    const stock = parseInt(formData.stock);
    if (!formData.stock || isNaN(stock) || stock < 0) {
      setFormError('Stock must be 0 or greater');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFormError(null);
  };

  const setFormDataValues = (data: ProductFormData) => {
    setFormData(data);
  };

  return {
    formData,
    formError,
    submitting,
    setFormError,
    setSubmitting,
    handleInputChange,
    validateForm,
    resetForm,
    setFormDataValues,
  };
}

