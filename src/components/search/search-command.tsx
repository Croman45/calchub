"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSearch } from "./search-provider";
import { Icon } from "@/components/shared/icon-map";
import { getCategoryBySlug } from "@/data/categories";
import { History, X } from "lucide-react";

export function SearchCommand() {
  const router = useRouter();
  const { index, open, setOpen, recentSearches, addRecentSearch, clearRecentSearches } = useSearch();
  const [query, setQuery] = React.useState("");

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
    return fuse.search(query, { limit: 8 }).map((r) => r.item);
  }, [fuse, query]);

  const recentItems = React.useMemo(
    () => recentSearches.map((slug) => index.find((i) => i.slug === slug)).filter(Boolean),
    [recentSearches, index],
  ) as typeof index;

  function handleSelect(slug: string, category: string) {
    addRecentSearch(slug);
    setOpen(false);
    setQuery("");
    router.push(`/${category}/${slug}`);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search calculators"
      description="Search all CalcHub calculators by name or topic"
    >
      <CommandInput
        placeholder="Search 30+ calculators... (mortgage, BMI, percentage)"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {query.trim() ? "No calculators found." : "Type to search 30+ calculators..."}
        </CommandEmpty>

        {!query.trim() && recentItems.length > 0 && (
          <>
            <CommandGroup heading="Recent searches">
              {recentItems.map((item) => (
                <CommandItem
                  key={item.slug}
                  value={`recent-${item.slug}`}
                  onSelect={() => handleSelect(item.slug, item.category)}
                >
                  <History className="h-4 w-4 text-muted-foreground" />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
              <CommandItem value="clear-recent" onSelect={clearRecentSearches} className="text-muted-foreground">
                <X className="h-4 w-4" />
                <span>Clear recent searches</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {query.trim() && (
          <CommandGroup heading="Calculators">
            {results.map((item) => {
              const category = getCategoryBySlug(item.category);
              return (
                <CommandItem
                  key={item.slug}
                  value={item.slug}
                  onSelect={() => handleSelect(item.slug, item.category)}
                >
                  <Icon name={item.icon} className="h-4 w-4 text-primary" />
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    <span className="text-xs text-muted-foreground">{category?.name}</span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
