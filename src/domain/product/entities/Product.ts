import { Money } from "../value-objects/Money";
import { ProductDescription } from "../value-objects/ProductDescription";
import { ProductId } from "../value-objects/ProductId";
import { ProductName } from "../value-objects/ProductName";
import { Stock } from "../value-objects/Stock";

export class Product {
    private constructor(
        private readonly id: ProductId,
        private name: ProductName,
        private description: ProductDescription,
        private price: Money,
        private stock: Stock
    ) { }

    static create(
        name: string,
        description: string,
        price: number,
        stockQuantity: number,
    ): Product {
        return new Product(
            ProductId.create(),
            ProductName.create(name),
            ProductDescription.create(description),
            Money.create(price),
            Stock.create(stockQuantity)
        );
    }

    toJSON() {
        return {
            id: this.id.getValue(),
            name: this.name.getValue(),
            description: this.description.getValue(),
            price: this.price.getAmount(),
            stock: this.stock.getQuantity(),
        };
    }
}

