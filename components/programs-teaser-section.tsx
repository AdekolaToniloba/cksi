import Link from "next/link";
import { FlaskConical, Brain, Megaphone, ArrowRight } from "lucide-react";

export function ProgramsTeaserSection() {
  const programs = [
    {
      id: "genotype-testing",
      title: "Genotype Testing",
      description: "Facilitating accessible and affordable genotype screening for communities across Nigeria to ensure informed decisions.",
      icon: FlaskConical,
      href: "/programs/genotype-testing"
    },
    {
      id: "genetic-counseling",
      title: "Genetic Counseling",
      description: "Providing expert guidance and emotional support to individuals and families navigating genotype compatibility.",
      icon: Brain,
      href: "/programs/genetic-counseling"
    },
    {
      id: "sickle-cell-awareness",
      title: "Sickle Cell Awareness",
      description: "Running widespread educational campaigns to demystify Sickle Cell Disorder and combat stigma in our society.",
      icon: Megaphone,
      href: "/programs/awareness"
    }
  ];

  return (
    <section className="w-full bg-[#F0F3FF] py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        {/* Section Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="block text-[11px] sm:text-xs font-sans font-bold tracking-widest text-[#AF262A] uppercase mb-4">
            OUR IMPACT AREAS
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#1C1917] tracking-tight">
            What We Do
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div 
              key={program.id}
              className="bg-white rounded-[24px] p-8 sm:p-10 flex flex-col items-start shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Icon Container */}
              <div className="w-16 h-16 rounded-full bg-[#FCE8E8] flex items-center justify-center mb-8">
                <program.icon className="h-7 w-7 text-[#AF262A]" strokeWidth={2} />
              </div>
              
              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-sans font-bold text-[#1C1917] mb-4">
                {program.title}
              </h3>
              
              {/* Description */}
              <p className="text-[#6B7280] font-sans leading-relaxed mb-10 flex-grow text-base">
                {program.description}
              </p>
              
              {/* Link */}
              <Link 
                href={program.href}
                className="inline-flex items-center gap-2 text-sm font-sans font-bold text-[#AF262A] hover:text-[#AF262A]/80 transition-colors group mt-auto"
              >
                Learn More
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
