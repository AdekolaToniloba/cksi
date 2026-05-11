// app/api/donations/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuthAPI } from "@/lib/auth-helpers";

const MAX_EXPORT_ROWS = 5000;

export async function GET(request: NextRequest) {
  try {
    // Task 2: Secure — only admins can export donation data (NDPR/GDPR compliance)
    const authError = await requireAdminAuthAPI();
    if (authError) return authError;

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const format = searchParams.get("format") || "csv";

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

    // Task 2: Hard cap to prevent Vercel timeout with large datasets
    const donations = await prisma.donation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: MAX_EXPORT_ROWS,
    });

    if (format === "csv") {
      // Generate CSV content
      const headers = [
        "Date",
        "Donor Name",
        "Email",
        "Phone",
        "Amount (₦)",
        "Currency",
        "Status",
        "Type",
        "Reference",
        "Campaign",
        "Anonymous",
      ];

      const csvRows = [
        headers.join(","),
        ...donations.map((donation) =>
          [
            new Date(donation.createdAt).toLocaleDateString(),
            donation.donorName || "Anonymous",
            donation.donorEmail,
            donation.donorPhone || "",
            donation.amount.toString(),
            donation.currency,
            donation.status,
            donation.donationType.replace("_", " "),
            donation.paymentReference,
            donation.campaignId || "General Fund",
            donation.isAnonymous ? "Yes" : "No",
          ]
            .map((field) => `"${field}"`)
            .join(",")
        ),
      ];

      const csvContent = csvRows.join("\n");

      // Generate filename with date range
      const startDateStr = startDate
        ? new Date(startDate).toISOString().split("T")[0]
        : "all";
      const endDateStr = endDate
        ? new Date(endDate).toISOString().split("T")[0]
        : "all";
      const filename = `cksi-donations-${startDateStr}-to-${endDateStr}.csv`;

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "X-Export-Limit": MAX_EXPORT_ROWS.toString(),
          "X-Export-Count": donations.length.toString(),
        },
      });
    }

    // Default to JSON if format is not CSV
    return NextResponse.json({
      success: true,
      data: donations,
      count: donations.length,
      filters: {
        status,
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error("Error exporting donations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to export donations" },
      { status: 500 }
    );
  }
}
