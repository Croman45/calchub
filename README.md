# CalcHub

Fast, free, mobile-first calculators for finance, health, math, conversions, time, and
construction - built with Next.js 15, React 19, and TypeScript, designed to scale to thousands
of calculators without touching application code.

## Tech stack

- **Next.js 15** (App Router, React Server Components, static generation)
- **React 19** + **TypeScript** (strict mode)
- **Tailwind CSS v4** + **shadcn/ui** (Radix primitives)
- **Framer Motion** (animations, respects `prefers-reduced-motion`)
- **Zod** + **React Hook Form** (type-safe, validated calculator forms)
- **Recharts** (lazy-loaded result charts)
- **next-mdx-remote** (blog, RSC-compatible MDX rendering)
- **next-sitemap** (sitemap.xml + robots.txt generation)
- **Vitest** + **React Testing Library** (unit/integration tests)
- **Playwright** (end-to-end tests)

> **Note on next-seo:** the requested stack included `next-seo`, which is built for the Pages
> Router and doesn't support React Server Components. This project uses Next.js 15's native
> [Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
> instead (`generateMetadata`, `alternates.canonical`, Open Graph, Twitter Cards) plus hand-rolled
> JSON-LD components - the modern, supported equivalent for the App Router.

## Installation

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` as needed (all variables are optional in development - see
[Environment variables](#environment-variables)).

## Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

Other useful commands:

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run test        # Vitest unit/integration tests (watch: npm run test:watch)
npm run test:e2e    # Playwright end-to-end tests (requires `npx playwright install` once)
npm run build        # Production build
npm run start         # Serve the production build locally
```

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL base for metadata, sitemap.xml, robots.txt, and JSON-LD. Defaults to a placeholder if unset. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional | Google Analytics 4 measurement ID. When unset, no analytics script loads at all. |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Optional | Google AdSense publisher ID. When unset, ad slots render a clearly-labeled placeholder instead of live ads. |

See [`.env.example`](.env.example).

## Deployment

### Vercel (recommended)

Push to a Git repository and import it in Vercel - `vercel.json` and the Next.js framework
preset handle the rest. Set the environment variables above in the Vercel project settings.

### Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://your-domain.com \
  -t calchub .
docker run -p 3000:3000 calchub
```

The `Dockerfile` uses Next's `output: "standalone"` mode for a minimal, self-contained runtime
image with no `node_modules` bloat.

### GitHub Actions

`.github/workflows/ci.yml` runs lint, typecheck, unit tests, a production build, and a Playwright
end-to-end suite on every push and pull request to `main`.

## Folder structure

```
src/
  app/                          # App Router pages
    [category]/                 # Category listing page (e.g. /finance)
      [slug]/                   # Individual calculator page (e.g. /finance/mortgage)
    about/ contact/ privacy/ terms/ disclaimer/
    blog/ blog/[slug]/
    categories/
    search/
    api/contact/route.ts        # Contact form API route
    layout.tsx                  # Root layout: providers, header, footer, analytics
    page.tsx                    # Home page
    not-found.tsx                # 404 page
  components/
    calculator/                 # The reusable calculator engine UI
    shared/                     # Cards, breadcrumbs, ad slots, icon map, JSON-LD, etc.
    layout/                     # Header, footer
    search/                     # Command palette, search provider, search results
    blog/                       # MDX component overrides, table of contents
    analytics/                  # Web Vitals reporting
    providers/                  # Theme provider
  data/
    categories.ts               # The 11 category definitions
    calculators/<category>/*.json   # One JSON config per calculator (see below)
  content/
    blog/*.mdx                  # Blog posts
  lib/
    calculators/
      types.ts                  # Zod schema + TypeScript types for calculator configs
      registry.ts                # Reads and validates every calculator JSON (server-only)
      compute-registry.ts        # Maps a calculator's slug to its compute function
      form-schema.ts             # Builds a Zod form schema from a calculator's field config
      expression-evaluator.ts     # Safe (no eval) math expression parser for the Scientific calculator
      formulas/*.ts               # Pure calculation functions, grouped by category
      formulas/*.test.ts          # Unit tests for the formulas above
    blog.ts                      # Reads and parses blog MDX + frontmatter (server-only)
e2e/                             # Playwright end-to-end tests
next-sitemap.config.js           # Sitemap/robots generation config
```

## Adding a new calculator

CalcHub's calculator engine is entirely config-driven - the generic UI (form, results, chart,
formula explanation, step-by-step solution, examples, FAQ, related calculators, breadcrumbs,
JSON-LD) is shared by every calculator. Adding calculator #33 (or #5,000) takes two steps:

1. **Add a JSON config** at `src/data/calculators/<category>/<slug>.json` describing its fields,
   FAQs, examples, SEO content, and formula explanation. It's validated against
   `calculatorConfigSchema` (in `src/lib/calculators/types.ts`) at build time, so a malformed
   config fails the build immediately instead of shipping a broken page.
2. **Write and register a compute function** - a pure function
   `(inputs: CalculatorInputs) => CalculatorComputeResult` - in the matching
   `src/lib/calculators/formulas/<category>.ts` file, then add one line to
   `src/lib/calculators/compute-registry.ts` mapping the JSON config's `slug` to that function.

That's it - no page, route, sitemap entry, or search-index change required. The dynamic route
(`src/app/[category]/[slug]/page.tsx`) picks up the new config automatically via
`generateStaticParams`, `next-sitemap.config.js` includes it in the next sitemap build, and the
command palette search index is generated from the same registry.

If a calculator's math can't be expressed as simple field inputs (like the Scientific
Calculator's keypad), special-case its slug in `CalculatorClient`
(`src/components/calculator/calculator-client.tsx`) to render a bespoke component instead of the
generic form - the rest of the page template (formula explanation, FAQ, related calculators,
JSON-LD) still applies around it.

## SEO

- **Metadata**: every page sets `title`, `description`, and `alternates.canonical` via the
  Metadata API; calculator and blog pages also set Open Graph and Twitter Card metadata.
- **Structured data**: `BreadcrumbList`, `FAQPage`, and `SoftwareApplication` JSON-LD on every
  calculator page; `BlogPosting` JSON-LD on blog posts.
- **Sitemap & robots**: generated by `next-sitemap` as a `postbuild` step, reading every
  calculator, category, and blog post directly from `src/data` and `src/content` so it's always
  in sync with what's actually deployed.
- **Breadcrumbs**: rendered on every calculator, category, blog, and legal page, both visually
  and as `BreadcrumbList` JSON-LD.

## Performance

- **Server Components by default** - only interactive pieces (forms, theme toggle, search,
  charts) are Client Components.
- **Static generation** - every calculator and blog post is pre-rendered at build time via
  `generateStaticParams`.
- **Lazy-loaded charts** - Recharts is loaded via `next/dynamic` with `ssr: false`, so calculators
  without a chart never load the charting library at all.
- **`next/font`** - Geist fonts are self-hosted and loaded with `display: swap`, avoiding
  render-blocking font requests.
- **Reserved ad space** - every `AdSlot` has a fixed `min-height` so ads never cause layout shift
  (CLS), whether or not AdSense is configured.
- **No client-side data fetching for calculators** - all calculator math runs synchronously in
  the browser using the same pure functions from `src/lib/calculators/formulas`, so results
  appear instantly with zero network round-trips.

## Accessibility

- Semantic landmarks, a "Skip to content" link, and visible focus states throughout.
- All form fields have associated `<label>`s, `aria-describedby` help/error text, and
  `aria-invalid` on validation failure.
- Color choices target WCAG AA contrast in both light and dark themes.
- `prefers-reduced-motion` is respected globally (animations collapse to near-zero duration).

## Testing

- **Unit tests** (`src/lib/calculators/formulas/*.test.ts`) verify every formula against known
  values or independent simulations (e.g. mortgage payments are cross-checked by simulating the
  full amortization schedule with the computed payment and asserting the ending balance is ~$0).
- **Integration test** (`src/components/calculator/calculator-client.test.tsx`) renders the real
  calculator engine end-to-end - JSON config → form → live computed result → validation errors.
- **End-to-end tests** (`e2e/smoke.spec.ts`) cover navigation, search, theming, and a real
  calculator flow in a browser via Playwright.
