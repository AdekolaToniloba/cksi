"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { VolunteerFAQ } from "@/types/volunteer";
import { ChevronDown } from "lucide-react";

const faqs: VolunteerFAQ[] = [
  {
    question: "Do I need prior experience to volunteer?",
    answer: "Not at all! While specialized skills are welcome for certain roles (like medical support or specialized PR), most of our volunteer positions only require passion, dedication, and a willingness to learn. We provide onboarding and training for all active volunteers.",
  },
  {
    question: "What is the minimum time commitment?",
    answer: "We offer flexible volunteering opportunities to suit your schedule. Commitments can range from one-time event participation (a few hours) to ongoing weekly or monthly involvement.",
  },
  {
    question: "Can I volunteer remotely?",
    answer: "Yes! While many of our opportunities are location-based in Nigeria, we also have virtual volunteering options for international supporters. These include digital marketing, graphic design, content creation, online tutoring, and administrative tasks.",
  },
  {
    question: "Are there age restrictions for volunteering?",
    answer: "Anyone aged 18 and above with a passion for making a difference in their community is welcome to volunteer with CKSI. For minors, we offer specific youth programs requiring guardian consent.",
  },
  {
    question: "Do volunteers receive certificates?",
    answer: "Yes, we ensure our volunteers are recognized, celebrated, and provided with letters of recommendation and certificates of service upon completion of their commitments.",
  },
];

export function VolunteerFAQ() {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  return (
    <section id="faq" className="bg-[#F9F9FF] py-20 lg:py-24">
      <div className="container px-4 md:px-6 mx-auto max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-serif text-[#151C27] text-center mb-12">
          Frequently Asked Questions
        </h2>

        <Accordion
          type="single"
          collapsible
          value={openItem}
          onValueChange={setOpenItem}
          className="w-full space-y-4"
        >
          {faqs.map((faq, index) => {
            const value = `item-${index}`;
            const isOpen = openItem === value;
            return (
              <AccordionItem
                key={index}
                value={value}
                className="bg-white border border-gray-100 rounded-xl px-6 py-2 overflow-hidden shadow-sm"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className={`text-sm md:text-base font-sans text-left transition-colors ${
                    isOpen ? "font-bold text-[#151C27]" : "font-semibold text-[#151C27]"
                  }`}>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm font-sans text-gray-600 leading-relaxed pb-6 pt-2 border-t border-gray-100/50 mt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
