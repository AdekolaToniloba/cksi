import { HeartHandshake, Heart, BriefcaseMedical, ArrowRight } from "lucide-react";
import Link from "next/link";

export function QuickAnswers() {
  const cards = [
    {
      icon: HeartHandshake,
      title: "Volunteer with Us",
      description: "Join our community of advocates. Find out how you can lend your skills and time to our programs.",
      linkText: "Learn More",
      href: "/volunteer",
    },
    {
      icon: Heart,
      title: "Donations",
      description: "Have questions about your contribution or need a tax receipt? Our donor support team can help.",
      linkText: "Donor Support",
      href: "/donate",
    },
    {
      icon: BriefcaseMedical,
      title: "Clinic Visits",
      description: "Need to schedule a consultation or learn more about our medical outreach schedules?",
      linkText: "Medical Services",
      href: "/programs", // Adjust to correct route if needed
    },
  ];

  return (
    <div className="pt-12 mt-12 border-t border-gray-200/50">
      <h2 className="text-3xl font-serif text-[#151C27] text-center mb-10">
        Quick Answers
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div 
              key={index}
              className="bg-[#C9E7F6] rounded-2xl p-8 flex flex-col items-start hover:shadow-md transition-shadow"
            >
              <Icon className="h-6 w-6 text-cksi-brand-red mb-6" strokeWidth={2.5} />
              <h3 className="font-sans font-bold text-[#151C27] text-lg mb-3">
                {card.title}
              </h3>
              <p className="font-sans text-sm text-[#151C27]/80 leading-relaxed mb-8 flex-grow">
                {card.description}
              </p>
              <Link 
                href={card.href}
                className="inline-flex items-center gap-2 text-cksi-brand-red font-sans font-bold text-xs uppercase tracking-wider hover:gap-3 transition-all"
              >
                {card.linkText} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
