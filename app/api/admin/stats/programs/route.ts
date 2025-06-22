// app/api/admin/stats/programs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth-helpers";

export async function GET() {
  try {
    await requireAdminAuth();

    // For now, return empty stats since programs functionality might not be implemented yet
    const stats = {
      total: 0,
      active: 0,
      completed: 0,
      recentPrograms: [],
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching programs stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch programs stats" },
      { status: 500 }
    );
  }
}
