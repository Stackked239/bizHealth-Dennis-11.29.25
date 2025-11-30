/**
 * Custom error classes for the application
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class TransformationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 'TRANSFORMATION_ERROR', 500, { field });
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'DATABASE_ERROR', 500, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`, 'NOT_FOUND', 404, { resource, id });
  }
}

export class BatchAPIError extends AppError {
  constructor(message: string, code: string, details?: unknown) {
    super(message, code, 500, details);
  }
}

export class OrchestrationError extends AppError {
  constructor(message: string, phase: string, details?: unknown) {
    super(message, 'ORCHESTRATION_ERROR', 500, { phase, ...details });
  }
}

/**
 * Type guard to check if error is AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Format error for logging
 */
export function formatError(error: unknown): Record<string, unknown> {
  if (isAppError(error)) {
    return {
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
      stack: error.stack,
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
  };
}
