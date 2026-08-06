import "server-only";
import fs from "node:fs";
import path from "node:path";
import { calculatorConfigSchema, type CalculatorConfig } from "./types";

const CALCULATORS_DIR = path.join(process.cwd(), "src/data/calculators");

let cache: CalculatorConfig[] | null = null;

/**
 * Reads every calculator JSON config from src/data/calculators/<category>/*.json,
 * validates it against calculatorConfigSchema, and caches the result for the
 * lifetime of the server process. Adding a calculator never touches this file -
 * drop a new JSON config (and register its compute function) and it appears here.
 */
function readAllConfigs(): CalculatorConfig[] {
  if (cache) return cache;

  const configs: CalculatorConfig[] = [];
  const categoryDirs = fs
    .readdirSync(CALCULATORS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  for (const dir of categoryDirs) {
    const categoryPath = path.join(CALCULATORS_DIR, dir.name);
    const files = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith(".json"));

    for (const file of files) {
      const raw = fs.readFileSync(path.join(categoryPath, file), "utf-8");
      let json: unknown;
      try {
        json = JSON.parse(raw);
      } catch (error) {
        throw new Error(`Invalid JSON in calculator config ${dir.name}/${file}: ${(error as Error).message}`);
      }
      const result = calculatorConfigSchema.safeParse(json);
      if (!result.success) {
        throw new Error(
          `Invalid calculator config ${dir.name}/${file}: ${result.error.message}`,
        );
      }
      configs.push(result.data);
    }
  }

  configs.sort((a, b) => a.title.localeCompare(b.title));
  cache = configs;
  return configs;
}

export function getAllCalculators(): CalculatorConfig[] {
  return readAllConfigs();
}

export function getCalculatorBySlug(slug: string): CalculatorConfig | undefined {
  return readAllConfigs().find((c) => c.slug === slug);
}

export function getCalculatorsByCategory(category: string): CalculatorConfig[] {
  return readAllConfigs().filter((c) => c.category === category);
}

export function getFeaturedCalculators(limit = 6): CalculatorConfig[] {
  return readAllConfigs()
    .filter((c) => c.featured)
    .slice(0, limit);
}

export function getPopularCalculators(limit = 8): CalculatorConfig[] {
  return readAllConfigs()
    .filter((c) => c.popular)
    .slice(0, limit);
}

export function getRecentlyAdded(limit = 8): CalculatorConfig[] {
  return [...readAllConfigs()]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, limit);
}

export function getRelatedCalculators(
  config: CalculatorConfig,
  limit = 4,
): CalculatorConfig[] {
  const all = readAllConfigs();
  const bySlug = new Map(all.map((c) => [c.slug, c]));

  const explicit = config.relatedSlugs
    .map((slug) => bySlug.get(slug))
    .filter((c): c is CalculatorConfig => Boolean(c));

  if (explicit.length >= limit) return explicit.slice(0, limit);

  const explicitSlugs = new Set(explicit.map((c) => c.slug));
  const sameCategory = all.filter(
    (c) => c.category === config.category && c.slug !== config.slug && !explicitSlugs.has(c.slug),
  );

  return [...explicit, ...sameCategory].slice(0, limit);
}

export interface SearchIndexItem {
  slug: string;
  category: string;
  title: string;
  description: string;
  icon: string;
}

export function getSearchIndex(): SearchIndexItem[] {
  return readAllConfigs().map((c) => ({
    slug: c.slug,
    category: c.category,
    title: c.title,
    description: c.description,
    icon: c.icon,
  }));
}
