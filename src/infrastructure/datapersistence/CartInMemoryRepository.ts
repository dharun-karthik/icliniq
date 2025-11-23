import type { CartItem } from '../../domain/cart/entities/CartItem';
import type { ICartRepository } from '../../domain/cart/repositories/ICartRepository';
import type { ProductId } from '../../domain/product/value-objects/ProductId';

export class CartInMemoryRepository implements ICartRepository {
  private items: Map<string, CartItem> = new Map();

  async save(item: CartItem): Promise<void> {
    this.items.set(item.getProductId().getValue(), item);
  }

  async findAll(): Promise<CartItem[]> {
    return Array.from(this.items.values());
  }

  async findByProductId(id: string): Promise<CartItem | null> {
    return this.items.get(id) || null;
  }

  async deleteByProductId(id: string): Promise<void> {
    this.items.delete(id);
  }
}

