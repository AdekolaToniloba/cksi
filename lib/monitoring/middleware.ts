// lib/monitoring/middleware.ts - Fixed version
import { NextRequest, NextResponse } from "next/server";
import { logger } from "./logger";
import { metrics } from "./metrics";
import { getClientIP } from "@/lib/utils/ip";

export function createLoggingMiddleware() {
  return async (request: NextRequest) => {
    const start = Date.now();
    const { method, url } = request;
    const ip = getClientIP(request); // Use helper function
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Log request
    logger.info("Request received", {
      method,
      url,
      ip,
      userAgent,
    });

    // Continue to the next middleware/handler
    const response = NextResponse.next();

    // Log response
    const duration = Date.now() - start;
    const status = response.status;

    logger.info("Request completed", {
      method,
      url,
      status,
      duration,
    });

    // Collect metrics
    metrics.collect("response_time", duration, "ms", {
      method,
      status: status.toString(),
    });

    return response;
  };
}

// Rate limiting utility
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; remainingRequests: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  const current = rateLimitMap.get(identifier) || { count: 0, lastReset: now };

  // Reset window if it's expired
  if (current.lastReset < windowStart) {
    current.count = 0;
    current.lastReset = now;
  }

  current.count++;
  rateLimitMap.set(identifier, current);

  const success = current.count <= limit;
  const remainingRequests = Math.max(0, limit - current.count);

  if (!success) {
    logger.warn("Rate limit exceeded", {
      identifier,
      count: current.count,
      limit,
    });
  }

  return { success, remainingRequests };
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value.lastReset > oneHour) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes
