import { Product } from '../../domain/product/entities/Product';
import type { IProductRepository } from '../../domain/product/repositories/IProductRepository';
import { ProductId } from '../../domain/product/value-objects/ProductId';


export class ProductInMemoryReporsitory implements IProductRepository {
    private products: Map<string, Product> = new Map();

    async save(product: Product): Promise<void> {
        const id = product.toJSON().id;
        this.products.set(id, product);
    }

    async findById(id: ProductId): Promise<Product | null> {
        return this.products.get(id.getValue()) || null;
    }

    async findAll(): Promise<Product[]> {
        return Array.from(this.products.values());
    }

    async delete(id: ProductId): Promise<void> {
        this.products.delete(id.getValue());
    }
}

