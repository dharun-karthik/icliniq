import type { APIContext } from "astro";
import {
  badRequestResponse,
  internalErrorResponse,
  notFoundResponse,
} from "../api-responses";
import {
  DomainValidationError,
  EntityNotFoundError,
} from "../../domain/shared/errors/DomainError";


export function withErrorHandler(
  handler: (context: APIContext) => Promise<Response> | Response
) {
  return async (context: APIContext): Promise<Response> => {
    try {
      return await handler(context);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return notFoundResponse(error.message);
      }

      if (error instanceof DomainValidationError) {
        return badRequestResponse(error.message);
      }

      console.error("Unexpected error in API route:", error);

      return internalErrorResponse();
    }
  };
}

