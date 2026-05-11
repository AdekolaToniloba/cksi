"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";

export function PartnershipForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section id="proposal-form" className="bg-[#FAF8F5] py-20 lg:py-24">
      <div className="container px-4 md:px-6 max-w-3xl mx-auto">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-[#151C27] mb-4">
            Submit a Proposal
          </h2>
          <p className="text-sm md:text-base font-sans text-gray-600">
            Tell us about your organization and how we can work together.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-6 md:p-10">
          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-serif text-[#151C27] mb-3">Proposal Received</h3>
              <p className="text-sm font-sans text-gray-600 mb-8 max-w-sm mx-auto">
                Thank you for your interest in partnering with CKSI. Our team will review your proposal and get back to you shortly.
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                className="bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-sm px-8 h-12 font-sans font-bold text-sm"
              >
                Submit Another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="org-name" className="font-sans font-bold text-xs text-[#151C27]">
                    Organization Name
                  </Label>
                  <Input
                    id="org-name"
                    required
                    placeholder="Your organization"
                    className="h-12 bg-white border-gray-200 font-sans focus-visible:ring-cksi-brand-red/30 focus-visible:border-cksi-brand-red rounded-sm placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-name" className="font-sans font-bold text-xs text-[#151C27]">
                    Contact Name
                  </Label>
                  <Input
                    id="contact-name"
                    required
                    placeholder="Full name"
                    className="h-12 bg-white border-gray-200 font-sans focus-visible:ring-cksi-brand-red/30 focus-visible:border-cksi-brand-red rounded-sm placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Contact Row */}
              <div className="space-y-2">
                <Label htmlFor="contact-info" className="font-sans font-bold text-xs text-[#151C27]">
                  Email or Phone
                </Label>
                <Input
                  id="contact-info"
                  required
                  placeholder="Best way to reach you"
                  className="h-12 bg-white border-gray-200 font-sans focus-visible:ring-cksi-brand-red/30 focus-visible:border-cksi-brand-red rounded-sm placeholder:text-gray-400"
                />
              </div>

              {/* Type and Interest Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-sans font-bold text-xs text-[#151C27]">
                    Organization Type
                  </Label>
                  <Select required defaultValue="corporate">
                    <SelectTrigger className="h-12 bg-white border-gray-200 font-sans focus:ring-cksi-brand-red/30 focus:border-cksi-brand-red rounded-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corporate" className="font-sans">Corporate</SelectItem>
                      <SelectItem value="ngo" className="font-sans">NGO / Non-Profit</SelectItem>
                      <SelectItem value="academic" className="font-sans">Academic Institution</SelectItem>
                      <SelectItem value="government" className="font-sans">Government Agency</SelectItem>
                      <SelectItem value="other" className="font-sans">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-sans font-bold text-xs text-[#151C27]">
                    Partnership Interest
                  </Label>
                  <Select required defaultValue="program">
                    <SelectTrigger className="h-12 bg-white border-gray-200 font-sans focus:ring-cksi-brand-red/30 focus:border-cksi-brand-red rounded-sm">
                      <SelectValue placeholder="Select interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="program" className="font-sans">Program Sponsorship</SelectItem>
                      <SelectItem value="inkind" className="font-sans">In-Kind Donation</SelectItem>
                      <SelectItem value="research" className="font-sans">Joint Research</SelectItem>
                      <SelectItem value="events" className="font-sans">Co-hosted Events</SelectItem>
                      <SelectItem value="other" className="font-sans">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <Label htmlFor="summary" className="font-sans font-bold text-xs text-[#151C27]">
                  Proposal Summary
                </Label>
                <Textarea
                  id="summary"
                  required
                  placeholder="Briefly describe your partnership idea..."
                  className="min-h-[120px] resize-none bg-white border-gray-200 font-sans focus-visible:ring-cksi-brand-red/30 focus-visible:border-cksi-brand-red rounded-sm placeholder:text-gray-400 p-4"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-cksi-brand-red hover:bg-cksi-brand-red/90 text-white font-sans font-bold text-sm px-8 h-12 rounded-sm transition-colors w-full sm:w-auto"
                >
                  {isSubmitting ? "Sending..." : "Send Proposal"}
                </Button>
              </div>

            </form>
          )}
        </div>
      </div>
    </section>
  );
}
