import type { APIRoute } from "astro";
import { withBodyValidation } from "../../../lib/middleware/validation";
import { CreateProductSchema } from "../../../lib/validations/product-validation-schema";
import type { CreateProductDTO } from "../../../application/product/dto/ProductDTOs";
import { getProductService } from "../../../lib/containers";
import { createdResponse } from "../../../lib/api-responses";


export const prerender = false;

export const POST: APIRoute = withBodyValidation(
    CreateProductSchema,
    async (_context, validatedData: CreateProductDTO) => {
        const productService = getProductService();
        const product = await productService.createProduct(validatedData);
        return createdResponse(product);
    }
);