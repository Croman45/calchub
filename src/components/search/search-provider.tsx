"use client";

import * as React from "react";
import type { SearchIndexItem } from "@/lib/calculators/registry";

interface SearchContextValue {
  index: SearchIndexItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
  recentSearches: string[];
  addRecentSearch: (slug: string) => void;
  clearRecentSearches: () => void;
}

const SearchContext = React.createContext<SearchContextValue | null>(null);

const RECENT_SEARCHES_KEY = "calchub:recent-searches";
const MAX_RECENT = 5;

export function SearchProvider({
  index,
  children,
}: {
  index: SearchIndexItem[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {
      // localStorage unavailable (private browsing, etc.) - fail silently.
    }
  }, []);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === "/" && !isTypingTarget(event.target)) {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const addRecentSearch = React.useCallback((slug: string) => {
    setRecentSearches((prev) => {
      const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, MAX_RECENT);
      try {
        window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch {
        // ignore write failures
      }
      return next;
    });
  }, []);

  const clearRecentSearches = React.useCallback(() => {
    setRecentSearches([]);
    try {
      window.localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = React.useMemo(
    () => ({ index, open, setOpen, recentSearches, addRecentSearch, clearRecentSearches }),
    [index, open, recentSearches, addRecentSearch, clearRecentSearches],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || target.isContentEditable;
}

export function useSearch(): SearchContextValue {
  const context = React.useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within a SearchProvider");
  return context;
}
