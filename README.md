# E-commerce Platform

A modern e-commerce platform built with Astro, React, TypeScript, and Material-UI, following Domain-Driven Design (DDD) principles.

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Setup](#-setup)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Docker Deployment](#-docker-deployment)
- [Available Commands](#-available-commands)

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) v5.5.1 with SSR (Server-Side Rendering)
- **UI Library**: React 18
- **Component Library**: Material-UI (MUI) v6
- **Language**: TypeScript
- **Testing**: Vitest + React Testing Library
- **Validation**: Zod
- **Architecture**: Domain-Driven Design (DDD)
- **Adapter**: @astrojs/node (standalone mode)

## 📋 Prerequisites

- **Node.js**: 20+
- **npm**: 9+ 
- **Docker** (optional): For containerized deployment

## 🚀 Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd icliniq_final
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:4321`

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```text
icliniq_final/
├── src/
│   ├── application/              # Application Layer (Services & DTOs)
│   │   ├── cart/
│   │   │   ├── CartService.ts
│   │   │   └── dto/
│   │   └── product/
│   │       ├── ProductService.ts
│   │       └── dto/
│   │
│   ├── domain/                   # Domain Layer (Entities & Value Objects)
│   │   ├── cart/
│   │   │   ├── entities/
│   │   │   │   └── CartItem.ts
│   │   │   └── value-objects/
│   │   │       ├── ItemId.ts
│   │   │       └── Quantity.ts
│   │   └── product/
│   │       ├── entities/
│   │       │   └── Product.ts
│   │       └── value-objects/
│   │           ├── ProductId.ts
│   │           ├── ProductName.ts
│   │           ├── Money.ts
│   │           ├── Stock.ts
│   │           └── ProductDescription.ts
│   │
│   ├── infrastructure/           # Infrastructure Layer (Data Persistence)
│   │   └── datapersistence/
│   │       ├── CartInMemoryRepository.ts
│   │       └── ProductInMemoryRepository.ts
│   │
│   ├── presentation/             # Presentation Layer (UI Components & Hooks)
│   │   ├── cart/
│   │   │   ├── components/
│   │   │   │   ├── CartList.tsx
│   │   │   │   ├── CartItemCard.tsx
│   │   │   │   ├── AddToCartDialog.tsx
│   │   │   │   └── index.ts
│   │   │   └── hooks/
│   │   │       ├── useCart.ts
│   │   │       ├── useCartActions.ts
│   │   │       ├── useAvailableProducts.ts
│   │   │       └── index.ts
│   │   ├── product/
│   │   │   ├── components/
│   │   │   │   ├── ProductList.tsx
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   ├── ProductFormDialog.tsx
│   │   │   │   ├── ProductListHeader.tsx
│   │   │   │   ├── DeleteConfirmDialog.tsx
│   │   │   │   └── index.ts
│   │   │   └── hooks/
│   │   │       ├── useProducts.ts
│   │   │       ├── useCreateProduct.ts
│   │   │       ├── useEditProduct.ts
│   │   │       ├── useDeleteProduct.ts
│   │   │       ├── useProductActions.ts
│   │   │       ├── useProductForm.ts
│   │   │       └── index.ts
│   │   └── common/
│   │       └── components/
│   │           ├── HomePage.tsx
│   │           └── index.ts
│   │
│   ├── pages/                    # Astro Pages & API Routes
│   │   ├── api/
│   │   │   ├── cart/
│   │   │   │   ├── index.ts          # POST, PATCH /api/cart
│   │   │   │   ├── all.ts            # GET /api/cart
│   │   │   │   └── [productId].ts    # DELETE /api/cart/:productId
│   │   │   └── product/
│   │   │       ├── index.ts          # POST /api/product
│   │   │       ├── all.ts            # GET /api/product
│   │   │       └── [productId].ts    # GET, PUT, DELETE /api/product/:id
│   │   ├── index.astro               # Home page
│   │   ├── products.astro            # Products page
│   │   └── cart.astro                # Cart page
│   │
│   ├── lib/                      # Shared Utilities & Middleware
│   │   ├── containers.ts             # Dependency injection container
│   │   ├── middleware/
│   │   │   ├── error-handler.ts
│   │   │   └── validation.ts
│   │   └── validations/
│   │       └── product-validation-schema.ts
│   │
│   └── test/                     # Test Configuration & Integration Tests
│       ├── setup.ts
│       └── integration/
│           ├── cart-api.integration.test.ts
│           └── product-api.integration.test.ts
│
├── public/                       # Static Assets
├── dist/                         # Build Output (generated)
├── Dockerfile                    # Docker configuration
├── docker-compose.yml            # Docker Compose configuration
├── astro.config.mjs              # Astro configuration
├── vitest.config.ts              # Vitest configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies & scripts
```

## 🏗️ Architecture

This project follows **Domain-Driven Design (DDD)** with clean architecture principles:

### Layered Architecture

```
┌─────────────────────────────────────────────────────────┐
│         Presentation Layer (UI Components & Hooks)      │
│  - React Components (Product, Cart, Common)             │
│  - Custom Hooks (State Management, API Calls)           │
└────────────────────┬────────────────────────────────────┘
                     │ depends on ↓
┌────────────────────┴────────────────────────────────────┐
│         Application Layer (Services & DTOs)             │
│  - ProductService, CartService                          │
│  - Data Transfer Objects (DTOs)                         │
└────────────────────┬────────────────────────────────────┘
                     │ depends on ↓
┌────────────────────┴────────────────────────────────────┐
│         Domain Layer (Business Logic)                   │
│  - Entities: Product, CartItem                          │
│  - Value Objects: ProductId, Money, Stock, Quantity     │
│  - Repository Interfaces                                │
└────────────────────┬────────────────────────────────────┘
                     │ implemented by ↓
┌────────────────────┴────────────────────────────────────┐
│         Infrastructure Layer (Data Persistence)         │
│  - ProductInMemoryRepository                            │
│  - CartInMemoryRepository                               │
└─────────────────────────────────────────────────────────┘
```

### Domain Layer

**Entities** (Business Objects with Identity):
- `Product`: Represents a product with id, name, description, price, and stock
- `CartItem`: Represents an item in the shopping cart

**Value Objects** (Immutable Objects without Identity):
- `ProductId`: Unique identifier for products
- `ProductName`: Product name with validation (1-100 characters)
- `ProductDescription`: Product description (max 500 characters)
- `Money`: Price with validation (must be positive)
- `Stock`: Inventory quantity (non-negative integer)
- `ItemId`: Unique identifier for cart items
- `Quantity`: Cart item quantity (positive integer)

**Repository Interfaces**:
- Define contracts for data access
- Implemented by infrastructure layer

### Application Layer

**Services**:
- `ProductService`: Handles product CRUD operations
  - `createProduct(dto)`: Create new product
  - `updateProduct(id, dto)`: Update existing product
  - `deleteProduct(id)`: Delete product
  - `getProductById(id)`: Retrieve product by ID
  - `getAllProducts()`: Retrieve all products

- `CartService`: Manages shopping cart operations
  - `addItemToCart(dto)`: Add item to cart
  - `updateItemQuantity(productId, quantity)`: Update quantity
  - `removeItemFromCart(productId)`: Remove item
  - `getCartItem(productId)`: Get specific cart item
  - `getAllCartItems()`: Get all cart items

**DTOs** (Data Transfer Objects):
- `CreateProductDTO`: Data for creating products
- `UpdateProductDTO`: Data for updating products
- `AddItemToCartDTO`: Data for adding cart items
- `UpdateItemQuantityDTO`: Data for updating quantities

### Infrastructure Layer

**In-Memory Repositories**:
- `ProductInMemoryRepository`: Stores products in memory
- `CartInMemoryRepository`: Stores cart items in memory

> **Note**: In production, these would be replaced with database implementations (PostgreSQL, MongoDB, etc.)

### Presentation Layer

**Components** (Organized by Domain):

*Product Components*:
- `ProductList`: Main product listing page
- `ProductCard`: Individual product display
- `ProductGrid`: Grid layout for products
- `ProductFormDialog`: Create/Edit product form
- `ProductListHeader`: Page header with actions
- `DeleteConfirmDialog`: Confirmation dialog for deletion

*Cart Components*:
- `CartList`: Shopping cart display
- `CartItemCard`: Individual cart item with edit functionality
- `AddToCartDialog`: Dialog for adding products to cart

*Common Components*:
- `HomePage`: Landing page with navigation

**Hooks** (Custom React Hooks):

*Product Hooks*:
- `useProducts()`: Fetch and manage products list
- `useCreateProduct()`: Create new product
- `useEditProduct()`: Edit existing product
- `useDeleteProduct()`: Delete product
- `useProductActions()`: Combined CRUD actions
- `useProductForm()`: Form state and validation

*Cart Hooks*:
- `useCart()`: Fetch cart items with product details
- `useCartActions()`: Add, update, remove cart items
- `useAvailableProducts()`: Fetch products not in cart

## 📡 API Documentation

All API routes follow RESTful conventions and return JSON responses.

### Product API

#### Get All Products
```http
GET /api/product
```

**Response** (200 OK):
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "stock": 10
    }
  ]
}
```

#### Get Product by ID
```http
GET /api/product/:id
```

**Response** (200 OK):
```json
{
  "product": {
    "id": "uuid",
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "stock": 10
  }
}
```

**Error** (404 Not Found):
```json
{
  "error": "Product not found"
}
```

#### Create Product
```http
POST /api/product
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": "99.99",
  "stock": "10"
}
```

**Validation Rules**:
- `name`: Required, 1-100 characters
- `description`: Optional, max 500 characters
- `price`: Required, must be positive number
- `stock`: Required, must be non-negative integer

**Response** (201 Created):
```json
{
  "product": {
    "id": "uuid",
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "stock": 10
  }
}
```

**Error** (400 Bad Request):
```json
{
  "error": "Validation error message"
}
```

#### Update Product
```http
PUT /api/product/:id
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "price": "149.99",
  "stock": "5"
}
```

**Response** (200 OK):
```json
{
  "product": {
    "id": "uuid",
    "name": "Updated Name",
    "description": "Updated description",
    "price": 149.99,
    "stock": 5
  }
}
```

#### Delete Product
```http
DELETE /api/product/:id
```

**Response** (200 OK):
```json
{
  "message": "Product deleted successfully"
}
```

### Cart API

#### Get All Cart Items
```http
GET /api/cart
```

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "uuid",
      "productId": "product-uuid",
      "quantity": 2
    }
  ]
}
```

#### Add Item to Cart
```http
POST /api/cart
Content-Type: application/json
```

**Request Body**:
```json
{
  "productId": "product-uuid",
  "quantity": "2"
}
```

**Validation Rules**:
- `productId`: Required, must be valid UUID
- `quantity`: Required, must be positive integer

**Response** (201 Created):
```json
{
  "item": {
    "id": "uuid",
    "productId": "product-uuid",
    "quantity": 2
  }
}
```

**Error** (400 Bad Request):
```json
{
  "error": "Item already exists in cart, try updating quantity"
}
```

#### Update Cart Item Quantity
```http
PATCH /api/cart
Content-Type: application/json
```

**Request Body**:
```json
{
  "productId": "product-uuid",
  "quantity": "5"
}
```

**Response** (200 OK):
```json
{
  "item": {
    "id": "uuid",
    "productId": "product-uuid",
    "quantity": 5
  }
}
```

#### Remove Item from Cart
```http
DELETE /api/cart/:productId
```

**Response** (200 OK):
```json
{
  "message": "Item removed from cart successfully"
}
```

### Error Responses

All API endpoints may return the following error responses:

**400 Bad Request**:
```json
{
  "error": "Validation error message"
}
```

**404 Not Found**:
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Internal server error"
}
```

## 🧪 Testing

The project has comprehensive test coverage with **333 tests** across **30 test files**.

### Test Structure

```
src/
├── presentation/
│   ├── cart/
│   │   ├── components/*.test.tsx      # Component tests
│   │   └── hooks/*.test.ts            # Hook tests
│   ├── product/
│   │   ├── components/*.test.tsx
│   │   └── hooks/*.test.ts
│   └── common/
│       └── components/*.test.tsx
├── domain/
│   ├── cart/
│   │   ├── entities/*.test.ts         # Entity tests
│   │   └── value-objects/*.test.ts    # Value object tests
│   └── product/
│       ├── entities/*.test.ts
│       └── value-objects/*.test.ts
├── application/
│   ├── cart/*.test.ts                 # Service tests
│   └── product/*.test.ts
├── infrastructure/
│   └── datapersistence/*.test.ts      # Repository tests
├── lib/
│   ├── middleware/*.test.ts           # Middleware tests
│   └── containers.test.ts
└── test/
    └── integration/*.test.ts          # API integration tests
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- product

```

### Test Coverage Summary

| Layer | Test Files | Tests | Status |
|-------|-----------|-------|--------|
| **Presentation** | 18 | 126 | ✅ 100% |
| **Domain** | 8 | 102 | ✅ 100% |
| **Application** | 2 | 32 | ✅ 100% |
| **Infrastructure** | 2 | 20 | ✅ 100% |
| **Integration** | 2 | 43 | ✅ 100% |
| **Middleware** | 2 | 33 | ✅ 100% |
| **Total** | **30** | **333** | **✅ 100%** |

### Testing Tools

- **Vitest**: Fast unit test framework
- **React Testing Library**: Component testing utilities

## 🐳 Docker Deployment

### Quick Start with Docker Compose

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

The application will be available at `http://localhost:3000`

### Manual Docker Build

```bash
# Build the image
docker build -t icliniq-ecommerce .

# Run the container
docker run -d -p 3000:3000 --name icliniq-ecommerce icliniq-ecommerce

# View logs
docker logs -f icliniq-ecommerce

# Stop the container
docker stop icliniq-ecommerce
```

### Docker Configuration

The Dockerfile uses **multi-stage builds** for optimization:

1. **Builder Stage**: Installs dependencies and builds the application
2. **Runner Stage**: Creates minimal production image with only necessary files

**Image Details**:
- Base: `node:20-alpine`
- Size: Optimized with multi-stage build
- Port: 3000
- Environment: Production

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `3000` |

**Example**:
```bash
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  icliniq-ecommerce
```

## 🧞 Available Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm test` | Run all tests |
| `npm test -- --watch` | Run tests in watch mode |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:coverage` | Generate test coverage report |
| `npm run astro ...` | Run Astro CLI commands |
| `npm run astro -- --help` | Get help with Astro CLI |

