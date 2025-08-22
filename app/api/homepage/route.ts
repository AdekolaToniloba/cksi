// app/api/homepage/route.ts
import { NextRequest, NextResponse } from "next/server";
import { HomepageService } from "@/lib/db/homepage";

export async function GET() {
  try {
    const content = await HomepageService.getContent();
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error("Failed to fetch homepage content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const content = await HomepageService.createContent(data);
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error("Failed to create homepage content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create content" },
      { status: 500 }
    );
  }
}
