import Link from "next/link";
import { Calculator } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { Container } from "@/components/shared/container";

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <Container className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2 space-y-3 lg:col-span-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient-bg text-white">
              <Calculator className="h-4 w-4" />
            </span>
            <span className="text-lg">CalcHub</span>
          </Link>
          <p className="max-w-sm text-sm text-muted-foreground">
            Fast, free, and accurate calculators for finance, health, math, and everyday life -
            no sign-up required.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Categories</h3>
          <ul className="mt-3 space-y-2">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <li key={cat.slug}>
                <Link href={`/${cat.slug}`} className="text-sm text-muted-foreground hover:text-foreground">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-3 space-y-2">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Legal</h3>
          <ul className="mt-3 space-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-border/60 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} CalcHub. All rights reserved.</p>
          <p>Results are estimates for informational purposes - not professional advice.</p>
        </Container>
      </div>
    </footer>
  );
}
