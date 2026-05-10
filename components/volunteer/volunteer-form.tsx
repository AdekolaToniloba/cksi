"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  volunteerFormSchema,
  VolunteerFormInput,
} from "@/lib/validations/volunteer";
import { VolunteerCapacity, VolunteerApiResponse } from "@/types/volunteer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const capacityOptions = [
  { value: VolunteerCapacity.TEACHING, label: "Teaching & Tutoring" },
  { value: VolunteerCapacity.HEALTHCARE, label: "Healthcare & Medical" },
  { value: VolunteerCapacity.MENTORSHIP, label: "Mentorship & Counseling" },
  { value: VolunteerCapacity.FUNDRAISING, label: "Fundraising & Development" },
  { value: VolunteerCapacity.EVENT_PLANNING, label: "Event Planning & Coordination" },
  { value: VolunteerCapacity.TECHNOLOGY, label: "Technology & IT Support" },
  { value: VolunteerCapacity.ADMINISTRATION, label: "Administration & Office Support" },
  { value: VolunteerCapacity.COMMUNITY_OUTREACH, label: "Community Outreach" },
  { value: VolunteerCapacity.SKILLED_LABOR, label: "Skilled Labor & Construction" },
  { value: VolunteerCapacity.OTHER, label: "Other" },
];

export function VolunteerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const form = useForm<VolunteerFormInput>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      state: "",
      country: "",
      capacity: undefined,
      additionalHelp: "",
      receiveUpdates: true, // Auto-subscribe by default to simplify form based on screenshot
    },
  });

  const onSubmit = async (data: VolunteerFormInput) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: VolunteerApiResponse = await response.json();

      if (result.success) {
        setSubmitStatus({ type: "success", message: result.message });
        form.reset();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
      console.error("Volunteer form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="volunteer-form" className="bg-[#FAF8F5] py-20 lg:py-24">
      <div className="container px-4 md:px-6 mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <span className="block text-xs font-sans font-bold tracking-[0.2em] text-cksi-brand-red uppercase mb-4">
            TAKE ACTION
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#151C27] mb-6">
            Ready to make an impact?
          </h2>
          <p className="text-base font-sans text-gray-600 max-w-xl mx-auto leading-relaxed">
            Fill out the form below to tell us a bit about yourself and how you'd like to contribute. Our team will review your application and get back to you shortly.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 md:p-10">
          {submitStatus.type && (
            <Alert
              className={`mb-8 ${
                submitStatus.type === "success"
                  ? "border-green-500 bg-green-50"
                  : "border-cksi-brand-red bg-red-50"
              }`}
            >
              {submitStatus.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-cksi-brand-red" />
              )}
              <AlertDescription
                className={
                  submitStatus.type === "success"
                    ? "text-green-800"
                    : "text-red-800"
                }
              >
                {submitStatus.message}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans font-bold text-xs text-[#151C27]">Full Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jane Doe"
                          {...field}
                          disabled={isSubmitting}
                          className="h-12 bg-gray-50/50 border-gray-200 font-sans focus-visible:ring-cksi-brand-red/30 focus-visible:border-cksi-brand-red rounded-xl placeholder:text-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Address */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans font-bold text-xs text-[#151C27]">Email Address *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="jane@example.com"
                          {...field}
                          disabled={isSubmitting}
                          className="h-12 bg-gray-50/50 border-gray-200 font-sans focus-visible:ring-cksi-brand-red/30 focus-visible:border-cksi-brand-red rounded-xl placeholder:text-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans font-bold text-xs text-[#151C27]">Phone Number *</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+234 ..."
                          {...field}
                          disabled={isSubmitting}
                          className="h-12 bg-gray-50/50 border-gray-200 font-sans focus-visible:ring-cksi-brand-red/30 focus-visible:border-cksi-brand-red rounded-xl placeholder:text-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* State / Country */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans font-bold text-xs text-[#151C27]">State *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Lagos"
                            {...field}
                            disabled={isSubmitting}
                            className="h-12 bg-gray-50/50 border-gray-200 font-sans focus-visible:ring-cksi-brand-red/30 focus-visible:border-cksi-brand-red rounded-xl placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans font-bold text-xs text-[#151C27]">Country *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nigeria"
                            {...field}
                            disabled={isSubmitting}
                            className="h-12 bg-gray-50/50 border-gray-200 font-sans focus-visible:ring-cksi-brand-red/30 focus-visible:border-cksi-brand-red rounded-xl placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Area of Interest */}
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans font-bold text-xs text-[#151C27]">Area of Interest *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 bg-gray-50/50 border-gray-200 font-sans focus:ring-cksi-brand-red/30 focus:border-cksi-brand-red rounded-xl">
                          <SelectValue placeholder="Select how you'd like to help" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {capacityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="font-sans">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Additional Help */}
              <FormField
                control={form.control}
                name="additionalHelp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans font-bold text-xs text-[#151C27]">How else can you help? (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about any specific skills or experience you'd like to share..."
                        className="min-h-[120px] resize-none bg-gray-50/50 border-gray-200 font-sans focus-visible:ring-cksi-brand-red/30 focus-visible:border-cksi-brand-red rounded-xl placeholder:text-gray-400 p-4"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-cksi-brand-red hover:bg-cksi-brand-red/90 text-white font-sans font-bold text-sm rounded-xl mt-4 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>

            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
