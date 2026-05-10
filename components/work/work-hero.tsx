import Link from "next/link";

export function WorkHero() {
  return (
    <section className="bg-[#151C27] pt-24 pb-20 lg:py-32">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
        <span className="block font-sans font-bold text-[10px] sm:text-xs text-[#EAEFF8]/70 tracking-[0.2em] uppercase mb-6">
          WHAT WE DO
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-8">
          Our Work Across Nigeria
        </h1>
        <p className="text-base sm:text-lg font-sans text-gray-300 leading-relaxed max-w-2xl mx-auto mb-12">
          From genotype testing in rural communities to genetic counseling for young couples — here is how CKSI creates lasting change.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="#gallery" 
            className="w-full sm:w-auto inline-flex items-center justify-center bg-cksi-brand-red hover:bg-cksi-brand-red/90 text-white font-sans font-bold text-sm px-8 py-3.5 rounded-full transition-colors"
          >
            View Our Gallery
          </Link>
          <Link 
            href="/programs" 
            className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border border-white/30 text-white hover:bg-white/10 font-sans font-bold text-sm px-8 py-3.5 rounded-full transition-colors"
          >
            Our Programs
          </Link>
        </div>
      </div>
    </section>
  );
}
