import type { APIRoute } from "astro";
import { getProductService } from "../../../lib/containers";
import { ProductIdParamsSchema } from "../../../lib/validations/product-validation-schema";
import { successResponse } from "../../../lib/api-responses";
import { withParamsValidation } from "../../../lib/middleware/validation";

export const prerender = false;

export const GET: APIRoute = withParamsValidation(
    ProductIdParamsSchema,
    async (_context, validatedParams) => {
        const productService = getProductService();
        const product = await productService.getProduct(validatedParams.id);
        return successResponse(product);
    }
);


