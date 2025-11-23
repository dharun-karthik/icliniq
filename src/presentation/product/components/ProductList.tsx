import { Box, Container, CircularProgress, Alert } from '@mui/material';
import { useProducts } from '../hooks/useProducts';
import { useCreateProduct } from '../hooks/useCreateProduct';
import { useEditProduct } from '../hooks/useEditProduct';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import ProductListHeader from './ProductListHeader';
import ProductGrid from './ProductGrid';
import ProductFormDialog from './ProductFormDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';

export default function ProductList() {
  const { products, loading, error, refetch } = useProducts();

  const createProduct = useCreateProduct(refetch);
  const editProduct = useEditProduct(refetch);
  const deleteProduct = useDeleteProduct(refetch);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <ProductListHeader onAddProduct={createProduct.handleOpen} />
        <ProductGrid
          products={products}
          onEdit={editProduct.handleOpen}
          onDelete={deleteProduct.handleOpen}
        />
      </Box>

      <ProductFormDialog
        open={createProduct.open}
        title="Add New Product"
        formData={createProduct.formData}
        error={createProduct.formError}
        submitting={createProduct.submitting}
        submitLabel="Create Product"
        onClose={createProduct.handleClose}
        onSubmit={createProduct.handleSubmit}
        onChange={createProduct.handleInputChange}
      />

      <ProductFormDialog
        open={editProduct.open}
        title="Edit Product"
        formData={editProduct.formData}
        error={editProduct.formError}
        submitting={editProduct.submitting}
        submitLabel="Update Product"
        onClose={editProduct.handleClose}
        onSubmit={editProduct.handleSubmit}
        onChange={editProduct.handleInputChange}
      />

      <DeleteConfirmDialog
        open={deleteProduct.open}
        productName={deleteProduct.productName}
        submitting={deleteProduct.submitting}
        onClose={deleteProduct.handleClose}
        onConfirm={deleteProduct.handleConfirm}
      />
    </Container>
  );
}

