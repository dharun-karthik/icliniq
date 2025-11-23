import type { ProductId } from '../../product/value-objects/ProductId';
import type { CartItem } from '../entities/CartItem';
import type { ItemId } from '../value-objects/ItemId';

export interface ICartRepository {
  save(cart: CartItem): Promise<void>;
  findAll(): Promise<CartItem[]>;
  findByProductId(id: string): Promise<CartItem | null>;
  deleteByProductId(id: string): Promise<void>;
}

