"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type AdFormat = "horizontal" | "rectangle" | "sidebar" | "in-article";

const FORMAT_STYLES: Record<AdFormat, { minHeight: string; label: string }> = {
  horizontal: { minHeight: "90px", label: "728 x 90" },
  rectangle: { minHeight: "250px", label: "300 x 250" },
  sidebar: { minHeight: "600px", label: "300 x 600" },
  "in-article": { minHeight: "200px", label: "Fluid" },
};

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

/**
 * Reserves ad space with a fixed min-height (avoids CLS) and either renders a
 * real AdSense unit (when NEXT_PUBLIC_ADSENSE_CLIENT + slot are configured)
 * or a clearly-labeled placeholder in development so layout can be reviewed
 * without an approved AdSense account.
 */
export function AdSlot({
  format = "horizontal",
  slot,
  className,
}: {
  format?: AdFormat;
  slot?: string;
  className?: string;
}) {
  const insRef = React.useRef<HTMLModElement>(null);
  const { minHeight, label } = FORMAT_STYLES[format];
  const isConfigured = Boolean(ADSENSE_CLIENT && slot);

  React.useEffect(() => {
    if (!isConfigured) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // AdSense script not yet loaded or blocked - fail silently.
    }
  }, [isConfigured]);

  return (
    <div
      className={cn("mx-auto flex w-full flex-col items-center justify-center gap-1", className)}
      style={{ minHeight }}
      aria-label="Advertisement"
      role="complementary"
    >
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
        Advertisement
      </span>
      {isConfigured ? (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block", width: "100%", minHeight }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div
          className="flex w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-xs text-muted-foreground"
          style={{ minHeight }}
        >
          Ad space ({label})
        </div>
      )}
    </div>
  );
}
