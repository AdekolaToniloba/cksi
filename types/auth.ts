// types/auth.ts
import { User } from "./database";
import { Role } from "@prisma/client";

export interface AuthUser
  extends Pick<User, "id" | "email" | "name" | "role"> {}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface AuthSession {
  user: AuthUser;
  expires: string;
}

export interface JWT {
  id: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
}
