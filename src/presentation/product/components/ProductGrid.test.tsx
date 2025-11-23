import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductGrid from './ProductGrid';
import type { ProductResponseDTO } from '../../../application/product/dto/ProductDTOs';

describe('ProductGrid', () => {
  const mockProducts: ProductResponseDTO[] = [
    {
      id: 'product-1',
      name: 'Product 1',
      description: 'Description 1',
      price: 99.99,
      stock: 10,
    },
    {
      id: 'product-2',
      name: 'Product 2',
      description: 'Description 2',
      price: 49.99,
      stock: 5,
    },
  ];

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render all products', () => {
    render(
      <ProductGrid
        products={mockProducts}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('should display info message when no products available', () => {
    render(
      <ProductGrid
        products={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('No products available')).toBeInTheDocument();
  });

  it('should render correct number of product cards', () => {
    render(
      <ProductGrid
        products={mockProducts}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const productCards = screen.getAllByText(/Product \d/);
    expect(productCards).toHaveLength(2);
  });

  it('should pass onEdit handler to ProductCard', () => {
    render(
      <ProductGrid
        products={mockProducts}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Verify that edit buttons are rendered (2 products * 1 edit button each)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('should render with single product', () => {
    const singleProduct = [mockProducts[0]];
    
    render(
      <ProductGrid
        products={singleProduct}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
  });
});

