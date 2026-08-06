"use client";

import { Search } from "lucide-react";
import { useSearch } from "@/components/search/search-provider";

export function HeroSearch() {
  const { setOpen } = useSearch();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="glass-panel glow-ring mx-auto flex w-full max-w-xl items-center gap-3 rounded-full px-5 py-4 text-left transition-transform hover:scale-[1.01]"
      aria-label="Search calculators"
    >
      <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
      <span className="flex-1 text-sm text-muted-foreground sm:text-base">
        Search 30+ calculators - mortgage, BMI, percentage...
      </span>
      <kbd className="hidden shrink-0 rounded border border-border bg-muted px-2 py-1 text-xs font-medium sm:block">
        ⌘K
      </kbd>
    </button>
  );
}
