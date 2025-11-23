import { Box, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

interface ProductListHeaderProps {
  onAddProduct: () => void;
}

export default function ProductListHeader({ onAddProduct }: ProductListHeaderProps) {
  return (
    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        href="/"
        sx={{ textTransform: 'none' }}
      >
      </Button>
      <Typography variant="h3" component="h1" sx={{ flexGrow: 1 }}>
        Products
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddProduct}
        sx={{ textTransform: 'none' }}
      >
        Add Product
      </Button>
    </Box>
  );
}

