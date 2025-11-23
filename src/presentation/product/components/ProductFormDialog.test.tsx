import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductFormDialog from './ProductFormDialog';
import type { ProductFormData } from '../hooks/useProductForm';

describe('ProductFormDialog', () => {
  const mockFormData: ProductFormData = {
    name: '',
    description: '',
    price: '',
    stock: '',
  };

  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();
  const mockOnChange = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when open is false', () => {
    render(
      <ProductFormDialog
        open={false}
        title="Add Product"
        formData={mockFormData}
        error={null}
        submitting={false}
        submitLabel="Create"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChange={mockOnChange}
      />
    );

    expect(screen.queryByText('Add Product')).not.toBeInTheDocument();
  });

  it('should render when open is true', () => {
    render(
      <ProductFormDialog
        open={true}
        title="Add Product"
        formData={mockFormData}
        error={null}
        submitting={false}
        submitLabel="Create"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Add Product')).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    render(
      <ProductFormDialog
        open={true}
        title="Add Product"
        formData={mockFormData}
        error={null}
        submitting={false}
        submitLabel="Create"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/stock/i)).toBeInTheDocument();
  });

  it('should display form data values', () => {
    const filledFormData: ProductFormData = {
      name: 'Test Product',
      description: 'Test Description',
      price: '99.99',
      stock: '10',
    };

    render(
      <ProductFormDialog
        open={true}
        title="Edit Product"
        formData={filledFormData}
        error={null}
        submitting={false}
        submitLabel="Update"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('99.99')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });

  it('should call onChange when input values change', async () => {
    const user = userEvent.setup();
    
    render(
      <ProductFormDialog
        open={true}
        title="Add Product"
        formData={mockFormData}
        error={null}
        submitting={false}
        submitLabel="Create"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChange={mockOnChange}
      />
    );

    const nameInput = screen.getByLabelText(/product name/i);
    await user.type(nameInput, 'New Product');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should call onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <ProductFormDialog
        open={true}
        title="Add Product"
        formData={mockFormData}
        error={null}
        submitting={false}
        submitLabel="Create"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChange={mockOnChange}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onSubmit when submit button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ProductFormDialog
        open={true}
        title="Add Product"
        formData={mockFormData}
        error={null}
        submitting={false}
        submitLabel="Create"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChange={mockOnChange}
      />
    );

    const submitButton = screen.getByText('Create');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('should display error message when error is present', () => {
    render(
      <ProductFormDialog
        open={true}
        title="Add Product"
        formData={mockFormData}
        error="Failed to create product"
        submitting={false}
        submitLabel="Create"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Failed to create product')).toBeInTheDocument();
  });

  it('should disable submit button when submitting', () => {
    render(
      <ProductFormDialog
        open={true}
        title="Add Product"
        formData={mockFormData}
        error={null}
        submitting={true}
        submitLabel="Create"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChange={mockOnChange}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create/i });
    expect(submitButton).toBeDisabled();
  });

  it('should use custom title and submit label', () => {
    render(
      <ProductFormDialog
        open={true}
        title="Edit Product"
        formData={mockFormData}
        error={null}
        submitting={false}
        submitLabel="Update"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Edit Product')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });
});

