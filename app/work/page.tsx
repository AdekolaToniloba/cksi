import type { Metadata } from "next";
import { WorkHero } from "@/components/work/work-hero";
import { WorkPillars } from "@/components/work/work-pillars";
import { WorkStats } from "@/components/work/work-stats";
import { WorkGallery } from "@/components/work/work-gallery";
import { WorkCTA } from "@/components/work/work-cta";

export const metadata: Metadata = {
  title: "Our Work | CKSI",
  description: "Explore the impact of CKSI across Nigeria through our health, education, and community pillars.",
};

export default function OurWorkPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <WorkHero />
      <WorkPillars />
      <WorkStats />
      <WorkGallery />
      <WorkCTA />
    </main>
  );
}
