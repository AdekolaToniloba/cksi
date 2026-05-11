import { Building2, GraduationCap, PackageOpen } from "lucide-react";

export function PartnershipTypes() {
  const types = [
    {
      icon: Building2,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Corporate CSR",
      description: "Align your corporate social responsibility goals with our health initiatives. We offer structured programs that deliver measurable community impact and employee engagement.",
    },
    {
      icon: GraduationCap,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "NGO & Academic",
      description: "Collaborate on research, capacity building, and joint interventions. We value knowledge sharing and combining expertise to tackle complex healthcare challenges.",
    },
    {
      icon: PackageOpen,
      iconBg: "bg-red-50",
      iconColor: "text-cksi-brand-red",
      title: "In-Kind Support",
      description: "Provide essential resources, medical supplies, or specialized services. Operational support helps us direct more funding directly to community programs.",
    },
  ];

  return (
    <section id="partnership-types" className="bg-[#FAF8F5] py-20 lg:py-24">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <span className="block font-sans font-bold text-[10px] sm:text-xs text-cksi-brand-red tracking-[0.2em] uppercase mb-4">
            COLLABORATE
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#151C27]">
            Ways to Partner
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {types.map((type, index) => {
            const Icon = type.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100/50 flex flex-col hover:shadow-lg transition-shadow duration-300"
              >
                <div className={`w-12 h-12 rounded-full ${type.iconBg} flex items-center justify-center mb-6`}>
                  <Icon className={`h-5 w-5 ${type.iconColor}`} />
                </div>
                
                <h3 className="text-lg font-sans font-bold text-[#151C27] mb-3">
                  {type.title}
                </h3>
                <p className="text-sm font-sans text-gray-600 leading-relaxed">
                  {type.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
