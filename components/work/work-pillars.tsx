import { Heart, BookOpen, Users } from "lucide-react";
import Link from "next/link";

export function WorkPillars() {
  const pillars = [
    {
      icon: Heart,
      title: "Health",
      description: "Providing vital genotype testing, genetic counseling, and access to essential medications for families navigating sickle cell disorder.",
      linkText: "Learn More",
      href: "/programs/health",
      theme: "red",
    },
    {
      icon: BookOpen,
      title: "Education",
      description: "Driving awareness through community outreach, school programs, and culturally relevant educational materials to dispel myths.",
      linkText: "Learn More",
      href: "/programs/education",
      theme: "dark",
    },
    {
      icon: Users,
      title: "Community",
      description: "Mobilizing support networks, organizing advocacy events, and empowering local leaders to champion sickle cell awareness.",
      linkText: "Learn More",
      href: "/programs/community",
      theme: "dark",
    },
  ];

  return (
    <section className="bg-[#FAF8F5] py-20 lg:py-24">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-[#151C27] mb-4">
            Three Pillars of Impact
          </h2>
          <p className="text-base font-sans text-gray-600 leading-relaxed">
            Every initiative we run falls under one of these focus areas that together build stronger, healthier Nigerian families.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const isRed = pillar.theme === "red";
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group flex flex-col border-t-4"
                style={{ borderTopColor: isRed ? '#AF262A' : '#151C27' }}
              >
                {/* Decorative background circle */}
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-50 blur-2xl group-hover:opacity-100 transition-opacity duration-500" 
                     style={{ backgroundColor: isRed ? '#fef2f2' : '#f1f5f9' }} 
                />
                
                <div className="relative z-10 flex flex-col h-full items-start">
                  <Icon 
                    className={`h-6 w-6 mb-6 ${isRed ? 'text-cksi-brand-red' : 'text-[#4A5568]'}`} 
                    strokeWidth={2.5} 
                    fill={isRed ? "#AF262A" : "currentColor"}
                  />
                  <h3 className="text-xl font-sans font-bold text-[#151C27] mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-sm font-sans text-gray-600 leading-relaxed mb-8 flex-grow">
                    {pillar.description}
                  </p>
                  
                  <Link 
                    href={pillar.href}
                    className={`inline-flex items-center gap-1 font-sans font-bold text-xs uppercase tracking-wider transition-all ${
                      isRed ? 'text-cksi-brand-red hover:text-red-800' : 'text-[#151C27] hover:text-gray-600'
                    }`}
                  >
                    {pillar.linkText} <span>→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
