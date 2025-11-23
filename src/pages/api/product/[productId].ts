import type { APIRoute } from "astro";
import { getProductService } from "../../../lib/containers";
import { ProductIdParamsSchema, UpdateProductSchema } from "../../../lib/validations/product-validation-schema";
import { successResponse, noContentResponse } from "../../../lib/api-responses";
import { withParamsValidation, withBodyValidation } from "../../../lib/middleware/validation";
import type { UpdateProductDTO } from "../../../application/product/dto/ProductDTOs";

export const prerender = false;

export const GET: APIRoute = withParamsValidation(
    ProductIdParamsSchema,
    async (_context, validatedParams) => {
        const productService = getProductService();
        const product = await productService.getProduct(validatedParams.productId);
        return successResponse(product);
    }
);

export const PUT: APIRoute = withParamsValidation(
    ProductIdParamsSchema,
    (context, validatedParams) => withBodyValidation(
        UpdateProductSchema,
        async (_context, validatedData: UpdateProductDTO) => {
            const productService = getProductService();
            const product = await productService.updateProduct(validatedParams.productId, validatedData);
            return successResponse(product);
        }
    )(context)
);

export const DELETE: APIRoute = withParamsValidation(
    ProductIdParamsSchema,
    async (_context, validatedParams) => {
        const productService = getProductService();
        await productService.deleteProduct(validatedParams.productId);
        return noContentResponse();
    }
);

