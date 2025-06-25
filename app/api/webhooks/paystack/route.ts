// app/api/webhooks/paystack/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    // Verify webhook signature
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error("Paystack secret key not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");

    if (hash !== signature) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle different event types
    switch (event.event) {
      case "charge.success":
        await handleChargeSuccess(event.data);
        break;
      case "charge.failed":
        await handleChargeFailed(event.data);
        break;
      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleChargeSuccess(data: any) {
  try {
    const reference = data.reference;
    const donation = await prisma.donation.findUnique({
      where: { paymentReference: reference },
    });

    if (donation) {
      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          status: "COMPLETED",
          paystackReference: reference,
        },
      });
      console.log(`Donation ${donation.id} marked as completed via webhook`);

      // TODO: Send email receipt
      // TODO: Send thank you email
      // TODO: Update newsletter subscription if requested
    } else {
      console.error(`Donation not found for reference: ${reference}`);
    }
  } catch (error) {
    console.error("Error handling charge success:", error);
  }
}

async function handleChargeFailed(data: any) {
  try {
    const reference = data.reference;
    const donation = await prisma.donation.findUnique({
      where: { paymentReference: reference },
    });

    if (donation) {
      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          status: "FAILED",
          paystackReference: reference,
        },
      });
      console.log(`Donation ${donation.id} marked as failed via webhook`);
    } else {
      console.error(`Donation not found for reference: ${reference}`);
    }
  } catch (error) {
    console.error("Error handling charge failed:", error);
  }
}
