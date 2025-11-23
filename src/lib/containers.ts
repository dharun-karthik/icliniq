import { ProductService } from "../application/product/ProductService";
import { ProductInMemoryReporsitory } from "../infrastructure/datapersistence/ProductInMemoryReporsitory";
import { CartService } from "../application/cart/CartService";
import { CartInMemoryRepository } from "../infrastructure/datapersistence/CartInMemoryRepository";

let productRepository: ProductInMemoryReporsitory;
let productService: ProductService;
let cartRepository: CartInMemoryRepository;
let cartService: CartService;

export function getProductService(): ProductService {
  if (!productService) {
    productService = new ProductService(getProductRepository());
  }
  return productService;
}

export function getProductRepository(): ProductInMemoryReporsitory {
  if (!productRepository) {
    productRepository = new ProductInMemoryReporsitory();
  }
  return productRepository;
}

export function getCartService(): CartService {
  if (!cartService) {
    cartService = new CartService(getCartRepository(), getProductService());
  }
  return cartService;
}

export function getCartRepository(): CartInMemoryRepository {
  if (!cartRepository) {
    cartRepository = new CartInMemoryRepository();
  }
  return cartRepository;
}

