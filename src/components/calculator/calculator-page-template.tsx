import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { AdSlot } from "@/components/shared/ad-slot";
import { CalculatorClient } from "@/components/calculator/calculator-client";
import { FormulaBlock } from "@/components/calculator/formula-block";
import { FaqBlock } from "@/components/calculator/faq-block";
import { RelatedCalculators } from "@/components/calculator/related-calculators";
import { Icon } from "@/components/shared/icon-map";
import { getCategoryBySlug } from "@/data/categories";
import { getRelatedCalculators } from "@/lib/calculators/registry";
import type { CalculatorConfig } from "@/lib/calculators/types";

export function CalculatorPageTemplate({ config }: { config: CalculatorConfig }) {
  const category = getCategoryBySlug(config.category);
  const related = getRelatedCalculators(config);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: category?.name ?? config.category, href: `/${config.category}` },
    { label: config.shortTitle ?? config.title, href: `/${config.category}/${config.slug}` },
  ];

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon name={config.icon} className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{config.title}</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">{config.description}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0 space-y-10">
          <CalculatorClient config={config} />

          <AdSlot format="in-article" slot="1111111111" />

          {config.formula.expression && <FormulaBlock formula={config.formula} />}

          <SeoContent config={config} />

          <AdSlot format="in-article" slot="2222222222" />

          <FaqBlock faqs={config.faqs} />

          <RelatedCalculators calculators={related} />
        </div>

        <aside className="space-y-6">
          <div className="sticky top-24">
            <AdSlot format="sidebar" slot="3333333333" />
          </div>
        </aside>
      </div>
    </Container>
  );
}

function SeoContent({ config }: { config: CalculatorConfig }) {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight">
      {config.seoContent.map((section) => (
        <section key={section.heading} className="mb-6">
          <h2 className="text-xl font-semibold">{section.heading}</h2>
          <p className="text-muted-foreground">{section.body}</p>
        </section>
      ))}
    </div>
  );
}
