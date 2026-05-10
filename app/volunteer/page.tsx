import type { Metadata } from "next";
import { VolunteerHero } from "@/components/volunteer/volunteer-hero";
import { VolunteerStats } from "@/components/volunteer/volunteer-stats";
import { VolunteerBenefits } from "@/components/volunteer/volunteer-benefits";
import { VolunteerForm } from "@/components/volunteer/volunteer-form";
import { VolunteerFAQ } from "@/components/volunteer/volunteer-faq";
import { VolunteerCTA } from "@/components/volunteer/volunteer-cta";

export const metadata: Metadata = {
  title: "Volunteer with CKSI | Make a Difference in Your Community",
  description: "Join CKSI's volunteer community and help transform lives through education, healthcare, and community development programs.",
};

export default function VolunteerPage() {
  return (
    <main className="min-h-screen">
      <VolunteerHero />
      <VolunteerStats />
      <VolunteerBenefits />
      <VolunteerForm />
      <VolunteerFAQ />
      <VolunteerCTA />
    </main>
  );
}
