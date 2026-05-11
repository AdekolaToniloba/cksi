// app/api/volunteer/metrics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  VolunteerCapacity,
  VolunteerStatus,
  VolunteerMetrics,
} from "@/types/volunteer";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Task 7: Parallel queries — replaces 5 sequential round trips with 1 batch
    const [totalSubmissions, pendingReview, approved, capacityCounts, recentSubmissions] =
      await Promise.all([
        prisma.volunteer.count(),
        prisma.volunteer.count({
          where: { status: VolunteerStatus.PENDING },
        }),
        prisma.volunteer.count({
          where: { status: VolunteerStatus.APPROVED },
        }),
        prisma.volunteer.groupBy({
          by: ["capacity"],
          _count: true,
        }),
        prisma.volunteer.findMany({
          where: { createdAt: { gte: startDate } },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

    // Reduce capacityCounts groupBy into a map
    const byCapacity = capacityCounts.reduce((acc, item) => {
      acc[item.capacity as VolunteerCapacity] = item._count;
      return acc;
    }, {} as Record<VolunteerCapacity, number>);

    // Get submissions over time
    const submissionsOverTime = await prisma.volunteer.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: true,
    });

    const metrics: VolunteerMetrics = {
      totalSubmissions,
      pendingReview,
      approved,
      byCapacity,
      recentSubmissions,
    };

    console.log("[VOLUNTEER METRICS]", {
      timestamp: new Date().toISOString(),
      totalSubmissions,
      pendingReview,
      approved,
      days,
    });

    return NextResponse.json({
      success: true,
      data: metrics,
      period: {
        days,
        startDate,
        endDate: new Date(),
      },
      submissionsOverTime: submissionsOverTime.map((item) => ({
        date: item.createdAt,
        count: item._count,
      })),
    });
  } catch (error) {
    console.error("[VOLUNTEER METRICS ERROR]", {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch volunteer metrics",
        error: "METRICS_ERROR",
      },
      { status: 500 }
    );
  }
}
