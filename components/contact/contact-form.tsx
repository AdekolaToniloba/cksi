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
import { Send, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ContactForm() {
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

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-12 text-center h-full flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-serif text-[#151C27] mb-3">Message Sent!</h2>
        <p className="text-sm font-sans text-gray-600 mb-8 max-w-sm">
          Thank you for reaching out. We have received your message and will get back to you shortly.
        </p>
        <Button
          onClick={() => setIsSubmitted(false)}
          className="bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl px-8 h-12 font-sans font-bold text-sm"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 md:p-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="first-name" className="font-sans font-bold text-xs text-[#151C27]">
              First Name
            </Label>
            <Input
              id="first-name"
              required
              placeholder="Jane"
              className="h-12 bg-gray-50/50 border-gray-200 font-sans focus-visible:ring-cksi-brand-red/30 focus-visible:border-cksi-brand-red rounded-xl placeholder:text-gray-400"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="last-name" className="font-sans font-bold text-xs text-[#151C27]">
              Last Name
            </Label>
            <Input
              id="last-name"
              required
              placeholder="Doe"
              className="h-12 bg-gray-50/50 border-gray-200 font-sans focus-visible:ring-cksi-brand-red/30 focus-visible:border-cksi-brand-red rounded-xl placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="font-sans font-bold text-xs text-[#151C27]">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="jane@example.com"
              className="h-12 bg-gray-50/50 border-gray-200 font-sans focus-visible:ring-cksi-brand-red/30 focus-visible:border-cksi-brand-red rounded-xl placeholder:text-gray-400"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-sans font-bold text-xs text-[#151C27]">
              Phone Number (Optional)
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+234 ..."
              className="h-12 bg-gray-50/50 border-gray-200 font-sans focus-visible:ring-cksi-brand-red/30 focus-visible:border-cksi-brand-red rounded-xl placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject" className="font-sans font-bold text-xs text-[#151C27]">
            Subject
          </Label>
          <Select required defaultValue="general">
            <SelectTrigger className="h-12 bg-gray-50/50 border-gray-200 font-sans focus:ring-cksi-brand-red/30 focus:border-cksi-brand-red rounded-xl">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general" className="font-sans">General Inquiry</SelectItem>
              <SelectItem value="volunteer" className="font-sans">Volunteer Opportunities</SelectItem>
              <SelectItem value="partnership" className="font-sans">Partnership</SelectItem>
              <SelectItem value="donation" className="font-sans">Donation Inquiry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message" className="font-sans font-bold text-xs text-[#151C27]">
            Message
          </Label>
          <Textarea
            id="message"
            required
            placeholder="How can we help you?"
            className="min-h-[120px] resize-none bg-gray-50/50 border-gray-200 font-sans focus-visible:ring-cksi-brand-red/30 focus-visible:border-cksi-brand-red rounded-xl placeholder:text-gray-400 p-4"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 px-8 bg-cksi-brand-red hover:bg-cksi-brand-red/90 text-white font-sans font-bold text-sm rounded-full transition-colors w-full md:w-auto"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
