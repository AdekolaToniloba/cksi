import { HeroSection } from "@/components/hero-section"
import { ImpactStats } from "@/components/impact-stats"
import { FeaturedPrograms } from "@/components/featured-programs"
import { RecentBlogPosts } from "@/components/recent-blog-posts"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { PartnerLogos } from "@/components/partner-logos"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ImpactStats />
      <FeaturedPrograms />
      <RecentBlogPosts />
      <TestimonialsCarousel />
      <PartnerLogos />
      <NewsletterSignup />
    </main>
  )
}
