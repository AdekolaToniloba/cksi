// app/api/donations/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    // Check if environment variables are available
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        {
          error:
            "Supabase configuration missing. Please set up environment variables.",
        },
        { status: 500 }
      );
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        {
          error:
            "Paystack configuration missing. Please set up environment variables.",
        },
        { status: 500 }
      );
    }

    const { reference, donation_id } = await request.json();

    if (!reference || !donation_id) {
      return NextResponse.json(
        { error: "Reference and donation ID are required" },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackData.status || paystackData.data.status !== "success") {
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Update donation status
    const { error } = await supabase
      .from("donations")
      .update({
        status: "completed",
        payment_data: paystackData.data,
        completed_at: new Date().toISOString(),
      })
      .eq("id", donation_id)
      .eq("payment_reference", reference);

    if (error) {
      console.error("Failed to update donation:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update donation status" },
        { status: 500 }
      );
    }

    // TODO: Send email receipt if requested

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, error: "Server error during verification" },
      { status: 500 }
    );
  }
}
