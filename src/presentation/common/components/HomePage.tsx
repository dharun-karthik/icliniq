import { Box, Button, Container } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function HomePage() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 4,
        }}
      >
        <Button
          variant="contained"
          size="large"
          startIcon={<InventoryIcon />}
          href="/products"
          sx={{
            width: '300px',
            height: '120px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            borderRadius: '12px',
            textTransform: 'none',
          }}
        >
          Products
        </Button>
        
        <Button
          variant="contained"
          size="large"
          startIcon={<ShoppingCartIcon />}
          href="/cart"
          sx={{
            width: '300px',
            height: '120px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            borderRadius: '12px',
            textTransform: 'none',
          }}
        >
          Cart
        </Button>
      </Box>
    </Container>
  );
}

