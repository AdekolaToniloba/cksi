import type { Metadata } from "next";
import { PartnershipHero } from "@/components/partnerships/partnership-hero";
import { PartnershipTypes } from "@/components/partnerships/partnership-types";
import { PartnershipValue } from "@/components/partnerships/partnership-value";
import { PartnershipForm } from "@/components/partnerships/partnership-form";
// import { TrustedBy } from "@/components/partnerships/trusted-by";
import { PartnershipCTA } from "@/components/partnerships/partnership-cta";

export const metadata: Metadata = {
  title: "Partner With Us | CKSI",
  description: "Join forces with CKSI to create sustainable change. We work with corporate partners, local businesses, and international organizations.",
};

export default function PartnershipsPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <PartnershipHero />
      <PartnershipTypes />
      <PartnershipValue />
      <PartnershipForm />
      {/* <TrustedBy /> */}
      <PartnershipCTA />
    </main>
  );
}
