# CKSI Website Setup Guide

## Environment Variables Setup

To run the admin system, you need to configure the following environment variables in your `.env.local` file:

### Required Environment Variables

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Paystack Configuration (for donations)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
\`\`\`

### How to Get Supabase Keys

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to Settings > API
3. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### How to Get Paystack Keys

1. Go to [paystack.com](https://paystack.com) and create an account
2. Navigate to Settings > API Keys & Webhooks
3. Copy the following:
   - **Public Key** → `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
   - **Secret Key** → `PAYSTACK_SECRET_KEY`

### Database Setup

After setting up Supabase, run the SQL commands provided in the previous conversation to create the necessary tables and sample data.

### Admin User Setup

1. In your Supabase dashboard, go to Authentication > Users
2. Create a new user with email: `admin@cksi.org.ng`
3. Set a secure password
4. The user will automatically have admin access based on the database setup

## Running the Application

1. Install dependencies: `npm install`
2. Set up environment variables in `.env.local`
3. Run the development server: `npm run dev`
4. Access the admin panel at: `http://localhost:3000/admin/login`

## Features

- ✅ Public website with all pages
- ✅ Admin authentication system
- ✅ Content management for blog, programs, gallery
- ✅ Donation system with Paystack integration
- ✅ Dashboard with analytics
- ✅ Responsive design
