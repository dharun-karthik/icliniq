import { Product } from '../entities/Product';
import { ProductId } from '../value-objects/ProductId';

export interface IProductRepository {

  save(product: Product): Promise<void>;

  findById(id: ProductId): Promise<Product | null>;

  findAll(): Promise<Product[]>;

  delete(id: ProductId): Promise<void>;

}

