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

    const body = await request.json()
    const { amount, donor_name, donor_email, donor_phone, campaign_id, is_anonymous, donation_type } = body

    // Validate required fields
    if (!amount || !donor_email) {
      return NextResponse.json({ error: "Amount and email are required" }, { status: 400 })
    }

    // Create Supabase client with service role key for server-side operations
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    const payment_reference = `CKSI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create donation record
    const { data: donation, error } = await supabase
      .from("donations")
      .insert({
        donor_name,
        donor_email,
        donor_phone,
        amount,
        currency: "NGN",
        campaign_id,
        payment_reference,
        status: "pending",
        is_anonymous,
        donation_type,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create donation record" }, { status: 500 })
    }

    return NextResponse.json(donation)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
