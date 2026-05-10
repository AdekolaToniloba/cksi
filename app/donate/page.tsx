import type { Metadata } from "next";
import { DonateHero } from "@/components/donate/donate-hero";
import { DonateForm } from "@/components/donate/donate-form";
import { DonateInfo } from "@/components/donate/donate-info";

export const metadata: Metadata = {
  title: "Donate - CKSI",
  description: "Support our mission to improve the lives of individuals and families affected by sickle cell disorder across Nigeria.",
};

export default function DonatePage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Top Banner */}
      <DonateHero />

      {/* Main Content Layout */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7 w-full max-w-2xl mx-auto lg:max-w-none">
              <DonateForm />
            </div>

            {/* Right Column: Info & Transparency */}
            <div className="lg:col-span-5 w-full max-w-2xl mx-auto lg:max-w-none">
              <DonateInfo />
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
