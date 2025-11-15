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

    // Get total submissions
    const totalSubmissions = await prisma.volunteer.count();

    // Get pending review count
    const pendingReview = await prisma.volunteer.count({
      where: { status: VolunteerStatus.PENDING },
    });

    // Get approved count
    const approved = await prisma.volunteer.count({
      where: { status: VolunteerStatus.APPROVED },
    });

    // Get submissions by capacity
    const capacityCounts = await prisma.volunteer.groupBy({
      by: ["capacity"],
      _count: true,
    });

    const byCapacity = capacityCounts.reduce((acc, item) => {
      acc[item.capacity as VolunteerCapacity] = item._count;
      return acc;
    }, {} as Record<VolunteerCapacity, number>);

    // Get recent submissions
    const recentSubmissions = await prisma.volunteer.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

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
