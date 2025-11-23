import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useCart } from '../hooks/useCart';
import { useCartActions } from '../hooks/useCartActions';
import { useAvailableProducts } from '../hooks/useAvailableProducts';
import CartItemCard from './CartItemCard';
import AddToCartDialog from './AddToCartDialog';

export default function CartList() {
  const { cartItems, loading, error, refetch } = useCart();
  const cartActions = useCartActions(refetch);
  const cartProductIds = cartItems.map(item => item.productId);
  const { products: availableProducts, loading: productsLoading, error: productsError } = useAvailableProducts(cartProductIds);
  
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    await cartActions.updateItemQuantity(productId, quantity);
  };

  const handleRemoveItem = async (productId: string) => {
    await cartActions.removeItemFromCart(productId);
  };

  const handleAddToCart = async (productId: string, quantity: number) => {
    const success = await cartActions.addItemToCart(productId, quantity);
    return success;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (item.product) {
        return total + (item.product.price * item.quantity);
      }
      return total;
    }, 0);
  };

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
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              href="/"
            >
            </Button>
            <Typography variant="h4" component="h1">
              Shopping Cart
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddShoppingCartIcon />}
            onClick={() => setShowAddDialog(true)}
          >
            Show All Items
          </Button>
        </Box>

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <Alert severity="info">
            Your cart is empty. Click "Show All Items" to add products!
          </Alert>
        ) : (
          <>
            <Box sx={{ mb: 4 }}>
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </Box>

            {/* Total */}
            <Paper sx={{ p: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">
                  Total Items: {cartItems.length}
                </Typography>
                <Typography variant="h4">
                  Total: ₹{calculateTotal().toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          </>
        )}
      </Box>

      {/* Add to Cart Dialog */}
      <AddToCartDialog
        open={showAddDialog}
        products={availableProducts}
        loading={productsLoading}
        error={productsError}
        onClose={() => setShowAddDialog(false)}
        onAddToCart={handleAddToCart}
      />
    </Container>
  );
}

