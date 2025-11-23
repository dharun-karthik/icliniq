import type { IProductRepository } from '../../domain/product/repositories/IProductRepository';
import { Product } from '../../domain/product/entities/Product';
import { ProductId } from '../../domain/product/value-objects/ProductId';
import type { CreateProductDTO, ProductResponseDTO } from './dto/ProductDTOs';
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

    await this.productRepository.save(product);

    return this.toDTO(product);
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

