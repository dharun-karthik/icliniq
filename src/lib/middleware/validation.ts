import type { APIContext } from "astro";
import type { ZodSchema } from "zod";
import { badRequestResponse } from "../api-responses";
import { withErrorHandler } from "./error-handler";

export function withBodyValidation<T>(
  schema: ZodSchema<T>,
  handler: (context: APIContext, validatedData: T) => Promise<Response> | Response
) {
  return withErrorHandler(async (context: APIContext): Promise<Response> => {
    try {
      const body = await context.request.json();

      const validationResult = schema.safeParse(body);

      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return badRequestResponse(
          `Validation failed: ${errors.map(e => e.message).join(', ')}`
        );
      }

      return await handler(context, validationResult.data);
    } catch (error) {
      if (error instanceof SyntaxError) {
        return badRequestResponse("Invalid JSON in request body");
      }
      throw error;
    }
  });
}


export function withParamsValidation<T>(
  schema: ZodSchema<T>,
  handler: (context: APIContext, validatedParams: T) => Promise<Response> | Response
) {
  return withErrorHandler(async (context: APIContext): Promise<Response> => {
    const validationResult = schema.safeParse(context.params);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return badRequestResponse(
        `Invalid parameters: ${errors.map(e => e.message).join(', ')}`
      );
    }

    return await handler(context, validationResult.data);
  });
}

