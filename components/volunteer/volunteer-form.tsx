// components/volunteer/volunteer-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
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
  {
    value: VolunteerCapacity.EVENT_PLANNING,
    label: "Event Planning & Coordination",
  },
  { value: VolunteerCapacity.TECHNOLOGY, label: "Technology & IT Support" },
  {
    value: VolunteerCapacity.ADMINISTRATION,
    label: "Administration & Office Support",
  },
  { value: VolunteerCapacity.COMMUNITY_OUTREACH, label: "Community Outreach" },
  {
    value: VolunteerCapacity.SKILLED_LABOR,
    label: "Skilled Labor & Construction",
  },
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
      receiveUpdates: false,
    },
  });

  const onSubmit = async (data: VolunteerFormInput) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: VolunteerApiResponse = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: result.message,
        });
        form.reset();

        // Scroll to success message
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
    <div
      className="w-full max-w-2xl mx-auto"
      data-testid="volunteer-form-container"
    >
      {submitStatus.type && (
        <Alert
          className={`mb-6 ${
            submitStatus.type === "success"
              ? "border-green-500 bg-green-50 dark:bg-green-950"
              : "border-red-500 bg-red-50 dark:bg-red-950"
          }`}
          data-testid={`volunteer-form-${submitStatus.type}`}
        >
          {submitStatus.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          data-testid="volunteer-form"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    disabled={isSubmitting}
                    data-testid="volunteer-input-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                      disabled={isSubmitting}
                      data-testid="volunteer-input-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+234 800 000 0000"
                      {...field}
                      disabled={isSubmitting}
                      data-testid="volunteer-input-phone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Lagos"
                      {...field}
                      disabled={isSubmitting}
                      data-testid="volunteer-input-state"
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
                  <FormLabel>Country *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nigeria"
                      {...field}
                      disabled={isSubmitting}
                      data-testid="volunteer-input-country"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How would you like to volunteer? *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger data-testid="volunteer-select-capacity">
                      <SelectValue placeholder="Select a capacity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {capacityOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        data-testid={`volunteer-capacity-${option.value}`}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalHelp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How else can you help? *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your skills, experience, and what you hope to contribute..."
                    className="min-h-[120px] resize-none"
                    {...field}
                    disabled={isSubmitting}
                    data-testid="volunteer-textarea-additional-help"
                  />
                </FormControl>
                <FormDescription>
                  Please provide at least 10 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="receiveUpdates"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                    data-testid="volunteer-checkbox-updates"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Receive CKSI updates and communications</FormLabel>
                  <FormDescription>
                    Stay informed about our programs, events, and volunteer
                    opportunities via email.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            data-testid="volunteer-submit-button"
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
  );
}
