// app/donate/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { donationAmounts } from "@/data/donations";
import { motion, type Variants } from "framer-motion"; // Import Variants type
import { Heart, Shield, CreditCard, Loader2, Globe } from "lucide-react";
import { useAlertDialog } from "@/hooks/use-alert-dialog";
import { sendGTMEvent } from "@next/third-parties/google"; // Using Next.js built-in helper

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: any) => { openIframe: () => void };
    };
  }
}

// FIX: Typed Variants with "as const" for ease
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function DonatePage() {
  // ... (State remains the same)
  const [donationType, setDonationType] = useState("one-time");
  const [currency, setCurrency] = useState("NGN");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  // const [isLiveMode, setIsLiveMode] = useState(true);
  const { showAlert } = useAlertDialog();
  const [donorInfo, setDonorInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    anonymous: false,
    newsletter: false,
    receipt: false,
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
    // ... (Validation checks remain the same)

    if (!amount || !donorInfo.email) {
      showAlert("Missing Information", "Please provide details.");
      return;
    }
    if (Number(amount) < 100) {
      showAlert("Invalid Amount", "Minimum donation is 100.");
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
            : `${donorInfo.firstName} ${donorInfo.lastName}`,
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

      // Use the standard key from your .env (which currently holds your Live key)
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen py-12 px-4 md:px-8 max-w-3xl mx-auto"
    >
      {/* ... (Rest of UI remains exactly as I provided in the previous turn) ... */}
      {/* Just ensure you use the fixed `containerVariants` I defined above */}

      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Heart className="h-8 w-8 fill-current" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Support Our Mission
        </h1>
        <p className="text-gray-500">
          Secure, transparent, and impactful giving.
        </p>
      </div>

      <Card className="border-0 shadow-xl ring-1 ring-gray-200 overflow-hidden bg-white">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">
              Donation Details
            </CardTitle>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-[100px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">NGN (₦)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-8">
          {/* ... (Keep the Frequency, Amount Grid, Donor Info, and Action Button exactly as before) ... */}
          {/* ... No changes needed to the inner JSX structure, just the surrounding Logic & Types ... */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Frequency
            </Label>
            <RadioGroup
              value={donationType}
              onValueChange={setDonationType}
              className="grid grid-cols-2 gap-4"
            >
              {/* ... (Radio Items) ... */}
              <div
                className={`flex items-center justify-center border rounded-lg p-3 cursor-pointer transition-all ${
                  donationType === "one-time"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "hover:bg-gray-50"
                }`}
              >
                <RadioGroupItem
                  value="one-time"
                  id="one-time"
                  className="sr-only"
                />
                <Label
                  htmlFor="one-time"
                  className="cursor-pointer w-full text-center font-medium"
                >
                  One-time
                </Label>
              </div>
              <div
                className={`flex items-center justify-center border rounded-lg p-3 cursor-pointer transition-all ${
                  donationType === "monthly"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "hover:bg-gray-50"
                }`}
              >
                <RadioGroupItem
                  value="monthly"
                  id="monthly"
                  className="sr-only"
                />
                <Label
                  htmlFor="monthly"
                  className="cursor-pointer w-full text-center font-medium"
                >
                  Monthly
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Select Amount
            </Label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {donationAmounts.map((amt) => (
                <Button
                  key={amt.value}
                  variant="outline"
                  onClick={() => {
                    setSelectedAmount(amt.value.toString());
                    setCustomAmount("");
                  }}
                  className={`h-12 border ${
                    selectedAmount === amt.value.toString()
                      ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                      : "hover:border-blue-300"
                  }`}
                >
                  {currency === "NGN" ? "₦" : currency === "USD" ? "$" : "£"}
                  {amt.value.toLocaleString()}
                </Button>
              ))}
              <div className="col-span-3 md:col-span-4 mt-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    {currency === "NGN" ? "₦" : currency === "USD" ? "$" : "£"}
                  </span>
                  <Input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount("");
                    }}
                    className="pl-8 h-12 text-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <Label className="text-sm font-medium text-gray-700">
              Your Information
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="First Name"
                value={donorInfo.firstName}
                onChange={(e) =>
                  setDonorInfo({ ...donorInfo, firstName: e.target.value })
                }
                disabled={donorInfo.anonymous}
              />
              <Input
                placeholder="Last Name"
                value={donorInfo.lastName}
                onChange={(e) =>
                  setDonorInfo({ ...donorInfo, lastName: e.target.value })
                }
                disabled={donorInfo.anonymous}
              />
              <Input
                placeholder="Email Address"
                type="email"
                className="md:col-span-2"
                value={donorInfo.email}
                onChange={(e) =>
                  setDonorInfo({ ...donorInfo, email: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anon"
                  checked={donorInfo.anonymous}
                  onCheckedChange={(c) =>
                    setDonorInfo({ ...donorInfo, anonymous: !!c })
                  }
                />
                <Label
                  htmlFor="anon"
                  className="text-sm font-normal text-gray-600 cursor-pointer"
                >
                  Donate anonymously
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="receipt"
                  checked={donorInfo.receipt}
                  onCheckedChange={(c) =>
                    setDonorInfo({ ...donorInfo, receipt: !!c })
                  }
                />
                <Label
                  htmlFor="receipt"
                  className="text-sm font-normal text-gray-600 cursor-pointer"
                >
                  Email me a receipt
                </Label>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-600/20 transition-all"
            onClick={handleDonation}
            disabled={isProcessing || !amount || !donorInfo.email}
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <CreditCard className="mr-2 h-5 w-5" />
            )}
            {isProcessing
              ? "Processing..."
              : `Donate ${
                  currency === "NGN" ? "₦" : currency === "USD" ? "$" : "£"
                }${amount ? Number(amount).toLocaleString() : "0"}`}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
