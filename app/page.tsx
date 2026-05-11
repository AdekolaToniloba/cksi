import { HeroSection } from "@/components/hero-section";
import { MissionSection } from "@/components/mission-section";
import { ProgramsTeaserSection } from "@/components/programs-teaser-section";
import { VolunteerSection } from "@/components/volunteer/volunteer-section";
import { FeaturedUpdates } from "@/components/home/featured-updates";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <MissionSection />
      <ProgramsTeaserSection />

      <div className="space-y-0">
        {/* FeaturedUpdates: server component — fetches 3 latest gallery events */}
        <FeaturedUpdates />
        <VolunteerSection />
      </div>
    </main>
  );
}
