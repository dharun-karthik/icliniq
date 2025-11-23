import { Product } from '../../domain/product/entities/Product';
import type { IProductRepository } from '../../domain/product/repositories/IProductRepository';
import { ProductId } from '../../domain/product/value-objects/ProductId';


export class ProductInMemoryReporsitory implements IProductRepository {
    private products: Map<string, Product> = new Map();

    async save(product: Product): Promise<void> {
        const id = product.toJSON().id;
        if (this.products.has(id)) {
            throw new Error('Product with id already exists');
        }
        this.products.set(id, product);
    }

    async findById(id: ProductId): Promise<Product | null> {
        return this.products.get(id.getValue()) || null;
    }

    async findAll(): Promise<Product[]> {
        return Array.from(this.products.values());
    }
}

