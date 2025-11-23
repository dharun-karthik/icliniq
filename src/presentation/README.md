# Presentation Layer

This directory contains the presentation layer of the application, organized by domain following Domain-Driven Design (DDD) principles.

## Structure

```
presentation/
├── product/           # Product domain presentation
│   ├── components/    # React components for product features
│   │   ├── ProductList.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFormDialog.tsx
│   │   ├── ProductListHeader.tsx
│   │   ├── DeleteConfirmDialog.tsx
│   │   └── index.ts   # Barrel export
│   └── hooks/         # React hooks for product features
│       ├── useProducts.ts
│       ├── useCreateProduct.ts
│       ├── useEditProduct.ts
│       ├── useDeleteProduct.ts
│       ├── useProductActions.ts
│       ├── useProductForm.ts
│       └── index.ts   # Barrel export
│
├── cart/              # Cart domain presentation
│   ├── components/    # React components for cart features
│   │   ├── CartList.tsx
│   │   ├── CartItemCard.tsx
│   │   ├── AddToCartDialog.tsx
│   │   └── index.ts   # Barrel export
│   └── hooks/         # React hooks for cart features
│       ├── useCart.ts
│       ├── useCartActions.ts
│       ├── useAvailableProducts.ts
│       └── index.ts   # Barrel export
│
└── common/            # Shared/common presentation components
    └── components/    # Shared React components
        ├── HomePage.tsx
        └── index.ts   # Barrel export
```

## Design Principles

### 1. Domain-Driven Organization
- Each domain (product, cart) has its own directory
- Components and hooks are co-located with their domain
- Common/shared components are in the `common` directory

### 2. Separation of Concerns
- **Components**: UI presentation and user interaction
- **Hooks**: Business logic, state management, and API calls
- Components should be as "dumb" as possible, delegating logic to hooks

### 3. Dependency Direction
```
Presentation Layer (UI Components & Hooks)
    ↓ depends on
Application Layer (Services & DTOs)
    ↓ depends on
Domain Layer (Entities, Value Objects, Repositories)
```

### 4. Barrel Exports
Each directory has an `index.ts` file for clean imports:

```typescript
// Instead of:
import ProductList from '../presentation/product/components/ProductList';
import ProductCard from '../presentation/product/components/ProductCard';

// You can use:
import { ProductList, ProductCard } from '../presentation/product/components';
```

## Usage Examples

### Importing Components
```typescript
// From Astro pages
import { ProductList } from '../presentation/product/components';
import { CartList } from '../presentation/cart/components';
import { HomePage } from '../presentation/common/components';
```

### Importing Hooks
```typescript
// In components
import { useProducts, useCreateProduct } from '../hooks';
import { useCart, useCartActions } from '../../cart/hooks';
```

## Guidelines

1. **Keep components focused**: Each component should have a single responsibility
2. **Use hooks for logic**: Extract complex logic into custom hooks
3. **Type safety**: Always use TypeScript types from the application/domain layers
4. **No direct domain access**: Presentation layer should only interact with the application layer
5. **Reusability**: Common components should be truly reusable across domains

## Testing

- Component tests should be co-located with components (e.g., `ProductCard.test.tsx`)
- Hook tests should be co-located with hooks (e.g., `useProducts.test.ts`)
- Use React Testing Library for component tests
- Use `@testing-library/react-hooks` for hook tests

