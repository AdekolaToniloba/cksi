"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { donationCampaigns, donationAmounts } from "@/data/donations"
import { motion } from "framer-motion"
import { Heart, Shield, CreditCard, Users, Target, Gift } from "lucide-react"

// Add Paystack script
declare global {
  interface Window {
    PaystackPop: any
  }
}

export default function DonatePage() {
  const [donationType, setDonationType] = useState("one-time")
  const [selectedAmount, setSelectedAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [selectedCampaign, setSelectedCampaign] = useState("general")
  const [isProcessing, setIsProcessing] = useState(false)
  const [donorInfo, setDonorInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    anonymous: false,
    newsletter: false,
    receipt: false,
  })

  useEffect(() => {
    // Load Paystack script
    const script = document.createElement("script")
    script.src = "https://js.paystack.co/v1/inline.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup
      document.body.removeChild(script)
    }
  }, [])

  const amount = customAmount || selectedAmount

  const handleDonation = async () => {
    if (!amount || !donorInfo.email) {
      alert("Please fill in all required fields")
      return
    }

    setIsProcessing(true)

    try {
      // Create donation record
      const response = await fetch("/api/donations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          donor_name: donorInfo.anonymous ? null : `${donorInfo.firstName} ${donorInfo.lastName}`,
          donor_email: donorInfo.email,
          donor_phone: donorInfo.phone,
          campaign_id: selectedCampaign,
          is_anonymous: donorInfo.anonymous,
          donation_type: donationType,
        }),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Please check your configuration.")
      }

      const donation = await response.json()

      if (!response.ok) {
        throw new Error(donation.error || "Failed to create donation")
      }

      // Check if Paystack is available
      if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
        alert("Payment processing is not configured. Please contact support.")
        setIsProcessing(false)
        return
      }

      // Check if PaystackPop is loaded
      if (!window.PaystackPop) {
        alert("Payment system is loading. Please try again in a moment.")
        setIsProcessing(false)
        return
      }

      // Initialize Paystack
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: donorInfo.email,
        amount: Number(amount) * 100, // Paystack expects amount in kobo
        currency: "NGN",
        ref: donation.payment_reference,
        metadata: {
          donation_id: donation.id,
          campaign_id: selectedCampaign,
          donor_name: donorInfo.anonymous ? "Anonymous" : `${donorInfo.firstName} ${donorInfo.lastName}`,
        },
        callback: (response: any) => {
          // Payment successful
          verifyPayment(response.reference, donation.id)
        },
        onClose: () => {
          setIsProcessing(false)
        },
      })

      handler.openIframe()
    } catch (error) {
      console.error("Error initiating payment:", error)
      alert(`Failed to initiate payment: ${error.message}`)
      setIsProcessing(false)
    }
  }

  const verifyPayment = async (reference: string, donationId: string) => {
    try {
      const response = await fetch("/api/donations/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reference,
          donation_id: donationId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Redirect to success page or show success message
        alert("Thank you for your donation! Your payment was successful.")
        // Reset form
        setDonorInfo({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          anonymous: false,
          newsletter: false,
          receipt: false,
        })
        setSelectedAmount("")
        setCustomAmount("")
      } else {
        alert("Payment verification failed. Please contact support.")
      }
    } catch (error) {
      console.error("Error verifying payment:", error)
      alert("Payment verification failed. Please contact support.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10"
      >
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex justify-center mb-6"
            >
              <Heart className="h-16 w-16 text-primary" />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Make a Difference Today
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Your donation helps us continue our mission of empowering families and children across Nigeria. Every
              contribution, no matter the size, creates lasting positive change in communities.
            </motion.p>
          </div>
        </div>
      </motion.section>

      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Donation Form */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    Donation Details
                  </CardTitle>
                  <CardDescription>Choose your donation amount and frequency to support our programs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Donation Type */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Donation Type</Label>
                    <RadioGroup value={donationType} onValueChange={setDonationType} className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="one-time" id="one-time" />
                        <Label htmlFor="one-time">One-time</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Monthly</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Amount Selection */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Select Amount (NGN)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {donationAmounts.map((amount) => (
                        <Button
                          key={amount.value}
                          variant={selectedAmount === amount.value.toString() ? "default" : "outline"}
                          onClick={() => {
                            setSelectedAmount(amount.value.toString())
                            setCustomAmount("")
                          }}
                          className="h-16 flex flex-col transition-all duration-300 hover:scale-105"
                        >
                          <span className="text-lg font-bold">₦{amount.value.toLocaleString()}</span>
                          <span className="text-xs opacity-80">{amount.impact}</span>
                        </Button>
                      ))}
                    </div>
                    <div>
                      <Label htmlFor="custom-amount" className="text-sm">
                        Custom Amount
                      </Label>
                      <Input
                        id="custom-amount"
                        type="number"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value)
                          setSelectedAmount("")
                        }}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Campaign Selection */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Choose Campaign</Label>
                    <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a campaign" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Fund</SelectItem>
                        {donationCampaigns.map((campaign) => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Donor Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first-name">First Name *</Label>
                      <Input
                        id="first-name"
                        placeholder="Enter first name"
                        value={donorInfo.firstName}
                        onChange={(e) => setDonorInfo({ ...donorInfo, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="last-name">Last Name *</Label>
                      <Input
                        id="last-name"
                        placeholder="Enter last name"
                        value={donorInfo.lastName}
                        onChange={(e) => setDonorInfo({ ...donorInfo, lastName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={donorInfo.email}
                        onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="Enter phone number"
                        value={donorInfo.phone}
                        onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="anonymous"
                        checked={donorInfo.anonymous}
                        onCheckedChange={(checked) => setDonorInfo({ ...donorInfo, anonymous: checked as boolean })}
                      />
                      <Label htmlFor="anonymous" className="text-sm">
                        Make this donation anonymous
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={donorInfo.newsletter}
                        onCheckedChange={(checked) => setDonorInfo({ ...donorInfo, newsletter: checked as boolean })}
                      />
                      <Label htmlFor="newsletter" className="text-sm">
                        Subscribe to our newsletter for updates
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="receipt"
                        checked={donorInfo.receipt}
                        onCheckedChange={(checked) => setDonorInfo({ ...donorInfo, receipt: checked as boolean })}
                      />
                      <Label htmlFor="receipt" className="text-sm">
                        Email me a tax receipt
                      </Label>
                    </div>
                  </div>

                  {/* Donate Button */}
                  <Button
                    onClick={handleDonation}
                    disabled={!amount || !donorInfo.email || isProcessing}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    {isProcessing
                      ? "Processing..."
                      : `Donate ₦${amount ? Number.parseInt(amount).toLocaleString() : "0"}`}
                  </Button>

                  {/* Security Notice */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <Shield className="h-4 w-4" />
                    <span>Your donation is secure and encrypted. We use Paystack for safe payment processing.</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-6"
            >
              {/* Impact Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Your Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {amount && (
                    <div className="space-y-3">
                      <div className="text-center p-4 bg-primary/10 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          ₦{Number.parseInt(amount || "0").toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Your donation</div>
                      </div>
                      <div className="text-sm space-y-2">
                        <p>• Could provide school supplies for 5 children</p>
                        <p>• Could fund medical care for 3 families</p>
                        <p>• Could support counseling for 2 couples</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Active Campaigns */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Campaigns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {donationCampaigns.slice(0, 3).map((campaign) => (
                    <div key={campaign.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm">{campaign.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {Math.round((campaign.raised / campaign.goal) * 100)}%
                        </Badge>
                      </div>
                      <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>₦{campaign.raised.toLocaleString()} raised</span>
                        <span>₦{campaign.goal.toLocaleString()} goal</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Donors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Recent Supporters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Anonymous</span>
                      <span className="font-semibold">₦50,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adebayo O.</span>
                      <span className="font-semibold">₦25,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fatima A.</span>
                      <span className="font-semibold">₦15,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Emmanuel K.</span>
                      <span className="font-semibold">₦30,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
