import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// A more specific type for our errors
interface AppError extends Error {
  statusCode?: number;
}

/**
 * Centralized error handler.
 * Catches errors from async routes and formats them into a JSON response.
 */
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected error occurred.';

  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2025':
        statusCode = 404;
        message = `Resource not found. Details: ${err.meta?.cause || 'Record not found.'}`;
        break;
      case 'P2002':
        statusCode = 409; // Conflict
        message = `A record with this value already exists. (Field: ${err.meta?.target})`;
        break;
      case 'P2023':
        statusCode = 400;
        message = 'The provided ID is invalid.';
        break;
      default:
        statusCode = 500;
        message = 'A database error occurred.';
        break;
    }
  }

  res.status(statusCode).json({
    status: 'error',
    message,
  });
};

/**
 * Handles requests to routes that do not exist.
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'error',
    message: `The requested route '${req.originalUrl}' does not exist.`,
  });
};