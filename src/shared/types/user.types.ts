import { User } from '@prisma/client';

export type TUserPublic = Omit<User, 'passwordHash'>;
