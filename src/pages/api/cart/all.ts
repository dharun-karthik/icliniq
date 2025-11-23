import type { APIRoute } from "astro";
import { getCartService } from "../../../lib/containers";
import { successResponse } from "../../../lib/api-responses";
import { withErrorHandler } from "../../../lib/middleware/error-handler";

export const prerender = false;

export const GET: APIRoute = withErrorHandler(async () => {
  const cartService = getCartService();
  const cart = await cartService.getAllCartItems();
  return successResponse(cart);
});

