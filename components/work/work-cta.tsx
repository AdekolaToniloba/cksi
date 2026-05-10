import Link from "next/link";

export function WorkCTA() {
  return (
    <section className="bg-[#151C27] py-20 lg:py-24">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          <div className="max-w-2xl text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Have photos from our events?
            </h2>
            <p className="text-base font-sans text-gray-400 leading-relaxed">
              We love seeing the impact through your eyes. Share your moments with us to be featured in our community gallery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
            <Link 
              href="mailto:media@cksi.org?subject=Event%20Photos" 
              className="w-full sm:w-auto inline-flex items-center justify-center bg-cksi-brand-red hover:bg-cksi-brand-red/90 text-white font-sans font-bold text-sm px-8 py-3.5 rounded-full transition-colors"
            >
              Share Your Photos
            </Link>
            <Link 
              href="/contact" 
              className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border border-white/30 text-white hover:bg-white/10 font-sans font-bold text-sm px-8 py-3.5 rounded-full transition-colors"
            >
              Contact Us
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
