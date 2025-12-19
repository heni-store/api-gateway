import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

type UserPublic = Omit<User, 'passwordHash'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<UserPublic | null>;
  findByEmail(email: string, withPassword: true): Promise<User | null>;

  async findByEmail(email: string, withPassword = false) {
    if (withPassword) {
      return this.prisma.user.findUnique({
        where: { email },
      });
    }

    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        createdAt: true,
      },
    });
  }

  findById(id: string): Promise<UserPublic | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        createdAt: true,
      },
    });
  }

  create(email: string, passwordHash: string): Promise<UserPublic> {
    return this.prisma.user.create({
      data: { email, passwordHash },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        createdAt: true,
      },
    });
  }
}
