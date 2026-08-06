const fs = require("node:fs");
const path = require("node:path");

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://calchub.example.com";

const CATEGORY_SLUGS = [
  "finance",
  "health",
  "math",
  "construction",
  "education",
  "conversions",
  "time",
  "fitness",
  "everyday",
  "business",
  "science",
];

function listCalculatorPaths() {
  const calculatorsDir = path.join(process.cwd(), "src/data/calculators");
  const paths = [];

  for (const categoryDir of fs.readdirSync(calculatorsDir, { withFileTypes: true })) {
    if (!categoryDir.isDirectory()) continue;
    const categoryPath = path.join(calculatorsDir, categoryDir.name);

    for (const file of fs.readdirSync(categoryPath)) {
      if (!file.endsWith(".json")) continue;
      const raw = JSON.parse(fs.readFileSync(path.join(categoryPath, file), "utf-8"));
      paths.push({
        loc: `/${raw.category}/${raw.slug}`,
        lastmod: new Date(raw.dateAdded).toISOString(),
        changefreq: "monthly",
        priority: raw.featured ? 0.9 : 0.7,
      });
    }
  }

  return paths;
}

function listBlogPaths() {
  const blogDir = path.join(process.cwd(), "src/content/blog");
  if (!fs.existsSync(blogDir)) return [];

  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(blogDir, file), "utf-8");
      const dateMatch = /^date:\s*"?([\d-]+)"?/m.exec(raw);
      return {
        loc: `/blog/${file.replace(/\.mdx$/, "")}`,
        lastmod: dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString(),
        changefreq: "yearly",
        priority: 0.6,
      };
    });
}

function listCategoryPaths() {
  return CATEGORY_SLUGS.map((slug) => ({
    loc: `/${slug}`,
    changefreq: "weekly",
    priority: 0.8,
  }));
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["/api/*", "/search"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/search"] },
    ],
  },
  additionalPaths: async () => [
    ...listCategoryPaths(),
    ...listCalculatorPaths(),
    ...listBlogPaths(),
  ],
};
