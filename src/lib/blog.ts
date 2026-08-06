import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import GithubSlugger from "github-slugger";
import { z } from "zod";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

const frontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  author: z.string(),
  tags: z.array(z.string()).default([]),
  coverIcon: z.string().default("BookOpen"),
});

export interface BlogHeading {
  depth: number;
  text: string;
  slug: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  coverIcon: string;
  content: string;
  readingMinutes: number;
  headings: BlogHeading[];
}

let cache: BlogPost[] | null = null;

function extractHeadings(markdown: string): BlogHeading[] {
  const slugger = new GithubSlugger();
  const headings: BlogHeading[] = [];
  const lines = markdown.split("\n");
  let inCodeFence = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = /^(#{2,3})\s+(.*)$/.exec(line.trim());
    if (match) {
      const depth = match[1].length;
      const text = match[2].trim();
      headings.push({ depth, text, slug: slugger.slug(text) });
    }
  }

  return headings;
}

function readAllPosts(): BlogPost[] {
  if (cache) return cache;

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    const frontmatter = frontmatterSchema.parse(data);
    const stats = readingTime(content);

    return {
      slug: file.replace(/\.mdx$/, ""),
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      author: frontmatter.author,
      tags: frontmatter.tags,
      coverIcon: frontmatter.coverIcon,
      content,
      readingMinutes: Math.max(1, Math.round(stats.minutes)),
      headings: extractHeadings(content),
    };
  });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  cache = posts;
  return posts;
}

export function getAllBlogPosts(): BlogPost[] {
  return readAllPosts();
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return readAllPosts().find((p) => p.slug === slug);
}
