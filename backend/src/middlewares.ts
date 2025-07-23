import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AnyZodObject, ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Middleware to validate request body, query, and params against a Zod schema.
 */
export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: error.flatten().fieldErrors,
      });
    }
    return next(error);
  }
};

/**
 * Centralized error handler.
 * Catches errors from async routes and formats them into a JSON response.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);

  let statusCode = 500;
  let message = 'An unexpected error occurred.';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof PrismaClientKnownRequestError) {
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
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `The requested route '${req.originalUrl}' does not exist.`,
  });
};
