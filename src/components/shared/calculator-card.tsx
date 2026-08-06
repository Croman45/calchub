import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/shared/icon-map";
import { ArrowRight } from "lucide-react";
import { getCategoryBySlug } from "@/data/categories";

export interface CalculatorCardData {
  slug: string;
  category: string;
  title: string;
  description: string;
  icon: string;
}

export function CalculatorCard({ calculator }: { calculator: CalculatorCardData }) {
  const category = getCategoryBySlug(calculator.category);

  return (
    <Link href={`/${calculator.category}/${calculator.slug}`} className="group block h-full">
      <Card className="h-full border-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
        <CardContent className="flex h-full flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon name={calculator.icon} className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold leading-snug">{calculator.title}</h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">{calculator.description}</p>
          </div>
          {category && (
            <span className="mt-auto text-xs font-medium text-primary/80">{category.name}</span>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
