import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AppError } from '../../middlewares.js';
import prisma from '../../prisma.service.js';

type UserCreateData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'> & { password: string };

class UserService {
  async createUser(data: UserCreateData) {
    const { email, password, name } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const userService = new UserService();