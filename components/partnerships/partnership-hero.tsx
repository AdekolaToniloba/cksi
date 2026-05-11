import Link from "next/link";
import Image from "next/image";

export function PartnershipHero() {
  return (
    <section className="relative pt-24 pb-20 lg:py-32 overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop"
        alt="Professionals collaborating"
        fill
        className="object-cover object-center"
        priority
      />
      
      {/* Dark Overlay with subtle brown tint matching design */}
      <div className="absolute inset-0 bg-[#2C1D18]/80 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#151C27]/90 to-[#151C27]/40" />

      <div className="relative container px-4 md:px-6 max-w-6xl mx-auto z-10">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-serif text-white leading-tight mb-6">
            Partner With CKSI
          </h1>
          <p className="text-base sm:text-lg font-sans text-gray-200 leading-relaxed mb-10">
            Join us in creating sustainable, community-driven solutions. Whether you are a corporation, academic institution, or fellow NGO, your partnership can amplify our impact and bring lasting change.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              href="#proposal-form" 
              className="w-full sm:w-auto inline-flex items-center justify-center bg-cksi-brand-red hover:bg-cksi-brand-red/90 text-white font-sans font-bold text-sm px-8 py-3.5 rounded-sm transition-colors"
            >
              Send a Proposal
            </Link>
            <Link 
              href="#partnership-types" 
              className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border border-white/60 text-white hover:bg-white/10 font-sans font-bold text-sm px-8 py-3.5 rounded-sm transition-colors"
            >
              View Partnership Types
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
