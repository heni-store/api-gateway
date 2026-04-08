import { Prisma } from '@prisma/client';

// Casts an unknown value to Prisma.InputJsonValue for safe usage in Json fields.
// Prisma expects InputJsonValue, while incoming data is untyped (unknown).
// This helper centralizes the cast and avoids repetitive assertions in services.
export const toJson = (value: unknown): Prisma.InputJsonValue => {
  return value as Prisma.InputJsonValue;
};
