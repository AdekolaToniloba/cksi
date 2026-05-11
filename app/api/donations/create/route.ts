import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/monitoring/logger";
import { metrics } from "@/lib/monitoring/metrics";
import { generatePaymentReference } from "@/lib/utils";
import { SecurityUtils } from "@/lib/security";
import { rateLimit } from "@/lib/monitoring/middleware";
import { getClientIP } from "@/lib/utils/ip";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Task 4: Rate limiting — 10 donation attempts per minute per IP
    const ip = getClientIP(request);
    const { success } = rateLimit(ip, 10, 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { amount, donor_email, currency = "NGN" } = body;

    // 1. Input Sanitization & Validation
    if (!amount || isNaN(Number(amount)) || Number(amount) < 100) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const sanitizedEmail = SecurityUtils.sanitizeInput(donor_email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // 2. Create Record
    const reference = generatePaymentReference();

    const donation = await prisma.donation.create({
      data: {
        amount: Number(amount),
        currency: SecurityUtils.sanitizeInput(currency),
        donorEmail: sanitizedEmail,
        donorName: body.is_anonymous
          ? null
          : SecurityUtils.sanitizeInput(body.donor_name || ""),
        donorPhone: body.donor_phone
          ? SecurityUtils.sanitizeInput(body.donor_phone)
          : null,
        paymentReference: reference,
        status: "PENDING",
        isAnonymous: body.is_anonymous || false,
        donationType: body.donation_type === "monthly" ? "MONTHLY" : "ONE_TIME",
        // Removed campaignId logic as requested
      },
    });

    // 3. Logging & Metrics
    logger.info(`Donation initiated: ${reference}`, { amount, currency });
    metrics.collect("donation_initiated", 1, "count", { currency });

    return NextResponse.json({
      id: donation.id,
      payment_reference: donation.paymentReference,
      amount: donation.amount,
    });
  } catch (error) {
    logger.error("Donation creation failed", { error });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    metrics.collect("api_latency", Date.now() - startTime, "ms", {
      endpoint: "create_donation",
    });
  }
}
