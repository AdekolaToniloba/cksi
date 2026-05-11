import { CheckCircle2 } from "lucide-react";

export function PartnershipValue() {
  const values = [
    {
      title: "Deep Community Access",
      description: "Trusted relationships built over years ensure programs are accepted and effective.",
    },
    {
      title: "Proven Track Record",
      description: "A proven track record of successful interventions and scale across health care areas.",
    },
    {
      title: "Strong Advocacy Presence",
      description: "Active at policy level to drive systemic change beyond individual interventions.",
    },
    {
      title: "Transparent Reporting",
      description: "Rigorous monitoring and evaluation to demonstrate the ROI of your partnership.",
    },
  ];

  return (
    <section className="bg-[#F0F3FF] py-20 lg:py-24">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - List */}
          <div>
            <span className="block font-sans font-bold text-[10px] sm:text-xs text-cksi-brand-red tracking-[0.2em] uppercase mb-4">
              OUR VALUE
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#151C27] mb-10">
              Why Partner With Us?
            </h2>
            
            <div className="space-y-6">
              {values.map((val, index) => (
                <div key={index} className="flex items-start gap-4">
                  <CheckCircle2 className="h-5 w-5 text-cksi-brand-red shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-sans font-bold text-[#151C27] text-base mb-1">
                      {val.title}
                    </h3>
                    <p className="font-sans text-sm text-gray-600 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Stats Box */}
          <div className="bg-[#151C27] rounded-xl p-10 md:p-14 flex flex-col justify-center gap-10">
            <div>
              <span className="block text-4xl md:text-5xl font-serif text-cksi-brand-red mb-2">
                15+
              </span>
              <span className="font-sans font-bold text-[10px] sm:text-xs text-white tracking-[0.15em] uppercase">
                YEARS OF SERVICE
              </span>
            </div>
            
            <div className="h-px w-12 bg-gray-700" />
            
            <div>
              <span className="block text-4xl md:text-5xl font-serif text-cksi-brand-red mb-2">
                50+
              </span>
              <span className="font-sans font-bold text-[10px] sm:text-xs text-white tracking-[0.15em] uppercase">
                ACTIVE PARTNERSHIPS
              </span>
            </div>

            <div className="h-px w-12 bg-gray-700" />

            <div>
              <span className="block text-4xl md:text-5xl font-serif text-cksi-brand-red mb-2">
                8+
              </span>
              <span className="font-sans font-bold text-[10px] sm:text-xs text-white tracking-[0.15em] uppercase">
                CORE IMPACT AREAS
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
