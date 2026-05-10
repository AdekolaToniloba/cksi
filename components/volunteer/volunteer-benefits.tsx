import { TrendingUp, Users, Clock, Award } from "lucide-react";

export function VolunteerBenefits() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Personal Growth",
      description: "Develop new skills in advocacy, event management, and community outreach while working alongside experienced healthcare and NGO professionals.",
    },
    {
      icon: Users,
      title: "Vibrant Community",
      description: "Join a passionate, diverse network of individuals united by a common goal. Form lasting connections and be part of a supportive, empathetic family.",
    },
    {
      icon: Clock,
      title: "Flexible Commitment",
      description: "Whether you can offer a few hours a month remotely or want to lead on-the-ground field events, we have roles that fit your schedule and capacity.",
    },
    {
      icon: Award,
      title: "Meaningful Recognition",
      description: "Your contributions matter. We ensure our volunteers are recognized, celebrated, and provided with letters of recommendation and certificates of service.",
    },
  ];

  return (
    <section className="bg-[#C6E4F3] py-20 lg:py-24">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-serif text-[#151C27] mb-12">
          Why Volunteer with Us?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 relative overflow-hidden group"
              >
                {/* Subtle red corner accent */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <Icon className="h-6 w-6 text-cksi-brand-red mb-6" strokeWidth={2.5} />
                  <h3 className="text-xl font-sans font-bold text-[#151C27] mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-sm font-sans text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
