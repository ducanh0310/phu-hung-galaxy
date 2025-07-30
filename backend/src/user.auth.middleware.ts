import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './middlewares.js';

interface UserJwtPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    export interface Request {
      user?: UserJwtPayload;
    }
  }
}

export const protectUser = (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined.');
      throw new AppError('Internal server error: JWT secret is missing.', 500);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserJwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
};