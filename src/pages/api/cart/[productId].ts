import type { APIRoute } from "astro";
import { getCartService } from "../../../lib/containers";
import { withParamsValidation } from "../../../lib/middleware/validation";
import { ProductIdParamsSchema } from "../../../lib/validations/product-validation-schema";
import { noContentResponse } from "../../../lib/api-responses";

export const prerender = false;

export const DELETE: APIRoute = withParamsValidation(
  ProductIdParamsSchema,
  async (_context, validatedParams) => {
    const cartService = getCartService();
    await cartService.removeItemFromCart(validatedParams.productId);
    return noContentResponse();
  }
);
