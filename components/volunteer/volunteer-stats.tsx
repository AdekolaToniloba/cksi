import { Users, Heart, Clock, Award } from "lucide-react";

export function VolunteerStats() {
  const stats = [
    {
      value: "250+",
      label: "ACTIVE VOLUNTEERS",
    },
    {
      value: "15k",
      label: "LIVES IMPACTED",
    },
    {
      value: "10k",
      label: "VOLUNTEER HOURS",
    },
    {
      value: "12",
      label: "ACTIVE PROGRAMS",
    },
  ];

  return (
    <section className="bg-white py-12 border-b border-gray-100">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center divide-x-0 md:divide-x divide-gray-100 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center space-y-2">
              <span className="text-4xl md:text-5xl font-serif text-cksi-brand-red">
                {stat.value}
              </span>
              <span className="text-[10px] md:text-xs font-sans font-bold text-[#151C27] tracking-[0.15em] uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
