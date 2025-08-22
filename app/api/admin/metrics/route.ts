// app/api/admin/metrics/route.ts - Fixed version
import { NextRequest, NextResponse } from "next/server";
import { metrics } from "@/lib/monitoring/metrics";
import { rateLimit } from "@/lib/monitoring/middleware";
import { logger } from "@/lib/monitoring/logger";
import { getClientIP } from "@/lib/utils/ip";

export async function GET(request: NextRequest) {
  const ip = getClientIP(request); // Use helper function
  const url = new URL(request.url);
  const metricName = url.searchParams.get("name");
  const limit = parseInt(url.searchParams.get("limit") || "100");

  // Rate limiting
  const { success, remainingRequests } = rateLimit(ip, 20, 60 * 1000);

  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const metricsData = metrics.getMetrics(metricName || undefined, limit);

    logger.info("Metrics requested", {
      ip,
      metricName,
      limit,
      count: metricsData.length,
    });

    return NextResponse.json({
      success: true,
      data: metricsData,
      meta: {
        count: metricsData.length,
        limit,
        metricName: metricName || "all",
      },
    });
  } catch (error) {
    logger.error("Failed to get metrics", { error, ip });

    return NextResponse.json(
      { error: "Failed to get metrics" },
      { status: 500 }
    );
  }
}
