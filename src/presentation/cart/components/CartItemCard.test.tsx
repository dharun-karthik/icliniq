import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartItemCard from './CartItemCard';
import type { CartResponseDTO } from '../../../application/cart/dto/CartDTOs';
import type { ProductResponseDTO } from '../../../application/product/dto/ProductDTOs';

describe('CartItemCard', () => {
  const mockProduct: ProductResponseDTO = {
    id: 'product-123',
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    stock: 10,
  };

  const mockCartItem: CartResponseDTO & { product?: ProductResponseDTO } = {
    id: 'cart-item-123',
    productId: 'product-123',
    quantity: 2,
    product: mockProduct,
  };

  const mockOnUpdateQuantity = vi.fn();
  const mockOnRemove = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render cart item with product information', () => {
    render(
      <CartItemCard
        item={mockCartItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('₹99.99')).toBeInTheDocument();
  });

  it('should display quantity in disabled field by default', () => {
    render(
      <CartItemCard
        item={mockCartItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );

    const quantityInput = screen.getByDisplayValue('2') as HTMLInputElement;
    expect(quantityInput).toBeDisabled();
  });

  it('should enable quantity field when edit button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <CartItemCard
        item={mockCartItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    const quantityInput = screen.getByDisplayValue('2') as HTMLInputElement;
    expect(quantityInput).not.toBeDisabled();
  });

  it('should show save and cancel buttons when editing', async () => {
    const user = userEvent.setup();
    
    render(
      <CartItemCard
        item={mockCartItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should call onUpdateQuantity when save button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <CartItemCard
        item={mockCartItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    const quantityInput = screen.getByDisplayValue('2');
    await user.clear(quantityInput);
    await user.type(quantityInput, '5');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('product-123', 5);
  });

  it('should revert changes when cancel button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <CartItemCard
        item={mockCartItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    const quantityInput = screen.getByDisplayValue('2');
    await user.clear(quantityInput);
    await user.type(quantityInput, '5');

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnUpdateQuantity).not.toHaveBeenCalled();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  it('should call onRemove when delete button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <CartItemCard
        item={mockCartItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /remove from cart/i });
    await user.click(deleteButton);

    expect(mockOnRemove).toHaveBeenCalledWith('product-123');
  });
});

