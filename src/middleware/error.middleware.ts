import { Request, Response, NextFunction } from "express";
import { AppException } from "../utils/exceptions";

export interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

// Global error handling middleware
export const errorHandler = (
  err: CustomError | AppException,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Handle our custom AppException classes
  if (err instanceof AppException) {
    error.statusCode = err.statusCode;
    error.message = err.message;
  }
  // Mongoose bad ObjectId
  else if (err.name === "CastError") {
    const message = "Resource not found";
    error.statusCode = 404;
    error.message = message;
  }
  // Mongoose duplicate key
  else if (err.name === "MongoError" && (err as any).code === 11000) {
    const message = "Duplicate field value entered";
    error.statusCode = 400;
    error.message = message;
  }
  // Mongoose validation error
  else if (err.name === "ValidationError") {
    const message = Object.values((err as any).errors)
      .map((val: any) => val.message)
      .join(", ");
    error.statusCode = 400;
    error.message = message;
  }
  // Sequelize validation error
  else if (err.name === "SequelizeValidationError") {
    const message = (err as any).errors.map((e: any) => e.message).join(", ");
    error.statusCode = 400;
    error.message = message;
  }

  // Sequelize unique constraint error
  if (err.name === "SequelizeUniqueConstraintError") {
    const message = "Resource already exists";
    error.statusCode = 400;
    error.message = message;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
};

// Handle 404 errors
export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new Error(`Not found - ${req.originalUrl}`) as CustomError;
  error.statusCode = 404;
  next(error);
};
