import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    category: "About CKSI",
    items: [
      {
        question: "What is the mission of CKSI?",
        answer: "Our mission is to empower communities through health equity, focusing on providing comprehensive care, education, and advocacy for individuals and families affected by sickle cell disorder in Nigeria. We believe in holistic support that addresses both medical and social needs.",
      },
      {
        question: "Where are your medical programs located?",
        answer: "Our primary medical programs and outreach centers are located across several states in Nigeria. Please contact us for a detailed list of our current operational centers and partner clinics.",
      },
    ]
  },
  {
    category: "Sickle Cell Disorder",
    items: [
      {
        question: "How can I get tested for the sickle cell trait?",
        answer: "You can get tested at any certified medical laboratory or hospital. We also organize periodic free or subsidized genotype testing drives in various communities.",
      },
      {
        question: "What support do you offer for families?",
        answer: "We offer medical subsidies, counseling services, educational support, and community advocacy programs to ensure families have the necessary resources to manage sickle cell disorder effectively.",
      },
    ]
  },
  {
    category: "Getting Involved",
    items: [
      {
        question: "How are my donations used?",
        answer: "100% of public donations go directly to our programs. Administrative costs are covered by our board of directors and specific institutional grants.",
      },
      {
        question: "Can I volunteer if I don't have a medical background?",
        answer: "Absolutely! We need volunteers for event organization, digital advocacy, fundraising, content creation, and administrative support. Everyone has a role to play in our mission.",
      },
    ]
  }
];

export function FaqList() {
  return (
    <section className="bg-[#FAF8F5] pb-24 w-full">
      <div className="container mx-auto px-4 max-w-3xl">
        {faqData.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-12 last:mb-0">
            {/* Section Header */}
            <h2 className="text-2xl font-serif text-[#517B8C] mb-4">
              {section.category}
            </h2>
            <div className="h-px w-full bg-gray-200 mb-2"></div>
            
            {/* Accordion List */}
            <Accordion type="single" collapsible className="w-full space-y-0">
              {section.items.map((item, itemIndex) => (
                <AccordionItem 
                  key={itemIndex} 
                  value={`item-${sectionIndex}-${itemIndex}`}
                  className="border-b border-gray-100 last:border-0"
                >
                  <AccordionTrigger className="text-left font-sans font-bold text-[#151C27] text-base hover:no-underline hover:text-cksi-brand-red transition-colors py-5 data-[state=open]:text-cksi-brand-red">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-sans text-gray-600 text-sm sm:text-base leading-relaxed pb-6 pr-6">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </section>
  );
}
