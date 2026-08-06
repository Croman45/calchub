import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact CalcHub",
  description: "Get in touch with the CalcHub team - report a bug, suggest a calculator, or ask a question.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }]} />

      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact us</h1>
        <p className="mt-3 text-muted-foreground">
          Found a bug, have a calculator idea, or just want to say hello? Send us a message and
          we&apos;ll get back to you.
        </p>

        <Card className="mt-8 border-border/60">
          <CardContent className="p-6">
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
