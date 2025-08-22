// lib/db/auth.ts
import { db } from "./index";
import { User, CreateUserInput, Role } from "@/types";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/monitoring/logger";

export class AuthService {
  static async createUser(data: CreateUserInput): Promise<User> {
    try {
      const hashedPassword = data.password
        ? await bcrypt.hash(data.password, 12)
        : null;

      const user = await db.user.create({
        data: {
          ...data,
          password: hashedPassword,
          role: data.role || Role.USER,
        },
      });

      logger.info("User created", { userId: user.id, email: user.email });
      return user as User;
    } catch (error) {
      logger.error("Failed to create user", { error, email: data.email });
      throw new Error("Failed to create user");
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await db.user.findUnique({
        where: { email },
      });

      return user as User | null;
    } catch (error) {
      logger.error("Failed to get user by email", { error, email });
      return null;
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const user = await db.user.findUnique({
        where: { id },
      });

      return user as User | null;
    } catch (error) {
      logger.error("Failed to get user by id", { error, userId: id });
      return null;
    }
  }

  static async verifyPassword(user: User, password: string): Promise<boolean> {
    try {
      if (!user.password) return false;
      return await bcrypt.compare(password, user.password);
    } catch (error) {
      logger.error("Failed to verify password", { error, userId: user.id });
      return false;
    }
  }

  static async updatePassword(
    userId: string,
    newPassword: string
  ): Promise<void> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await db.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      logger.info("Password updated", { userId });
    } catch (error) {
      logger.error("Failed to update password", { error, userId });
      throw new Error("Failed to update password");
    }
  }

  static async isAdmin(userId: string): Promise<boolean> {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      return user?.role === Role.ADMIN;
    } catch (error) {
      logger.error("Failed to check admin status", { error, userId });
      return false;
    }
  }
}
