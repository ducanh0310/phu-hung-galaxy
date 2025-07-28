import prisma from '../../prisma.service.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../../middlewares.js';

class AuthService {
  async login(username: string, password: string): Promise<string> {
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      throw new AppError('Invalid username or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid username or password', 401);
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined.');
      throw new AppError('Internal server error: JWT secret is missing.', 500);
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    return token;
  }
}

export const authService = new AuthService(); 