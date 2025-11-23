import { ProductId } from '../../product/value-objects/ProductId';
import { Quantity } from '../value-objects/Quantity';

export class CartItem {
  private constructor(
    private readonly productId: ProductId,
    private quantity: Quantity
  ) { }

  static create(productId: string, quantity: number): CartItem {
    return new CartItem(
      ProductId.create(productId),
      Quantity.create(quantity)
    );
  }

  getProductId(): ProductId {
    return this.productId;
  }

  getQuantity(): Quantity {
    return this.quantity;
  }


  toJSON() {
    return {
      productId: this.productId.getValue(),
      quantity: this.quantity.getValue(),
    };
  }
}

