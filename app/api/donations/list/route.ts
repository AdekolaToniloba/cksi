// app/api/donations/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const includeStats = searchParams.get("includeStats") === "true";

    // Build filters
    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // Fetch donations
    const donations = await prisma.donation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : undefined,
    });

    // Fetch stats if requested
    let stats = null;
    if (includeStats) {
      const [total, completed, pending, failed] = await Promise.all([
        prisma.donation.count(),
        prisma.donation.count({ where: { status: "COMPLETED" } }),
        prisma.donation.count({ where: { status: "PENDING" } }),
        prisma.donation.count({ where: { status: "FAILED" } }),
      ]);

      const totalAmountResult = await prisma.donation.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      });

      stats = {
        total,
        completed,
        pending,
        failed,
        totalAmount: totalAmountResult._sum.amount || 0,
      };
    }

    return NextResponse.json({
      success: true,
      data: donations,
      stats,
      filters: {
        status,
        startDate,
        endDate,
        limit: limit ? parseInt(limit) : null,
        offset: offset ? parseInt(offset) : null,
      },
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}
