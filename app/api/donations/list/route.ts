import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/monitoring/logger";
import { metrics } from "@/lib/monitoring/metrics";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const start = Date.now();
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (status && ["COMPLETED", "PENDING", "FAILED"].includes(status)) {
      where.status = status;
    }

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.donation.count({ where }),
    ]);

    const totalRaised = await prisma.donation.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    });

    // FIX: Use the metrics variable
    metrics.collect("admin_donation_list_view", 1, "count");
    metrics.collect("admin_donation_list_latency", Date.now() - start, "ms");

    logger.info("Admin accessed donation list", { count: donations.length });

    return NextResponse.json({
      success: true,
      data: donations,
      meta: {
        total,
        total_raised: totalRaised._sum.amount || 0,
        page: Math.floor(offset / limit) + 1,
      },
    });
  } catch (error) {
    logger.error("Admin donation list fetch failed", { error });
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
