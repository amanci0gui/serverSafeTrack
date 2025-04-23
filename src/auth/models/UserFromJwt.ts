import { Role } from "@prisma/client";

export interface UserFromJwt {
  id: number;
  email: string;
  name: string;
  role: Role;
}