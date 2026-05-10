import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Newsreader } from "next/font/google";
import { Quote } from "lucide-react";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["500"],
  style: ["italic"],
  display: "swap",
});

export function MissionSection() {
  return (
    <section className="w-full bg-[#F9F9FF] py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Text & CTA */}
          <div className="flex flex-col max-w-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif text-cksi-dark leading-[1.2] mb-6">
              Sickle cell affects 1 in 4 Nigerians. We&apos;re here to change the narrative.
            </h2>
            <p className="text-base sm:text-lg text-cksi-body font-sans leading-relaxed mb-8">
              Our mission is rooted in community action and medical advocacy. We believe that through education, widespread testing, and robust support networks, we can significantly reduce the burden of Sickle Cell Disorder across the nation.
            </p>
            <div>
              <Button 
                asChild 
                className="bg-[#AF262A] hover:bg-[#AF262A]/90 text-white rounded-full font-sans font-semibold text-base px-8 h-12 sm:h-14"
              >
                <Link href="/about">Read Our Story</Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Quote */}
          <div className="relative w-full h-full flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-xl bg-[#C6E4F3] border border-[#C9E7F6] rounded-2xl p-8 sm:p-12 md:p-16 relative overflow-hidden">
              {/* Decorative Quote Mark */}
              <div className="absolute top-6 left-6 sm:top-8 sm:left-8 opacity-40">
                <span className="font-serif text-8xl text-[#9ABED1] leading-none select-none">
                  &ldquo;
                </span>
              </div>
              
              {/* Quote Text */}
              <p 
                className={`${newsreader.className} text-[#4A6773] text-xl sm:text-2xl md:text-[28px] leading-[1.6] relative z-10 pt-6 sm:pt-8`}
              >
                &quot;Empowering families with the knowledge of their genotype is the first step towards a healthier, sickle-cell free generation.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
