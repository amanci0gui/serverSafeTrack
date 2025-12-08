import { Role } from '@prisma/client';

export interface UserPayload {
  sub: number;
  email: string;
  name: string;
  role: Role;
  bairroId: number | null;
  iat?: number;
  exp?: number;
}
