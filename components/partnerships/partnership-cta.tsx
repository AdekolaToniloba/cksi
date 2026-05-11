import Link from "next/link";

export function PartnershipCTA() {
  return (
    <section className="bg-[#151C27] py-20 lg:py-24">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto text-center">
        
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-10">
          Ready to make an impact together?
        </h2>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="#proposal-form" 
            className="w-full sm:w-auto inline-flex items-center justify-center bg-cksi-brand-red hover:bg-cksi-brand-red/90 text-white font-sans font-bold text-sm px-8 py-3.5 rounded-sm transition-colors"
          >
            Send a Proposal
          </Link>
          <Link 
            href="/contact" 
            className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border border-white/30 text-white hover:bg-white/10 font-sans font-bold text-sm px-8 py-3.5 rounded-sm transition-colors"
          >
            Contact Us
          </Link>
        </div>

      </div>
    </section>
  );
}
