import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import type { CartResponseDTO } from '../../../application/cart/dto/CartDTOs';
import type { ProductResponseDTO } from '../../../application/product/dto/ProductDTOs';

interface CartItemCardProps {
  item: CartResponseDTO & { product?: ProductResponseDTO };
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuantity, setEditedQuantity] = useState(item.quantity);

  const handleEdit = () => {
    setEditedQuantity(item.quantity);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedQuantity > 0 && editedQuantity <= (item.product?.stock || 999)) {
      onUpdateQuantity(item.productId, editedQuantity);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedQuantity(item.quantity);
    setIsEditing(false);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    const quantity = parseInt(value) || 0;
    setEditedQuantity(quantity);
  };

  return (
    <Card
      sx={{
        mb: 2,
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {item.product?.name || `Product ID: ${item.productId}`}
            </Typography>
            {item.product?.description && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {item.product.description}
              </Typography>
            )}
            {item.product && (
              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                ₹{item.product.price.toFixed(2)}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              label="Quantity"
              type="number"
              value={isEditing ? editedQuantity : item.quantity}
              onChange={handleQuantityChange}
              disabled={!isEditing}
              slotProps={{
                htmlInput: {
                  min: 1,
                  max: item.product?.stock || 999,
                  step: 1,
                },
              }}
              sx={{ width: 100 }}
              size="small"
            />

            {!isEditing ? (
              <IconButton
                color="primary"
                onClick={handleEdit}
                aria-label="edit quantity"
                size="small"
              >
                <EditIcon />
              </IconButton>
            ) : (
              <>
                <IconButton
                  color="success"
                  onClick={handleSave}
                  aria-label="save quantity"
                  size="small"
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  color="warning"
                  onClick={handleCancel}
                  aria-label="cancel edit"
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              </>
            )}

            <IconButton
              color="error"
              onClick={() => onRemove(item.productId)}
              aria-label="remove from cart"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        
        {item.product && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Available Stock: {item.product.stock}
            </Typography>
            <Typography variant="h6" color="primary">
              Subtotal: ₹{(item.product.price * item.quantity).toFixed(2)}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

