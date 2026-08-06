import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, ShieldCheck, Code2, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About CalcHub",
  description: "CalcHub builds fast, accurate, free calculators for finance, health, math, and everyday life - no sign-up, no clutter.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    icon: Zap,
    title: "Instant, every time",
    body: "Every calculation runs in your browser the moment you finish typing - no page reloads, no waiting on a server.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Nothing you type into a calculator is sent to or stored on our servers. Your numbers stay on your device.",
  },
  {
    icon: Code2,
    title: "Formulas you can verify",
    body: "Every calculator shows the exact formula and a worked step-by-step solution, so you never have to just trust a black box.",
  },
  {
    icon: Heart,
    title: "Free, no catch",
    body: "No sign-up, no subscription, no paywalled results. CalcHub is supported by unobtrusive advertising, nothing more.",
  },
];

export default function AboutPage() {
  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]} />

      <div className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About CalcHub</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          CalcHub started from a simple frustration: most online calculators are cluttered,
          slow, or hide their math behind ads and pop-ups. We wanted a place with dozens of
          genuinely useful calculators that load instantly, explain exactly how they work, and
          respect your time and your data.
        </p>
        <p className="mt-4 text-muted-foreground">
          Today CalcHub covers finance, health, math, conversions, time, and construction, with
          more categories on the way. Every calculator is built on the same foundation: a
          documented formula, a step-by-step worked solution, real examples, and answers to the
          questions people actually ask.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {VALUES.map((value) => (
          <Card key={value.title} className="border-border/60">
            <CardContent className="flex gap-4 p-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <value.icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold">{value.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{value.body}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
