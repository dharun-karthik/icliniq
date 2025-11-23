import { ProductService } from "../application/product/ProductService";
import { ProductInMemoryReporsitory } from "../infrastructure/datapersistence/ProductInMemoryReporsitory";

let productRepository: ProductInMemoryReporsitory;
let productService: ProductService;

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

