
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function successResponse<T>(data: T): Response {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function createdResponse<T>(data: T): Response {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  return new Response(JSON.stringify(response), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function errorResponse(message: string, status: number = 400, code?: string): Response {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      message,
      code,
    },
  };
  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function notFoundResponse(message: string = 'Resource not found'): Response {
  return errorResponse(message, 404, 'NOT_FOUND');
}

export function badRequestResponse(message: string): Response {
  return errorResponse(message, 400, 'BAD_REQUEST');
}

export function internalErrorResponse(message: string = 'Internal server error'): Response {
  return errorResponse(message, 500, 'INTERNAL_ERROR');
}

