import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('should render Products button', () => {
    render(<HomePage />);

    const productsButton = screen.getByText('Products');
    expect(productsButton).toBeInTheDocument();
  });

  it('should render Cart button', () => {
    render(<HomePage />);

    const cartButton = screen.getByText('Cart');
    expect(cartButton).toBeInTheDocument();
  });

  it('should have correct href for Products button', () => {
    render(<HomePage />);

    const productsButton = screen.getByText('Products').closest('a');
    expect(productsButton).toHaveAttribute('href', '/products');
  });

  it('should have correct href for Cart button', () => {
    render(<HomePage />);

    const cartButton = screen.getByText('Cart').closest('a');
    expect(cartButton).toHaveAttribute('href', '/cart');
  });

  it('should render both navigation buttons', () => {
    render(<HomePage />);

    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
  });
});

