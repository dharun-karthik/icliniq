import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
} from '@mui/material';
import type { ProductFormData } from '../hooks/useProductForm';

interface ProductFormDialogProps {
  open: boolean;
  title: string;
  formData: ProductFormData;
  error: string | null;
  submitting: boolean;
  submitLabel: string;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProductFormDialog({
  open,
  title,
  formData,
  error,
  submitting,
  submitLabel,
  onClose,
  onSubmit,
  onChange,
}: ProductFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={onChange}
            required
            fullWidth
            autoFocus
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={onChange}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={onChange}
            required
            fullWidth
            slotProps={{
              htmlInput: { min: 0, step: 0.01 }
            }}
          />
          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={onChange}
            required
            fullWidth
            slotProps={{
              htmlInput: { min: 0, step: 1 }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={submitting}
        >
          {submitting ? `${submitLabel}...` : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

