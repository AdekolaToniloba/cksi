//lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Validate and clean environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate Supabase URL format
function validateSupabaseUrl(url: string | undefined): string {
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }

  // Check if it's a PostgreSQL connection string (common mistake)
  if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL should be your Supabase project URL (https://your-project.supabase.co), not a PostgreSQL connection string. " +
        "You can find your project URL in the Supabase dashboard under Settings > API."
    );
  }

  // Check if it's a valid Supabase URL format
  if (!url.startsWith("https://") || !url.includes(".supabase.co")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL should be in the format: https://your-project-id.supabase.co"
    );
  }

  return url;
}

// Validate Supabase anon key format
function validateSupabaseKey(key: string | undefined, keyName: string): string {
  if (!key) {
    throw new Error(`Missing ${keyName} environment variable`);
  }

  // Basic validation for Supabase key format
  if (!key.startsWith("eyJ") || key.length < 100) {
    throw new Error(
      `${keyName} appears to be invalid. It should be a JWT token starting with 'eyJ' and be quite long. ` +
        "You can find your keys in the Supabase dashboard under Settings > API."
    );
  }

  return key;
}

let validatedUrl: string;
let validatedAnonKey: string;

try {
  validatedUrl = validateSupabaseUrl(supabaseUrl);
  validatedAnonKey = validateSupabaseKey(
    supabaseAnonKey,
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
} catch (error) {
  console.error("Supabase configuration error:", error);
  throw error;
}

// Client-side Supabase client
export const supabase = createClient(validatedUrl, validatedAnonKey);

// Server-side client (only use when service role key is available)
export const createServerClient = () => {
  if (!supabaseServiceRoleKey) {
    console.warn(
      "SUPABASE_SERVICE_ROLE_KEY not found, using anon key for server client"
    );
    return createClient(validatedUrl, validatedAnonKey);
  }

  try {
    const validatedServiceKey = validateSupabaseKey(
      supabaseServiceRoleKey,
      "SUPABASE_SERVICE_ROLE_KEY"
    );
    return createClient(validatedUrl, validatedServiceKey);
  } catch (error) {
    console.warn("Invalid service role key, falling back to anon key:", error);
    return createClient(validatedUrl, validatedAnonKey);
  }
};

// Type definitions for our database
export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          category: string;
          tags: string[];
          image_url: string | null;
          status: "draft" | "published";
          author_id: string;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          category: string;
          tags?: string[];
          image_url?: string | null;
          status?: "draft" | "published";
          author_id: string;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          category?: string;
          tags?: string[];
          image_url?: string | null;
          status?: "draft" | "published";
          author_id?: string;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      programs: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          category: string;
          beneficiaries: string;
          location: string;
          duration: string;
          start_date: string;
          status: "active" | "completed" | "paused";
          progress: number | null;
          goal: string;
          achievements: string[];
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          category: string;
          beneficiaries: string;
          location: string;
          duration: string;
          start_date: string;
          status?: "active" | "completed" | "paused";
          progress?: number | null;
          goal: string;
          achievements?: string[];
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          category?: string;
          beneficiaries?: string;
          location?: string;
          duration?: string;
          start_date?: string;
          status?: "active" | "completed" | "paused";
          progress?: number | null;
          goal?: string;
          achievements?: string[];
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      gallery_items: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string;
          category: string;
          date_taken: string | null;
          location: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url: string;
          category: string;
          date_taken?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image_url?: string;
          category?: string;
          date_taken?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      homepage_content: {
        Row: {
          id: string;
          section: string;
          title: string | null;
          content: string | null;
          order_index: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section: string;
          title?: string | null;
          content?: string | null;
          order_index?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section?: string;
          title?: string | null;
          content?: string | null;
          order_index?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      donations: {
        Row: {
          id: string;
          donor_name: string | null;
          donor_email: string;
          donor_phone: string | null;
          amount: number;
          currency: string;
          campaign_id: string | null;
          payment_reference: string;
          paystack_reference: string | null;
          status: "pending" | "completed" | "failed";
          is_anonymous: boolean;
          donation_type: "one-time" | "monthly";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          donor_name?: string | null;
          donor_email: string;
          donor_phone?: string | null;
          amount: number;
          currency?: string;
          campaign_id?: string | null;
          payment_reference: string;
          paystack_reference?: string | null;
          status?: "pending" | "completed" | "failed";
          is_anonymous?: boolean;
          donation_type?: "one-time" | "monthly";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          donor_name?: string | null;
          donor_email?: string;
          donor_phone?: string | null;
          amount?: number;
          currency?: string;
          campaign_id?: string | null;
          payment_reference?: string;
          paystack_reference?: string | null;
          status?: "pending" | "completed" | "failed";
          is_anonymous?: boolean;
          donation_type?: "one-time" | "monthly";
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
