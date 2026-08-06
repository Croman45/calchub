import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { mdxComponents } from "@/components/blog/mdx-components";
import { AdSlot } from "@/components/shared/ad-slot";
import { JsonLd, SITE_URL } from "@/components/shared/json-ld";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog";
import { formatDate } from "@/lib/format-date";

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <Container className="py-8 sm:py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          author: { "@type": "Organization", name: post.author },
          url: `${SITE_URL}/blog/${post.slug}`,
        }}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_220px]">
        <article className="min-w-0">
          <header className="mb-8">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
            <p className="mt-3 text-lg text-muted-foreground">{post.description}</p>
            <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
              <span>{post.author}</span>
              <span aria-hidden="true">·</span>
              <span>{formatDate(post.date)}</span>
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes} min read</span>
            </div>
          </header>

          <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:scroll-mt-24 prose-a:text-primary prose-pre:rounded-xl">
            <MDXRemote
              source={post.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: "wrap" }],
                    [rehypePrettyCode, { theme: "github-dark", keepBackground: true }],
                  ],
                },
              }}
              components={mdxComponents}
            />
          </div>

          <div className="mt-10">
            <AdSlot format="in-article" slot="6666666666" />
          </div>
        </article>

        <aside className="hidden lg:block">
          <TableOfContents headings={post.headings} />
        </aside>
      </div>
    </Container>
  );
}
