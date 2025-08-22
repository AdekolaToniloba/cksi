// utils/validation.ts
import { z } from "zod";

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Newsletter validation
export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
});

// Blog post validation
export const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

// Program validation
export const programSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  beneficiaries: z.string().min(1, "Beneficiaries field is required"),
  location: z.string().min(1, "Location is required"),
  duration: z.string().min(1, "Duration is required"),
  startDate: z.date(),
  goal: z.string().min(10, "Goal must be at least 10 characters"),
  status: z.enum(["ACTIVE", "COMPLETED", "PAUSED"]).default("ACTIVE"),
  progress: z.number().min(0).max(100).optional(),
  achievements: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional(),
});

// Donation validation
export const donationSchema = z.object({
  amount: z.number().min(100, "Minimum donation amount is ₦100"),
  donorEmail: z.string().email("Please enter a valid email address"),
  donorName: z.string().optional(),
  donorPhone: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  donationType: z.enum(["ONE_TIME", "MONTHLY"]).default("ONE_TIME"),
});

// Authentication validation
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

// Gallery validation
export const galleryEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  location: z.string().optional(),
  eventDate: z.date().optional(),
  coverImage: z.string().url().optional(),
});

// Homepage content validation
export const homepageContentSchema = z.object({
  section: z.string().min(1, "Section is required"),
  title: z.string().optional(),
  content: z.string().optional(),
  orderIndex: z.number().optional(),
});
