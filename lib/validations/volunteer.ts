// lib/validations/volunteer.ts
import { z } from "zod";
import { VolunteerCapacity } from "@/types/volunteer";

export const volunteerFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  email: z.string().email("Please enter a valid email address").toLowerCase(),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be less than 20 digits")
    .regex(/^[\d\s+()-]+$/, "Please enter a valid phone number"),

  state: z
    .string()
    .min(2, "State is required")
    .max(100, "State name is too long"),

  country: z
    .string()
    .min(2, "Country is required")
    .max(100, "Country name is too long"),

  capacity: z.nativeEnum(VolunteerCapacity, {
    errorMap: () => ({ message: "Please select a valid volunteer capacity" }),
  }),

  additionalHelp: z
    .string()
    .min(
      10,
      "Please provide at least 10 characters describing how you can help"
    )
    .max(1000, "Description must be less than 1000 characters"),

  receiveUpdates: z.boolean().default(false),
});

export type VolunteerFormInput = z.infer<typeof volunteerFormSchema>;
