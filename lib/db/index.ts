// lib/db/index.ts - Fixed version
import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/monitoring/logger";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Fix the log configuration
const createPrismaClient = () => {
  return new PrismaClient({
    log: [
      { level: "error", emit: "stdout" },
      { level: "info", emit: "stdout" },
      { level: "warn", emit: "stdout" },
    ],
  });
};

export const db = globalThis.prisma || createPrismaClient();

// Remove the problematic query logging for now - can be added later with proper typing
if (process.env.NODE_ENV === "development") {
  // Query logging can be enabled here with proper Prisma event types if needed
  console.log("Database client initialized for development");
}

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error("Database health check failed", { error });
    return false;
  }
}

// Database connection info
export async function getDatabaseInfo() {
  try {
    const result = await db.$queryRaw<
      Array<{ version: string }>
    >`SELECT VERSION() as version`;
    return result[0]?.version || "Unknown";
  } catch (error) {
    logger.error("Failed to get database info", { error });
    return "Error getting version";
  }
}

// lib/utils/ip.ts - Helper for getting IP address
import { NextRequest } from "next/server";

export function getClientIP(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback to connection remote address (may not be available in all environments)
  return "unknown";
}
