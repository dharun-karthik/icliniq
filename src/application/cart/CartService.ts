import type { ICartRepository } from '../../domain/cart/repositories/ICartRepository';
import type {
  AddItemToCartDTO,
  UpdateItemQuantityDTO,
  CartResponseDTO,
} from './dto/CartDTOs';
import { EntityNotFoundError } from '../../domain/shared/errors/DomainError';
import { CartItem } from '../../domain/cart/entities/CartItem';
import type { ProductService } from '../product/ProductService';

export class CartService {
  constructor(private readonly cartRepository: ICartRepository,
    private readonly productService: ProductService,
  ) { }

  async addItemToCart(dto: AddItemToCartDTO): Promise<CartResponseDTO> {
    const product = await this.productService.getProduct(dto.productId);
    if (!product) {
      throw new EntityNotFoundError('Product not found');
    }
    if (product.stock < dto.quantity) {
      throw new Error('Not enough stock');
    }

    const item = CartItem.create(dto.productId, dto.quantity);
    if (await this.cartRepository.findByProductId(item.getProductId().getValue())) {
      throw new Error('Item already exists in cart, try updating quantity');
    }
    await this.cartRepository.save(item);
    return this.toDTO(item);
  }

  async updateItemQuantity(dto: UpdateItemQuantityDTO): Promise<CartResponseDTO> {
    const cartItem = await this.cartRepository.findByProductId(dto.productId);

    if (!cartItem) {
      throw new EntityNotFoundError('Item not found in cart');
    }
    const product = await this.productService.getProduct(dto.productId);
    if (product.stock < dto.quantity) {
      throw new Error('Not enough stock');
    }

    const updated_item = CartItem.create(dto.productId, dto.quantity);
    await this.cartRepository.save(updated_item);

    return this.toDTO(updated_item);
  }

  async getAllCartItems(): Promise<CartResponseDTO[]> {
    const cartItems = await this.cartRepository.findAll();
    return cartItems.map(item => this.toDTO(item));
  }

  async removeItemFromCart(productId: string): Promise<void> {
    const cartItem = await this.cartRepository.findByProductId(productId);
    if (!cartItem) {
      throw new EntityNotFoundError('Item not found in cart');
    }
    await this.cartRepository.deleteByProductId(productId);
  }

  private toDTO(cart: CartItem): CartResponseDTO {
    const json = cart.toJSON();
    return {
      productId: json.productId,
      quantity: json.quantity,
    };
  }
}

