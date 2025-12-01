import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  const faqs = [
    {
      q: "How are donations used?",
      a: "100% of public donations go directly to our programs. Administrative costs are covered by our board.",
    },
    {
      q: "Can I volunteer remotely?",
      a: "Yes! We have digital advocacy, graphic design, and fundraising roles available.",
    },
    {
      q: "Is CKSI a registered NGO?",
      a: "Yes, we are fully registered with the CAC in Nigeria.",
    },
  ];

  return (
    <div className="container py-24 max-w-3xl">
      <h1 className="text-4xl font-bold text-blue-950 mb-8 text-center">
        Frequently Asked Questions
      </h1>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-lg font-medium text-slate-800">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 text-base leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
