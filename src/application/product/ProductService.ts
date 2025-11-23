import type { IProductRepository } from '../../domain/product/repositories/IProductRepository';
import { Product } from '../../domain/product/entities/Product';
import { ProductId } from '../../domain/product/value-objects/ProductId';
import type { CreateProductDTO, UpdateProductDTO, ProductResponseDTO } from './dto/ProductDTOs';
import { EntityNotFoundError } from '../../domain/shared/errors/DomainError';


export class ProductService {
  constructor(private readonly productRepository: IProductRepository) {}

  async createProduct(dto: CreateProductDTO): Promise<ProductResponseDTO> {
    const product = Product.create(
      dto.name,
      dto.description ?? '',
      dto.price,
      dto.stock,
    );

    if (await this.productRepository.findById(ProductId.create(product.getId()))) {
      throw new Error('Product already exists');
    }

    await this.productRepository.save(product);

    return this.toDTO(product);
  }


  async updateProduct(id: string, dto: UpdateProductDTO): Promise<ProductResponseDTO> {
    const product = await this.productRepository.findById(ProductId.create(id));

    if (!product) {
      throw new EntityNotFoundError('Product not found');
    }

    const updated_product = Product.reconstitute(
      id,
      dto.name ?? product.getName(),
      dto.description ?? product.getDescription(),
      dto.price ?? product.getPrice(),
      dto.stock ?? product.getStock(),
    );

    await this.productRepository.save(updated_product);

    return this.toDTO(updated_product);
  }

  async getProduct(id: string): Promise<ProductResponseDTO> {
    const product = await this.productRepository.findById(ProductId.create(id));

    if (!product) {
      throw new EntityNotFoundError('Product not found');
    }

    return this.toDTO(product);
  }

  async getAllProducts(): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.findAll();
    return products.map(product => this.toDTO(product));
  }

  private toDTO(product: Product): ProductResponseDTO {
    const json = product.toJSON();
    return {
      id: json.id,
      name: json.name,
      description: json.description,
      price: json.price,
      stock: json.stock,
    };
  }
}

