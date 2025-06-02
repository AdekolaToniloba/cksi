import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          error: "Supabase configuration missing. Please set up environment variables.",
        },
        { status: 500 },
      )
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        {
          error: "Paystack configuration missing. Please set up environment variables.",
        },
        { status: 500 },
      )
    }

    const body = await request.json()
    const { reference, donation_id } = body

    if (!reference || !donation_id) {
      return NextResponse.json({ error: "Reference and donation ID are required" }, { status: 400 })
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status || paystackData.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    // Create Supabase client with service role key for server-side operations
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Update donation record
    const { data: donation, error } = await supabase
      .from("donations")
      .update({
        status: "completed",
        paystack_reference: reference,
        updated_at: new Date().toISOString(),
      })
      .eq("id", donation_id)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update donation record" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      donation,
      paystack_data: paystackData.data,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
