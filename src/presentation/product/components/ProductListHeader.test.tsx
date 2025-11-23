import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductListHeader from './ProductListHeader';

describe('ProductListHeader', () => {
  const mockOnAddProduct = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the header title', () => {
    render(<ProductListHeader onAddProduct={mockOnAddProduct} />);

    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('should render Back button with correct href', () => {
    render(<ProductListHeader onAddProduct={mockOnAddProduct} />);

    const backButton = screen.getByRole('link');
    expect(backButton).toHaveAttribute('href', '/');
  });

  it('should render Add Product button', () => {
    render(<ProductListHeader onAddProduct={mockOnAddProduct} />);

    expect(screen.getByText('Add Product')).toBeInTheDocument();
  });

  it('should call onAddProduct when Add Product button is clicked', async () => {
    const user = userEvent.setup();

    render(<ProductListHeader onAddProduct={mockOnAddProduct} />);

    const addButton = screen.getByText('Add Product');
    await user.click(addButton);

    expect(mockOnAddProduct).toHaveBeenCalledTimes(1);
  });
});

