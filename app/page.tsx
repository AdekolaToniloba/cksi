import { HeroSection } from "@/components/hero-section";
import { ImpactStats } from "@/components/impact-stats";
import { FeaturedPrograms } from "@/components/featured-programs";
import { RecentBlogPosts } from "@/components/recent-blog-posts";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { PartnerLogos } from "@/components/partner-logos";
import { VolunteerSection } from "@/components/volunteer/volunteer-section";
import { FeaturedEvents } from "@/components/featured-events";
import { NewsletterPopup } from "@/components/newsletter-popup";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />

      {/* Add breathing room between sections with padding */}
      <div className="space-y-0">
        <RecentBlogPosts />
        <FeaturedEvents limit={6} />
        <VolunteerSection />
        <NewsletterSignup />
      </div>

      <NewsletterPopup />
    </main>
  );
}
