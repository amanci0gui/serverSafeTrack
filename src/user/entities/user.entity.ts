import { Role } from "@prisma/client";

export class User {
  id?: number;
  email: string;
  password: string;
  name: string;
  active: boolean;
  role: Role;
}
