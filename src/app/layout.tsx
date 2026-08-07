import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SearchProvider } from "@/components/search/search-provider";
import { SearchCommand } from "@/components/search/search-command";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WebVitals } from "@/components/analytics/web-vitals";
import { getSearchIndex } from "@/lib/calculators/registry";
import { SITE_URL } from "@/components/shared/json-ld";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CalcHub - Fast, Free Online Calculators",
    template: "%s | CalcHub",
  },
  description:
    "Free, accurate, and instant calculators for finance, health, math, conversions, time, and construction. No sign-up required.",
  keywords: [
    "calculator",
    "online calculator",
    "mortgage calculator",
    "bmi calculator",
    "percentage calculator",
    "unit converter",
  ],
  authors: [{ name: "CalcHub" }],
  creator: "CalcHub",
  openGraph: {
    type: "website",
    siteName: "CalcHub",
    title: "CalcHub - Fast, Free Online Calculators",
    description:
      "Free, accurate, and instant calculators for finance, health, math, conversions, time, and construction.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "CalcHub - Fast, Free Online Calculators",
    description:
      "Free, accurate, and instant calculators for finance, health, math, conversions, time, and construction.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const searchIndex = getSearchIndex();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <TooltipProvider>
            <SearchProvider index={searchIndex}>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
              >
                Skip to content
              </a>
              <Header />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
              <SearchCommand />
            </SearchProvider>
          </TooltipProvider>
        </ThemeProvider>

        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}

        {ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        <WebVitals />
        <Analytics />
      </body>
    </html>
  );
}
