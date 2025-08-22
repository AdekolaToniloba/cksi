// app/api/hero/route.ts
import { NextRequest, NextResponse } from "next/server";
import { HomepageService } from "@/lib/db/homepage";

export async function GET() {
  try {
    const items = await HomepageService.getHeroItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Failed to fetch hero items:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hero items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const item = await HomepageService.createHeroItem(data);
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Failed to create hero item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create hero item" },
      { status: 500 }
    );
  }
}
