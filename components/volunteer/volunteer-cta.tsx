import { Mail } from "lucide-react";
import Link from "next/link";

export function VolunteerCTA() {
  return (
    <section className="bg-[#2A2E35] py-20 lg:py-24">
      <div className="container px-4 md:px-6 mx-auto text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
          Still have questions?
        </h2>
        <p className="text-base font-sans text-gray-400 leading-relaxed mb-10 max-w-xl mx-auto">
          Reach out directly to our volunteer coordination team. We're here to help you find the perfect fit.
        </p>
        <Link
          href="mailto:volunteer@cksi.org"
          className="inline-flex items-center justify-center gap-3 bg-cksi-brand-red hover:bg-cksi-brand-red/90 text-white font-sans font-bold text-sm px-8 py-4 rounded-full transition-all hover:scale-105"
        >
          <Mail className="h-4 w-4" />
          volunteer@cksi.org
        </Link>
      </div>
    </section>
  );
}
