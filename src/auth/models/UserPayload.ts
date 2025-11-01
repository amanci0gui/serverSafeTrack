import { Role } from '@prisma/client';

export interface UserPayload {
  sub: number;
  email: string;
  name: string;
  role: Role;
  iat?: number;
  exp?: number;
}
