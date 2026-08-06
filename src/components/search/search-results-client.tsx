"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import { CalculatorCard } from "@/components/shared/calculator-card";
import { useSearch } from "@/components/search/search-provider";
import { Search } from "lucide-react";

export function SearchResultsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { index } = useSearch();

  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = React.useState(initialQuery);

  const fuse = React.useMemo(
    () =>
      new Fuse(index, {
        keys: [
          { name: "title", weight: 2 },
          { name: "description", weight: 1 },
          { name: "category", weight: 0.5 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [index],
  );

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).map((r) => r.item);
  }, [fuse, query]);

  function handleChange(value: string) {
    setQuery(value);
    const params = new URLSearchParams();
    if (value) params.set("q", value);
    router.replace(`/search${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  }

  return (
    <div>
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search calculators..."
          className="pl-9"
          autoFocus
          aria-label="Search calculators"
        />
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {query.trim()
          ? `${results.length} result${results.length === 1 ? "" : "s"} for "${query}"`
          : "Start typing to search all calculators."}
      </p>

      {results.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((item) => (
            <CalculatorCard key={item.slug} calculator={item} />
          ))}
        </div>
      )}
    </div>
  );
}
