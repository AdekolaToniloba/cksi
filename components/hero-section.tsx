import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative w-full bg-cksi-warm flex flex-col ">
      {/* Main Hero Area */}
      <div className="relative w-full min-h-[80vh] md:min-h-[85vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dyhbo6rzr/image/upload/v1778441908/cksi/events/general/images/1778441903182-CKSI%20NGO%20%281%29.jpg"
            alt="CKSI volunteers fighting sickle cell in Nigeria"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 text-left">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <span className="block text-[10px] sm:text-xs font-sans font-bold tracking-widest text-white uppercase mb-4">
              Fighting Sickle Cell in Nigeria
            </span>
            
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-serif text-white leading-[1.1] mb-6">
              Every Nigerian Family Deserves to Know Their Genotype
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg text-white/90 font-sans max-w-2xl mb-10 leading-relaxed">
              Awareness, early detection, and compassionate care. We are empowering communities with knowledge and resources to manage and prevent Sickle Cell Disorder.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg"
                className="bg-white text-cksi-brand-red hover:bg-gray-100 hover:text-cksi-brand-red/90 rounded-full font-sans font-bold text-sm sm:text-base px-8 h-14"
              >
                <Link href="/programs">Our Programs</Link>
              </Button>
              <Button 
                asChild 
                size="lg"
                variant="outline"
                className="bg-transparent border border-white text-white hover:bg-white/10 hover:text-white rounded-full font-sans font-bold text-sm sm:text-base px-8 h-14"
              >
                <Link href="/about/scd">Learn About SCD</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="w-full bg-[#2A3441] py-12 relative z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {/* Stat 1 */}
            <div className="flex flex-col items-center justify-center text-center px-4 pt-4 sm:pt-0">
              <span className="font-serif text-4xl sm:text-5xl text-white mb-2">15,000+</span>
              <span className="font-sans text-xs sm:text-sm text-white/80 font-semibold tracking-wider">Lives Impacted</span>
            </div>
            
            {/* Stat 2 */}
            <div className="flex flex-col items-center justify-center text-center px-4 pt-4 sm:pt-0">
              <span className="font-serif text-4xl sm:text-5xl text-white mb-2">8+</span>
              <span className="font-sans text-xs sm:text-sm text-white/80 font-semibold tracking-wider">Active Programs</span>
            </div>
            
            {/* Stat 3 */}
            <div className="flex flex-col items-center justify-center text-center px-4 pt-4 sm:pt-0">
              <span className="font-serif text-4xl sm:text-5xl text-white mb-2">2010</span>
              <span className="font-sans text-xs sm:text-sm text-white/80 font-semibold tracking-wider">Year Founded</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
