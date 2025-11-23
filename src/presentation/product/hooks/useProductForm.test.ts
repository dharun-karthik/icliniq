import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProductForm } from './useProductForm';

describe('useProductForm', () => {
  it('should initialize with empty form data', () => {
    const { result } = renderHook(() => useProductForm());

    expect(result.current.formData).toEqual({
      name: '',
      description: '',
      price: '',
      stock: '',
    });
    expect(result.current.formError).toBeNull();
  });

  it('should update form data on input change', () => {
    const { result } = renderHook(() => useProductForm());

    act(() => {
      result.current.handleInputChange({
        target: { name: 'name', value: 'Test Product' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.name).toBe('Test Product');
  });

  it('should update multiple fields', () => {
    const { result } = renderHook(() => useProductForm());

    act(() => {
      result.current.handleInputChange({
        target: { name: 'name', value: 'Test Product' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleInputChange({
        target: { name: 'price', value: '99.99' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.name).toBe('Test Product');
    expect(result.current.formData.price).toBe('99.99');
  });

  it('should validate form and return false for empty name', () => {
    const { result } = renderHook(() => useProductForm());

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.formError).toBe('Product name is required');
  });

  it('should validate form and return false for invalid price', () => {
    const { result } = renderHook(() => useProductForm());

    act(() => {
      result.current.setFormDataValues({
        name: 'Test Product',
        description: 'Test',
        price: 'invalid',
        stock: '10',
      });
    });

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.formError).toBe('Price must be greater than 0');
  });

  it('should validate form and return false for negative price', () => {
    const { result } = renderHook(() => useProductForm());

    act(() => {
      result.current.setFormDataValues({
        name: 'Test Product',
        description: 'Test',
        price: '-10',
        stock: '10',
      });
    });

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.formError).toBe('Price must be greater than 0');
  });

  it('should validate form and return false for invalid stock', () => {
    const { result } = renderHook(() => useProductForm());

    act(() => {
      result.current.setFormDataValues({
        name: 'Test Product',
        description: 'Test',
        price: '99.99',
        stock: '',
      });
    });

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.formError).toBe('Stock must be 0 or greater');
  });

  it('should validate form and return true for valid data', () => {
    const { result } = renderHook(() => useProductForm());

    act(() => {
      result.current.setFormDataValues({
        name: 'Test Product',
        description: 'Test Description',
        price: '99.99',
        stock: '10',
      });
    });

    let isValid = false;
    act(() => {
      isValid = result.current.validateForm();
    });

    expect(isValid).toBe(true);
    expect(result.current.formError).toBeNull();
  });

  it('should reset form to initial state', () => {
    const { result } = renderHook(() => useProductForm());

    act(() => {
      result.current.setFormDataValues({
        name: 'Test Product',
        description: 'Test',
        price: '99.99',
        stock: '10',
      });
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual({
      name: '',
      description: '',
      price: '',
      stock: '',
    });
    expect(result.current.formError).toBeNull();
  });
});

