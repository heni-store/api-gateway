import { AdminRole } from '@prisma/client';

export class AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    login: string;
    name: string;
    role: AdminRole;
  };
}
