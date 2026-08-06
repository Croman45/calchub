"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { BlogHeading } from "@/lib/blog";

export function TableOfContents({ headings }: { headings: BlogHeading[] }) {
  const [activeSlug, setActiveSlug] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveSlug(visible.target.id);
      },
      { rootMargin: "-100px 0px -70% 0px" },
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.slug);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="sticky top-24 space-y-2 text-sm">
      <p className="font-semibold">On this page</p>
      <ul className="space-y-2 border-l border-border">
        {headings.map((heading) => (
          <li key={heading.slug} style={{ paddingLeft: heading.depth === 3 ? "1.5rem" : "1rem" }}>
            <a
              href={`#${heading.slug}`}
              className={cn(
                "block -ml-px border-l-2 border-transparent pl-3 text-muted-foreground transition-colors hover:text-foreground",
                activeSlug === heading.slug && "border-primary text-foreground",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
