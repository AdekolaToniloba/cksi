// app/api/admin/health/route.ts - Fixed version
import { NextRequest, NextResponse } from "next/server";
import { getHealthStatus } from "@/lib/monitoring/health";
import { rateLimit } from "@/lib/monitoring/middleware";
import { logger } from "@/lib/monitoring/logger";
import { getClientIP } from "@/lib/utils/ip";

export async function GET(request: NextRequest) {
  const ip = getClientIP(request); // Use helper function

  // Rate limiting - 10 requests per minute
  const { success, remainingRequests } = rateLimit(ip, 10, 60 * 1000);

  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": remainingRequests.toString(),
          "Retry-After": "60",
        },
      }
    );
  }

  try {
    const healthStatus = await getHealthStatus();

    logger.info("Health check requested", {
      ip,
      status: healthStatus.status,
      timestamp: healthStatus.timestamp,
    });

    const statusCode = healthStatus.status === "healthy" ? 200 : 503;

    return NextResponse.json(healthStatus, {
      status: statusCode,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-RateLimit-Remaining": remainingRequests.toString(),
      },
    });
  } catch (error) {
    logger.error("Health check failed", { error, ip });

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  }
}
