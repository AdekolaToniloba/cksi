// types/volunteer.ts
import { Volunteer, VolunteerCapacity, VolunteerStatus } from "@prisma/client";

// Re-export Prisma enums to use throughout the app
export { VolunteerCapacity, VolunteerStatus } from "@prisma/client";

export interface VolunteerFormData {
  name: string;
  email: string;
  phone: string;
  state: string;
  country: string;
  capacity: VolunteerCapacity;
  additionalHelp: string;
  receiveUpdates: boolean;
}

export type VolunteerSubmission = Volunteer;

export interface VolunteerFAQItem {
  question: string;
  answer: string;
}

export interface VolunteerApiResponse {
  success: boolean;
  message: string;
  data?: VolunteerSubmission;
  error?: string;
}

export interface VolunteerMetrics {
  totalSubmissions: number;
  pendingReview: number;
  approved: number;
  byCapacity: Record<VolunteerCapacity, number>;
  recentSubmissions: VolunteerSubmission[];
}

export interface VolunteerFAQ {
  question: string;
  answer: string;
}

export interface VolunteerApiResponse {
  success: boolean;
  message: string;
  data?: VolunteerSubmission;
  error?: string;
}

export interface VolunteerMetrics {
  totalSubmissions: number;
  pendingReview: number;
  approved: number;
  byCapacity: Record<VolunteerCapacity, number>;
  recentSubmissions: VolunteerSubmission[];
}
