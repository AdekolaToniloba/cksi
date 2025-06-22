// app/api/admin/stats/donations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth-helpers";

export async function GET() {
  try {
    await requireAdminAuth();

    // For now, return empty stats since donations functionality might not be implemented yet
    const stats = {
      totalAmount: 0,
      totalDonations: 0,
      monthlyAmount: 0,
      recentDonations: [],
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching donations stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch donations stats" },
      { status: 500 }
    );
  }
}
