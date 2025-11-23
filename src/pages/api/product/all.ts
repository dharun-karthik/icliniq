import type { APIRoute } from "astro";
import { getProductService } from "../../../lib/containers";
import { successResponse } from "../../../lib/api-responses";
import { withErrorHandler } from "../../../lib/middleware/error-handler";

export const prerender = false;

export const GET: APIRoute = withErrorHandler(async () => {
  const productService = getProductService();
  const products = await productService.getAllProducts();
  return successResponse(products);
});