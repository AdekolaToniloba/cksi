import { FaqHero } from "@/components/faq/faq-hero";
import { FaqList } from "@/components/faq/faq-list";
import { FaqCta } from "@/components/faq/faq-cta";

export const metadata = {
  title: "FAQ | CKSI",
  description: "Find answers to common questions about our organization, sickle cell disorder, and how you can make a difference in our community.",
};

export default function FAQPage() {
  return (
    <main className="flex min-h-screen flex-col w-full">
      <FaqHero />
      <FaqList />
      <FaqCta />
    </main>
  );
}
