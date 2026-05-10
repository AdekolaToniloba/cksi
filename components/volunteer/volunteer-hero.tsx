import Link from "next/link";
import Image from "next/image";

export function VolunteerHero() {
  return (
    <section className="bg-[#2A2E35] pt-24 pb-16 lg:py-24">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column */}
          <div className="max-w-xl text-center lg:text-left mx-auto lg:mx-0">
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-serif text-white leading-tight mb-6 tracking-tight">
              Volunteer with CKSI
            </h1>
            <p className="text-base sm:text-lg font-sans text-gray-300 leading-relaxed mb-10">
              Join our community of dedicated advocates. Your time and skills can help us provide essential care, education, and support to families navigating sickle cell disorder across Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link 
                href="#volunteer-form" 
                className="w-full sm:w-auto inline-flex items-center justify-center bg-cksi-brand-red hover:bg-cksi-brand-red/90 text-white font-sans font-bold text-sm px-8 py-3.5 rounded-full transition-colors"
              >
                Apply to Volunteer
              </Link>
              <Link 
                href="#faq" 
                className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border border-white text-white hover:bg-white/10 font-sans font-bold text-sm px-8 py-3.5 rounded-full transition-colors"
              >
                Read FAQs
              </Link>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-full aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl bg-[#A87C6D]">
            <Image
              src="https://res.cloudinary.com/dyhbo6rzr/image/upload/v1764332576/cksi/events/general/images/1764332572814-IMG_0258.jpg"
              alt="CKSI Volunteers"
              fill
              className="object-cover object-center mix-blend-multiply opacity-90"
              priority
            />
            {/* Overlay Text */}
            <div className="absolute inset-x-0 top-12 flex justify-center text-center">
              <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-serif text-white tracking-tight drop-shadow-md">
                CKSI | Volunteer
              </h2>
            </div>
            {/* Small decorative text at bottom */}
            <div className="absolute inset-x-0 bottom-8 flex justify-center">
              <span className="font-sans font-bold text-[8px] text-white/70 uppercase tracking-[0.3em]">
                MAKE AN IMPACT · JOIN THE COMMUNITY
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
