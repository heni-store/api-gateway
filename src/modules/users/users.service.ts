import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import type { TUserPublic } from '@shared/types';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<TUserPublic | null>;
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

  findById(id: string): Promise<TUserPublic | null> {
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

  create(email: string, passwordHash: string): Promise<TUserPublic> {
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
