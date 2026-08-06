import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/shared/icon-map";
import { ArrowRight } from "lucide-react";
import type { CategoryMeta } from "@/data/categories";

export function CategoryCard({ category, count }: { category: CategoryMeta; count: number }) {
  return (
    <Link href={`/${category.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
        <CardContent className="flex h-full flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon name={category.icon} className="h-6 w-6" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
          <span className="mt-auto text-xs font-medium text-muted-foreground">
            {count} calculator{count === 1 ? "" : "s"}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
