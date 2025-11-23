import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import type { ProductResponseDTO } from '../../../application/product/dto/ProductDTOs';

interface AddToCartDialogProps {
  open: boolean;
  products: ProductResponseDTO[];
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onAddToCart: (productId: string, quantity: number) => Promise<boolean>;
}

export default function AddToCartDialog({
  open,
  products,
  loading,
  error,
  onClose,
  onAddToCart,
}: AddToCartDialogProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  const handleQuantityChange = (productId: string, value: string) => {
    const intValue = value.replace(/[^\d]/g, '');
    const quantity = parseInt(intValue) || 0;
    setQuantities(prev => ({ ...prev, [productId]: quantity }));
  };

  const handleAddToCart = async (product: ProductResponseDTO) => {
    const quantity = quantities[product.id] || 1;
    
    if (quantity <= 0) {
      setAddError('Quantity must be greater than 0');
      return;
    }
    
    if (quantity > product.stock) {
      setAddError(`Only ${product.stock} items available in stock`);
      return;
    }

    setAddError(null);
    setSubmitting(product.id);
    
    const success = await onAddToCart(product.id, quantity);
    
    if (success) {
      // Reset quantity for this product
      setQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[product.id];
        return newQuantities;
      });
    }
    
    setSubmitting(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Items to Cart</DialogTitle>
      <DialogContent>
        {addError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setAddError(null)}>
            {addError}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Alert severity="info">All products are already in your cart!</Alert>
        ) : (
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid item xs={12} key={product.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.description}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          ₹{product.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Stock: {product.stock}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                          label="Quantity"
                          type="number"
                          value={quantities[product.id] || 1}
                          onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                          slotProps={{
                            htmlInput: {
                              min: 1,
                              max: product.stock,
                              step: 1,
                            },
                          }}
                          sx={{ width: 100 }}
                          size="small"
                        />
                        
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAddToCart(product)}
                          disabled={submitting === product.id}
                        >
                          {submitting === product.id ? 'Adding...' : 'Add to Cart'}
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

