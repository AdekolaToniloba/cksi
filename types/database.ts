// types/database.ts - Fixed version (remove duplicate enums)
import type {
  Role,
  PostStatus,
  ProgramStatus,
  MediaType,
  DonationStatus,
  DonationType,
} from "@prisma/client";

// Re-export the types so other files can import from here
export type {
  Role,
  PostStatus,
  ProgramStatus,
  MediaType,
  DonationStatus,
  DonationType,
};

// User types
export interface User {
  id: string;
  email: string;
  name: string | null;
  password: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  name?: string;
  password?: string;
  role?: Role;
}

// Blog types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  imageUrl: string | null;
  status: PostStatus;
  authorId: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: User;
}

export interface CreateBlogPostInput {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  status?: PostStatus;
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {
  id: string;
}

// Program types
export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  beneficiaries: string;
  location: string;
  duration: string;
  startDate: Date;
  status: ProgramStatus;
  progress: number | null;
  goal: string;
  achievements: string[];
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProgramInput {
  title: string;
  description: string;
  category: string;
  beneficiaries: string;
  location: string;
  duration: string;
  startDate: Date;
  goal: string;
  status?: ProgramStatus;
  progress?: number;
  achievements?: string[];
  imageUrl?: string;
}

// Gallery types
export interface GalleryEvent {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  location: string | null;
  eventDate: Date | null;
  coverImage: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  mediaItems: GalleryMedia[];
}

export interface GalleryMedia {
  id: string;
  eventId: string;
  title: string | null;
  description: string | null;
  mediaUrl: string;
  mediaType: MediaType;
  fileSize: number | null;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  orderIndex: number;
  isPublished: boolean;
  cloudinaryPublicId: string | null;
  cloudinaryFolder: string | null;
  cloudinaryVersion: string | null;
  cloudinaryFormat: string | null;
  cloudinaryTags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Donation types
export interface Donation {
  id: string;
  donorName: string | null;
  donorEmail: string;
  donorPhone: string | null;
  amount: number;
  currency: string;
  campaignId: string | null;
  paymentReference: string;
  paystackReference: string | null;
  status: DonationStatus;
  isAnonymous: boolean;
  donationType: DonationType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDonationInput {
  donorEmail: string;
  amount: number;
  donorName?: string;
  donorPhone?: string;
  currency?: string;
  campaignId?: string;
  isAnonymous?: boolean;
  donationType?: DonationType;
}

// Homepage content types
export interface HomepageContent {
  id: string;
  section: string;
  title: string | null;
  content: string | null;
  orderIndex: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// Hero Carousel types
export interface HeroCarousel {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  mediaUrl: string;
  mediaType: MediaType;
  cloudinaryId: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHeroCarouselInput {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  mediaUrl: string;
  mediaType: MediaType;
  cloudinaryId?: string;
  orderIndex?: number;
}

// Prisma client types
export type PrismaClientType = import("@prisma/client").PrismaClient;

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
