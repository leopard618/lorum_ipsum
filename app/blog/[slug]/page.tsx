import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAdjacent,
  getPostBySlug,
  posts,
} from "@/lib/blogPosts";

import BlogDetailClient from "./BlogDetailClient";

/**
 * Per-post detail route.
 *
 * Server-rendered & statically generated for every slug in
 * `lib/blogPosts.ts` so navigating into an article is a simple static
 * fetch — no client-side data loading. The actual presentation (a
 * three-pane FullPageScroller layout) lives in
 * `./BlogDetailClient.tsx`, which receives the resolved `post` and
 * `adjacent` props from this server component.
 */

// Build a static page per post at compile-time.
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

// Per-post <title> + meta description so search snippets / share
// cards don't all read "Lorum Ipsum".
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not found · Lorum Ipsum" };
  return {
    title: `${post.title} · Lorum Ipsum Journal`,
    description: post.excerpt,
  };
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const adjacent = getAdjacent(slug);

  return <BlogDetailClient post={post} adjacent={adjacent} />;
}
