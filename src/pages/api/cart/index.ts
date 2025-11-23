import type { APIRoute } from 'astro';
import { getCartService } from '../../../lib/containers';
import { withBodyValidation } from '../../../lib/middleware/validation';
import { AddItemToCartSchema, UpdateItemQuantitySchema } from '../../../lib/validations/cart-validation-schema';
import { successResponse, createdResponse, noContentResponse } from '../../../lib/api-responses';
import type { AddItemToCartDTO, UpdateItemQuantityDTO } from '../../../application/cart/dto/CartDTOs';

export const prerender = false;

export const POST: APIRoute = withBodyValidation(
  AddItemToCartSchema,
  async (_context, validatedData: AddItemToCartDTO) => {
    const cartService = getCartService();
    const cart = await cartService.addItemToCart(validatedData);
    return createdResponse(cart);
  }
);

export const PATCH: APIRoute = withBodyValidation(
  UpdateItemQuantitySchema,
  async (_context, validatedData: UpdateItemQuantityDTO) => {
    const cartService = getCartService();
    const cart = await cartService.updateItemQuantity(validatedData);
    return successResponse(cart);
  }
);


