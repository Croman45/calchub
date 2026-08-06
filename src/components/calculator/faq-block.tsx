import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { CalculatorFaq } from "@/lib/calculators/types";

export function FaqBlock({ faqs }: { faqs: CalculatorFaq[] }) {
  if (!faqs.length) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Frequently asked questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={faq.question} value={`faq-${index}`}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
