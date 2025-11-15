// components/volunteer/volunteer-faq.tsx
"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { VolunteerFAQ } from "@/types/volunteer";

const faqs: VolunteerFAQ[] = [
  {
    question: "Who can volunteer with CKSI?",
    answer:
      "Anyone aged 18 and above with a passion for making a difference in their community is welcome to volunteer with CKSI. We welcome individuals from all backgrounds, professions, and skill levels. Whether you're a student, professional, retiree, or anyone in between, there's a place for you in our volunteer community.",
  },
  {
    question: "What time commitment is required?",
    answer:
      "We offer flexible volunteering opportunities to suit your schedule. Commitments can range from one-time event participation (a few hours) to ongoing weekly or monthly involvement. During the application process, we'll discuss your availability and match you with opportunities that fit your schedule.",
  },
  {
    question: "Do I need specific skills or experience?",
    answer:
      "While specific skills are valuable for certain roles (teaching, healthcare, technology), many of our volunteer opportunities require only enthusiasm and a willingness to learn. We provide orientation and training for all volunteers to ensure you feel confident and prepared in your role.",
  },
  {
    question: "Are there any costs involved in volunteering?",
    answer:
      "Volunteering with CKSI is completely free. However, volunteers are typically responsible for their own transportation to and from volunteer sites. For certain programs, we may provide meals or refreshments during volunteer sessions.",
  },
  {
    question: "What types of volunteer opportunities are available?",
    answer:
      "We have diverse opportunities including teaching and tutoring, healthcare support, event planning and coordination, mentorship programs, fundraising, administrative support, community outreach, technology and IT support, and skilled labor for facility improvements. We'll match you with roles that align with your interests and skills.",
  },
  {
    question: "How will I be contacted after submitting my application?",
    answer:
      "Our volunteer coordinator will review your application within 5-7 business days. You'll receive an email confirmation upon submission, followed by a personal email or phone call to discuss available opportunities, schedule an orientation, and answer any questions you may have.",
  },
  {
    question: "Can groups or organizations volunteer together?",
    answer:
      "Absolutely! We welcome corporate teams, student groups, faith-based organizations, and other groups looking to make an impact together. Group volunteering is a great team-building activity. Please contact us directly to discuss group volunteer opportunities and scheduling.",
  },
  {
    question: "What should I expect during my first volunteer session?",
    answer:
      "Your first session will include a brief orientation covering CKSI's mission, safety protocols, and your specific role. You'll be paired with an experienced volunteer or staff member who will guide you through your responsibilities. We ensure all new volunteers feel welcomed and supported.",
  },
  {
    question: "Can I volunteer if I don't live in Nigeria?",
    answer:
      "Yes! While many of our opportunities are location-based in Nigeria, we also have virtual volunteering options for international supporters. These include digital marketing, graphic design, content creation, online tutoring, fundraising support, and administrative tasks that can be done remotely.",
  },
  {
    question: "How can I make the biggest impact as a volunteer?",
    answer:
      "Consistency and reliability make the biggest impact. Regular volunteers build meaningful relationships with the communities we serve and develop deeper understanding of the work. Additionally, sharing your volunteer experiences with friends and family, using your professional skills to benefit our programs, and providing feedback to help us improve all contribute to creating lasting change in the communities we serve.",
  },
];

export function VolunteerFAQ() {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  return (
    <div
      className="w-full max-w-3xl mx-auto"
      data-testid="volunteer-faq-container"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">
          Find answers to common questions about volunteering with CKSI
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        value={openItem}
        onValueChange={setOpenItem}
        className="w-full"
        data-testid="volunteer-faq-accordion"
      >
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            data-testid={`faq-item-${index}`}
          >
            <AccordionTrigger
              className="text-left hover:no-underline"
              data-testid={`faq-trigger-${index}`}
            >
              <span className="font-medium">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent
              className="text-muted-foreground"
              data-testid={`faq-content-${index}`}
            >
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-10 p-6 bg-muted/50 rounded-lg text-center">
        <h3 className="font-semibold text-lg mb-2">Still have questions?</h3>
        <p className="text-muted-foreground mb-4">
          We&apos;re here to help! Reach out to our volunteer coordinator for
          more information.
        </p>
        <a
          href="mailto:volunteer@cksi.org"
          className="text-primary hover:underline font-medium"
          data-testid="volunteer-contact-link"
        >
          volunteer@cksi.org
        </a>
      </div>
    </div>
  );
}
