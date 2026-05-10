"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { donationAmounts } from "@/data/donations";
import { Heart, Loader2, Lock } from "lucide-react";
import { useAlertDialog } from "@/hooks/use-alert-dialog";
import { sendGTMEvent } from "@next/third-parties/google";

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: any) => { openIframe: () => void };
    };
  }
}

export function DonateForm() {
  const [donationType, setDonationType] = useState("one-time");
  const [currency, setCurrency] = useState("NGN"); // Fixed to NGN as per screenshot "NGN (₦)" badge
  const [selectedAmount, setSelectedAmount] = useState("10000"); // Default 10000 as per screenshot
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { showAlert } = useAlertDialog();
  const [donorInfo, setDonorInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    anonymous: false,
    newsletter: true, // Default true as per screenshot
    receipt: true, // Default true as per screenshot
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const amount = customAmount || selectedAmount;

  const handleDonation = async () => {
    if (!amount || !donorInfo.email) {
      showAlert("Missing Information", "Please provide your email address.");
      return;
    }
    if (Number(amount) < 100) {
      showAlert("Invalid Amount", "Minimum donation is ₦100.");
      return;
    }

    setIsProcessing(true);

    // GA TRACKING: Begin Checkout
    sendGTMEvent({
      event: "begin_checkout",
      value: amount,
      currency: currency,
      items: [{ item_name: "Donation", item_category: donationType }],
    });

    try {
      const response = await fetch("/api/donations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          currency,
          donor_name: donorInfo.anonymous
            ? null
            : `${donorInfo.firstName} ${donorInfo.lastName}`.trim() || null,
          donor_email: donorInfo.email,
          donor_phone: donorInfo.phone,
          is_anonymous: donorInfo.anonymous,
          donation_type: donationType,
          wants_receipt: donorInfo.receipt,
          wants_newsletter: donorInfo.newsletter,
        }),
      });

      const donation = await response.json();
      if (!response.ok) throw new Error(donation.error || "Failed to initiate");

      const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

      if (!paystackKey) {
        console.error("Paystack Public Key is missing in .env");
        throw new Error("Payment configuration missing.");
      }

      if (!window.PaystackPop) {
        console.error("Paystack script not loaded yet.");
        throw new Error("Payment gateway unavailable. Please refresh.");
      }

      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: donorInfo.email,
        amount: Number(amount) * 100,
        currency: currency,
        ref: donation.payment_reference,
        metadata: {
          donation_id: donation.id,
          custom_fields: [
            {
              display_name: "Type",
              variable_name: "type",
              value: donationType,
            },
          ],
        },
        callback: (response: { reference: string }) => {
          verifyPayment(response.reference, donation.id);
        },
        onClose: () => {
          setIsProcessing(false);
          showAlert("Cancelled", "Process cancelled.");
        },
      });
      handler.openIframe();
    } catch (error: any) {
      showAlert("Error", error.message || "An error occurred");
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (reference: string, donationId: string) => {
    try {
      const res = await fetch("/api/donations/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, donation_id: donationId }),
      });
      const result = await res.json();

      if (result.success) {
        // GA TRACKING: Purchase / Donate Success
        sendGTMEvent({
          event: "purchase",
          transaction_id: reference,
          value: amount,
          currency: currency,
          items: [{ item_name: "Donation", item_category: donationType }],
        });

        showAlert("Thank You!", "Your donation was successful.", () => {
          window.location.href = "/donate/success";
        });
      } else {
        showAlert("Verification Failed", "Please contact support.");
      }
    } catch {
      showAlert("Error", "Could not verify payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
      
      {/* Top Toggles */}
      <div className="flex items-center justify-between mb-10">
        <div className="bg-[#EBF2FA] px-4 py-2 rounded-full">
          <span className="font-sans font-bold text-xs text-[#151C27] tracking-wider">NGN (₦)</span>
        </div>
        <div className="flex bg-[#EBF2FA] rounded-full p-1">
          <button
            onClick={() => setDonationType("one-time")}
            className={`px-6 py-2 rounded-full text-sm font-sans font-bold transition-colors ${
              donationType === "one-time" 
                ? "bg-cksi-brand-red text-white shadow-sm" 
                : "text-[#4A6773] hover:text-[#151C27]"
            }`}
          >
            One-time
          </button>
          <button
            onClick={() => setDonationType("monthly")}
            className={`px-6 py-2 rounded-full text-sm font-sans font-bold transition-colors ${
              donationType === "monthly" 
                ? "bg-cksi-brand-red text-white shadow-sm" 
                : "text-[#4A6773] hover:text-[#151C27]"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Select Amount Grid */}
      <div className="mb-10">
        <Label className="block font-sans font-bold text-sm text-[#151C27] mb-4">Select Amount</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {donationAmounts.map((amt) => {
            const isSelected = selectedAmount === amt.value.toString();
            return (
              <button
                key={amt.value}
                onClick={() => {
                  setSelectedAmount(amt.value.toString());
                  setCustomAmount("");
                }}
                className={`py-4 rounded-xl border text-center font-sans font-bold transition-all ${
                  isSelected 
                    ? "border-cksi-brand-red text-cksi-brand-red ring-1 ring-cksi-brand-red bg-red-50/30" 
                    : "border-gray-200 text-[#151C27] hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                ₦{amt.value.toLocaleString()}
              </button>
            )
          })}
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-sans font-bold text-[#151C27]">
            ₦
          </span>
          <Input
            type="number"
            placeholder="Other Amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount("");
            }}
            className="w-full h-14 pl-10 bg-gray-50/50 border-gray-200 font-sans text-base focus-visible:ring-cksi-brand-red/30 focus-visible:border-cksi-brand-red placeholder:text-gray-400 placeholder:font-bold rounded-xl"
          />
        </div>
      </div>

      {/* Your Details */}
      <div className="mb-10">
        <Label className="block font-sans font-bold text-sm text-[#151C27] mb-4">Your Details</Label>
        <Input
          placeholder="Email Address"
          type="email"
          value={donorInfo.email}
          onChange={(e) =>
            setDonorInfo({ ...donorInfo, email: e.target.value })
          }
          className="w-full h-14 bg-gray-50/50 border-gray-200 font-sans text-base focus-visible:ring-cksi-brand-red/30 focus-visible:border-cksi-brand-red rounded-xl mb-6 placeholder:text-gray-400"
        />
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="anon"
              checked={donorInfo.anonymous}
              onCheckedChange={(c) =>
                setDonorInfo({ ...donorInfo, anonymous: !!c })
              }
              className="mt-1 data-[state=checked]:bg-cksi-brand-red data-[state=checked]:border-cksi-brand-red"
            />
            <Label
              htmlFor="anon"
              className="font-sans text-sm text-gray-600 leading-tight cursor-pointer"
            >
              Make this donation anonymously
            </Label>
          </div>
          <div className="flex items-start space-x-3">
            <Checkbox
              id="updates"
              checked={donorInfo.receipt}
              onCheckedChange={(c) =>
                setDonorInfo({ ...donorInfo, receipt: !!c, newsletter: !!c })
              }
              className="mt-1 data-[state=checked]:bg-cksi-brand-red data-[state=checked]:border-cksi-brand-red"
            />
            <Label
              htmlFor="updates"
              className="font-sans text-sm text-gray-600 leading-tight cursor-pointer"
            >
              Send me a receipt and impact updates
            </Label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        size="lg"
        onClick={handleDonation}
        disabled={isProcessing || !amount || !donorInfo.email}
        className="w-full h-14 bg-cksi-brand-red hover:bg-cksi-brand-red/90 text-white font-sans font-bold text-lg rounded-xl mb-6 shadow-md transition-all group"
      >
        {isProcessing ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : null}
        {isProcessing ? "Processing..." : `Donate ₦${amount ? Number(amount).toLocaleString() : "0"}`}
        {!isProcessing && <Heart className="ml-2 h-5 w-5 fill-white group-hover:scale-110 transition-transform" />}
      </Button>

      {/* Security Footer */}
      <div className="flex items-center justify-center gap-2 text-gray-400">
        <Lock className="h-4 w-4" />
        <span className="font-sans font-medium text-xs">Secured by Paystack</span>
      </div>
    </div>
  );
}
