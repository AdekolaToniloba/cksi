// types/forms.ts
import { DonationType } from "@prisma/client";

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface NewsletterSignupData {
  email: string;
  name?: string;
}

export interface DonationFormData {
  amount: number;
  donorName?: string;
  donorEmail: string;
  donorPhone?: string;
  isAnonymous: boolean;
  donationType: DonationType;
}

export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormState<T = unknown> {
  data: T;
  errors: FormFieldError[];
  isSubmitting: boolean;
  isSubmitted: boolean;
  isValid: boolean;
}
