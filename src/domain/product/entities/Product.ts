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

    static reconstitute(
        id: string,
        name: string,
        description: string,
        price: number,
        stockQuantity: number,
    ): Product {
        return new Product(
            ProductId.create(id),
            ProductName.create(name),
            ProductDescription.create(description),
            Money.create(price),
            Stock.create(stockQuantity)
        );
    }

    getName(): string {
        return this.name.getValue();
    }
    getDescription(): string {
        return this.description.getValue();
    }
    getPrice(): number {
        return this.price.getAmount();
    }
    getStock(): number {
        return this.stock.getQuantity();
    }
    getId(): string {
        return this.id.getValue();
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

