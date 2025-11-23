import { Grid, Alert } from '@mui/material';
import ProductCard from './ProductCard';
import type { ProductResponseDTO } from '../../../application/product/dto/ProductDTOs';

interface ProductGridProps {
  products: ProductResponseDTO[];
  onEdit: (product: ProductResponseDTO) => void;
  onDelete: (product: ProductResponseDTO) => void;
}

export default function ProductGrid({ products, onEdit, onDelete }: ProductGridProps) {
  if (products.length === 0) {
    return <Alert severity="info">No products available</Alert>;
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <ProductCard
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Grid>
      ))}
    </Grid>
  );
}

