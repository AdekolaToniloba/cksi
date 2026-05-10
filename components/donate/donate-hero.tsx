import { Lock, ShieldCheck, Receipt } from "lucide-react";

export function DonateHero() {
  return (
    <section className="bg-[#C6E4F3] py-20 border-b border-gray-200">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
        <span className="block text-xs sm:text-sm font-sans font-bold tracking-[0.2em] text-[#4A6773] uppercase mb-4">
          SUPPORT OUR MISSION
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-serif text-[#151C27] mb-6">
          Give to CKSI
        </h1>
        <p className="text-base sm:text-lg font-sans text-[#4A6773] mb-12 max-w-2xl mx-auto">
          Your contribution directly supports individuals and families affected by sickle cell disorder across Nigeria.
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-[#4A6773]" />
            <span className="text-sm font-sans font-bold text-[#4A6773]">Secure Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#4A6773]" />
            <span className="text-sm font-sans font-bold text-[#4A6773]">100% to Programs</span>
          </div>
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-[#4A6773]" />
            <span className="text-sm font-sans font-bold text-[#4A6773]">Email Receipt</span>
          </div>
        </div>
      </div>
    </section>
  );
}
