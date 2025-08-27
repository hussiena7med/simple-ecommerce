// Base application exception
export class AppException extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Not Found Exception (404)
export class NotFoundException extends AppException {
  constructor(resource: string, identifier?: string | number) {
    const message = identifier
      ? `${resource} with ID ${identifier} not found`
      : `${resource} not found`;
    super(message, 404);
  }
}

// Conflict Exception (409) - Resource already exists
export class ConflictException extends AppException {
  constructor(resource: string, field: string, value: string) {
    super(`${resource} with ${field} '${value}' already exists`, 409);
  }
}

// Bad Request Exception (400) - Invalid input
export class BadRequestException extends AppException {
  constructor(message: string) {
    super(message, 400);
  }
}

// Unprocessable Entity Exception (422) - Validation failed
export class UnprocessableEntityException extends AppException {
  constructor(message: string) {
    super(message, 422);
  }
}
