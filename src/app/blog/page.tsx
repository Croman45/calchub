import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/shared/icon-map";
import { getAllBlogPosts } from "@/lib/blog";
import { formatDate } from "@/lib/format-date";

export const metadata: Metadata = {
  title: "Blog",
  description: "Explainers on the math and formulas behind CalcHub's calculators - finance, health, and more.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }]} />

      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Deep dives into the formulas and math behind CalcHub&apos;s calculators.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
            <Card className="h-full border-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="flex h-full flex-col gap-3 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon name={post.coverIcon} className="h-5 w-5" />
                </span>
                <h2 className="font-semibold leading-snug group-hover:text-primary">{post.title}</h2>
                <p className="line-clamp-3 text-sm text-muted-foreground">{post.description}</p>
                <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
                  <span>{formatDate(post.date)}</span>
                  <span>{post.readingMinutes} min read</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
