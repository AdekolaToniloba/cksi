// app/api/volunteer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { volunteerFormSchema } from "@/lib/validations/volunteer";
import { VolunteerApiResponse } from "@/types/volunteer";
import { z } from "zod";

// Logging utility
function logVolunteerActivity(
  action: string,
  data: Record<string, unknown>,
  level: "info" | "error" | "warn" = "info"
) {
  const timestamp = new Date().toISOString();
  const logMessage = {
    timestamp,
    action,
    level,
    ...data,
  };

  if (level === "error") {
    console.error("[VOLUNTEER API]", JSON.stringify(logMessage));
  } else if (level === "warn") {
    console.warn("[VOLUNTEER API]", JSON.stringify(logMessage));
  } else {
    console.log("[VOLUNTEER API]", JSON.stringify(logMessage));
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    logVolunteerActivity("volunteer_submission_started", {
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    const body = await request.json();

    // Validate input
    const validatedData = volunteerFormSchema.parse(body);

    // Check for duplicate email within last 24 hours
    const existingSubmission = await prisma.volunteer.findFirst({
      where: {
        email: validatedData.email,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    if (existingSubmission) {
      logVolunteerActivity(
        "volunteer_duplicate_submission",
        {
          email: validatedData.email,
          existingId: existingSubmission.id,
        },
        "warn"
      );

      return NextResponse.json<VolunteerApiResponse>(
        {
          success: false,
          message:
            "You have already submitted a volunteer application recently. Please check your email or contact us directly.",
          error: "DUPLICATE_SUBMISSION",
        },
        { status: 409 }
      );
    }

    // Create volunteer submission
    const volunteer = await prisma.volunteer.create({
      data: validatedData,
    });

    const duration = Date.now() - startTime;

    logVolunteerActivity("volunteer_submission_success", {
      volunteerId: volunteer.id,
      email: volunteer.email,
      capacity: volunteer.capacity,
      country: volunteer.country,
      state: volunteer.state,
      duration,
    });

    // TODO: Send confirmation email to volunteer
    // TODO: Send notification email to admin

    return NextResponse.json<VolunteerApiResponse>(
      {
        success: true,
        message:
          "Thank you for your interest in volunteering! We will review your application and contact you soon.",
        data: volunteer,
      },
      { status: 201 }
    );
  } catch (error) {
    const duration = Date.now() - startTime;

    if (error instanceof z.ZodError) {
      logVolunteerActivity(
        "volunteer_validation_error",
        {
          errors: error.errors,
          duration,
        },
        "warn"
      );

      return NextResponse.json<VolunteerApiResponse>(
        {
          success: false,
          message: "Please check your form and try again.",
          error: error.errors[0]?.message || "Validation failed",
        },
        { status: 400 }
      );
    }

    logVolunteerActivity(
      "volunteer_submission_error",
      {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        duration,
      },
      "error"
    );

    return NextResponse.json<VolunteerApiResponse>(
      {
        success: false,
        message:
          "An error occurred while processing your application. Please try again later.",
        error: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const capacity = searchParams.get("capacity");

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (capacity) where.capacity = capacity;

    const [volunteers, total] = await Promise.all([
      prisma.volunteer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.volunteer.count({ where }),
    ]);

    logVolunteerActivity("volunteer_list_fetched", {
      page,
      limit,
      total,
      filters: { status, capacity },
    });

    return NextResponse.json({
      success: true,
      data: volunteers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logVolunteerActivity(
      "volunteer_list_error",
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      "error"
    );

    return NextResponse.json<VolunteerApiResponse>(
      {
        success: false,
        message: "Failed to fetch volunteers",
        error: "FETCH_ERROR",
      },
      { status: 500 }
    );
  }
}
