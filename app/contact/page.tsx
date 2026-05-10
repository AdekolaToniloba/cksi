import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import { QuickAnswers } from "@/components/contact/quick-answers";

export const metadata: Metadata = {
  title: "Contact Us | CKSI",
  description: "Get in touch with the CKSI team. Whether you want to volunteer, partner, or learn about our programs, we are here to help.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <ContactHero />
      
      <section className="bg-[#FAF8F5] py-16 lg:py-24">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-16 items-start">
            {/* Left Column: Form */}
            <ContactForm />

            {/* Right Column: Info */}
            <ContactInfo />
          </div>

          <QuickAnswers />

        </div>
      </section>
    </main>
  );
}
