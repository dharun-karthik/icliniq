import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from './ProductCard';
import type { ProductResponseDTO } from '../../../application/product/dto/ProductDTOs';

describe('ProductCard', () => {
  const mockProduct: ProductResponseDTO = {
    id: 'test-id-123',
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    stock: 10,
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render product information correctly', () => {
    render(
      <ProductCard
        product={mockProduct}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('₹99.99')).toBeInTheDocument();
    expect(screen.getByText('Stock: 10')).toBeInTheDocument();
  });

  it('should display success chip when stock is available', () => {
    render(
      <ProductCard
        product={mockProduct}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const stockChip = screen.getByText('Stock: 10');
    expect(stockChip).toBeInTheDocument();
  });

  it('should display error chip when stock is zero', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    
    render(
      <ProductCard
        product={outOfStockProduct}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Stock: 0')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <ProductCard
        product={mockProduct}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getAllByRole('button')[0];
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockProduct);
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <ProductCard
        product={mockProduct}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getAllByRole('button')[1];
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockProduct);
  });

  it('should format price with two decimal places', () => {
    const productWithPrice = { ...mockProduct, price: 100 };
    
    render(
      <ProductCard
        product={productWithPrice}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('₹100.00')).toBeInTheDocument();
  });

  it('should render edit and delete buttons', () => {
    render(
      <ProductCard
        product={mockProduct}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });
});

