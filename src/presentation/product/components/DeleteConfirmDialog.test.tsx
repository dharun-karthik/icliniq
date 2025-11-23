import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteConfirmDialog from './DeleteConfirmDialog';

describe('DeleteConfirmDialog', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when open is false', () => {
    render(
      <DeleteConfirmDialog
        open={false}
        productName="Test Product"
        submitting={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.queryByText('Delete Product')).not.toBeInTheDocument();
  });

  it('should render when open is true', () => {
    render(
      <DeleteConfirmDialog
        open={true}
        productName="Test Product"
        submitting={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByText('Delete Product')).toBeInTheDocument();
  });

  it('should display product name in confirmation message', () => {
    render(
      <DeleteConfirmDialog
        open={true}
        productName="Test Product"
        submitting={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByText(/Test Product/)).toBeInTheDocument();
    expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument();
  });

  it('should call onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <DeleteConfirmDialog
        open={true}
        productName="Test Product"
        submitting={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm when Delete button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <DeleteConfirmDialog
        open={true}
        productName="Test Product"
        submitting={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('should disable buttons when submitting', () => {
    render(
      <DeleteConfirmDialog
        open={true}
        productName="Test Product"
        submitting={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    const deleteButton = screen.getByText('Deleting...');

    expect(cancelButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it('should show "Deleting..." text when submitting', () => {
    render(
      <DeleteConfirmDialog
        open={true}
        productName="Test Product"
        submitting={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByText('Deleting...')).toBeInTheDocument();
  });

  it('should show "Delete" text when not submitting', () => {
    render(
      <DeleteConfirmDialog
        open={true}
        productName="Test Product"
        submitting={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByRole('button', { name: /^delete$/i })).toBeInTheDocument();
  });
});

