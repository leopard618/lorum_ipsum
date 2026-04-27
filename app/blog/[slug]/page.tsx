import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import MenuOverlay from "@/components/MenuOverlay";
import {
  getAdjacent,
  getPostBySlug,
  posts,
  type BlogPost,
  type BodyBlock,
} from "@/lib/blogPosts";

/**
 * Per-post detail view. Server-rendered & statically generated for every
 * slug in `lib/blogPosts.ts`, so navigating into an article is a simple
 * static fetch — no client-side fetching, no loading state.
 *
 * Reached from three places:
 *   1. The home page Blog slide ("Read article" / clicking the title).
 *   2. The /blog index — every card is a link straight to here.
 *   3. The previous/next pager at the bottom of this page.
 *
 * Visual contract: same white/black/violet palette as /contact and the
 * /blog index. Hero PostArt keeps its dark scene as a deliberate
 * contrast block on the white canvas.
 */

// Build a static page per post at compile-time.
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

// Per-post <title> + meta description so search snippets / share cards
// don't all read "Lorum Ipsum".
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

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white text-neutral-900">
      {/* Subtle dot grid — same idiom as /contact and /blog. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Header — brand + breadcrumb back to the journal. */}
      <header className="relative z-[1] mx-auto flex w-full max-w-7xl items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8 lg:px-16 lg:pt-10">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.28em] text-neutral-900 transition hover:text-violet-600"
        >
          LORUM IPSUM
        </Link>
        <Link
          href="/blog"
          className="hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-600 transition hover:text-neutral-900 sm:inline-flex"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          The Journal
        </Link>
      </header>

      <MenuOverlay theme="light" />

      {/* HERO — eyebrow, title, excerpt, byline. */}
      <section className="relative z-[1] mx-auto w-full max-w-4xl px-6 pt-12 sm:px-10 sm:pt-16 lg:px-0 lg:pt-20">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-neutral-700 transition hover:text-violet-600"
        >
          <span className="flex items-center gap-1" aria-hidden>
            <span className="block h-2 w-4 bg-neutral-300" />
            <span className="block h-2 w-4 bg-neutral-500" />
            <span className="block h-2 w-4 bg-violet-500" />
          </span>
          {post.category}
        </Link>

        <h1 className="mt-6 text-[clamp(2.25rem,6vw,4.75rem)] font-bold leading-[0.98] tracking-tight text-neutral-900">
          {post.title}
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-neutral-600 sm:text-xl">
          {post.excerpt}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-neutral-200 pt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-600">
          <ByLine post={post} />
          <span aria-hidden className="h-1 w-1 rounded-full bg-neutral-300" />
          <span>{post.date}</span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-neutral-300" />
          <span>{post.readTime}</span>
        </div>
      </section>

      {/* HERO PHOTO — full-width on mobile, contained on desktop.
          Mirrors how the /blog index cards present their cover photo. */}
      <section className="relative z-[1] mx-auto mt-10 w-full max-w-5xl px-6 sm:mt-14 sm:px-10 lg:mt-16 lg:px-0">
        <div className="relative aspect-[16/8] overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-950 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] sm:aspect-[16/7]">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* ARTICLE BODY — narrow column for readability with violet
          accents on h2 / quote / list bullets. */}
      <article className="relative z-[1] mx-auto w-full max-w-3xl px-6 py-16 sm:px-10 sm:py-20 lg:px-0 lg:py-24">
        <div className="space-y-8">
          {post.body.map((block, i) => (
            <BodyRenderer key={i} block={block} />
          ))}
        </div>

        {/* Article footer — author signoff. */}
        <div className="mt-16 flex flex-col gap-3 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-neutral-500">Written by</p>
            <p className="mt-1 text-base font-semibold text-neutral-900">
              {post.author}
              {post.authorRole && (
                <span className="ml-2 text-sm font-normal text-neutral-500">
                  · {post.authorRole}
                </span>
              )}
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-neutral-300 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-700 transition hover:-translate-y-0.5 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All articles
          </Link>
        </div>
      </article>

      {/* PREV / NEXT pager — wraparound, so you can read the journal
          end-to-end without bouncing back to the index. */}
      {adjacent && (
        <section className="relative z-[1] mx-auto w-full max-w-7xl px-6 pb-20 sm:px-10 lg:px-16 lg:pb-28">
          <div className="grid grid-cols-1 gap-4 border-t border-neutral-200 pt-10 sm:grid-cols-2 sm:gap-6">
            <PagerCard direction="prev" post={adjacent.prev} />
            <PagerCard direction="next" post={adjacent.next} />
          </div>
        </section>
      )}

      {/* Bottom band */}
      <footer className="relative z-[1] mx-auto w-full max-w-7xl border-t border-neutral-200 px-6 py-8 sm:px-10 lg:px-16">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-neutral-700 transition hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Lorum Ipsum. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

/* -------------------------------- pieces --------------------------------- */

/**
 * Renders a single body block. Keeping this as one component (rather
 * than inlining the switch in the page) means new block types only
 * need to be added in two places: the union in `lib/blogPosts.ts` and
 * the switch below.
 */
function BodyRenderer({ block }: { block: BodyBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="relative mt-6 pt-2 text-2xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-3xl">
          <span
            aria-hidden
            className="absolute left-0 top-0 h-px w-12 bg-violet-500"
          />
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p className="text-base leading-[1.85] text-neutral-700 sm:text-[17px]">
          {block.text}
        </p>
      );
    case "quote":
      return (
        <blockquote className="my-4 border-l-2 border-violet-500 pl-6">
          <p className="text-xl font-medium leading-snug text-neutral-900 sm:text-2xl">
            &ldquo;{block.text}&rdquo;
          </p>
          {block.cite && (
            <footer className="mt-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
              — {block.cite}
            </footer>
          )}
        </blockquote>
      );
    case "list":
      return (
        <ul className="space-y-3 text-base leading-[1.7] text-neutral-700 sm:text-[17px]">
          {block.items.map((item, i) => (
            <li key={i} className="relative pl-7">
              <span
                aria-hidden
                className="absolute left-0 top-[0.55em] block h-1.5 w-3 bg-violet-500"
              />
              {item}
            </li>
          ))}
        </ul>
      );
  }
}

function ByLine({ post }: { post: BlogPost }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span
        aria-hidden
        className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[10px] font-bold text-white"
      >
        {initials(post.author)}
      </span>
      <span className="text-neutral-800">{post.author}</span>
    </span>
  );
}

function PagerCard({
  direction,
  post,
}: {
  direction: "prev" | "next";
  post: BlogPost;
}) {
  const isNext = direction === "next";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] sm:p-7 ${
        isNext ? "sm:items-end sm:text-right" : ""
      }`}
    >
      <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
        {!isNext && <ArrowLeft className="h-3.5 w-3.5" />}
        {isNext ? "Next article" : "Previous article"}
        {isNext && <ArrowRight className="h-3.5 w-3.5" />}
      </span>
      <span className="text-xl font-semibold leading-snug tracking-tight text-neutral-900 transition-colors group-hover:text-violet-700 sm:text-2xl">
        {post.title}
      </span>
      <span className="text-xs uppercase tracking-[0.24em] text-neutral-500">
        {post.author} · {post.readTime}
      </span>
    </Link>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/* -------------------------------- icons --------------------------------- */

function ArrowLeft({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M19 12H5" />
      <path d="M11 5l-7 7 7 7" />
    </svg>
  );
}

function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}
