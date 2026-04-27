"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import MenuOverlay from "@/components/MenuOverlay";
import type { BlogPost, BodyBlock } from "@/lib/blogPosts";

/**
 * Per-post detail page rendered as ONE continuous, full-width
 * scrolling page (no snap / no card wrapper).
 *
 *   ┌──────── Section 1 — Title hero (100vh) ────────┐
 *   │  category breadcrumb                            │
 *   │                                                  │
 *   │   Big H1 title                                  │
 *   │   Excerpt teaser                                │
 *   │   Author · role · date · read-time              │
 *   │   Scroll ↓                                      │
 *   └──────────────────────────────────────────────────┘
 *   ┌──────── Section 2 — Cover photo (100vh) ────────┐
 *   │                                                  │
 *   │  ┌────────── full cover photo ─────────────┐    │
 *   │  │                                            │    │
 *   │  │   (just the photo — no tags / title /      │    │
 *   │  │    description; the image speaks alone)    │    │
 *   │  └────────────────────────────────────────┘    │
 *   └──────────────────────────────────────────────────┘
 *   ┌──────── Section 3 — Full description ───────────┐
 *   │  Body blocks: p / h2 / quote / list             │
 *   │  Author signoff (avatar · name · role · date)   │
 *   │  All articles ←  ·  Prev / Next post →          │
 *   └──────────────────────────────────────────────────┘
 *
 * Server-side `generateStaticParams` / `generateMetadata` stay in
 * `page.tsx` — this client component just receives the resolved
 * `post` + `adjacent` props and presents them.
 */

export default function BlogDetailClient({
  post,
  adjacent,
}: {
  post: BlogPost;
  adjacent: { prev: BlogPost; next: BlogPost } | null;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver-driven reveal: any element with `data-reveal`
  // fades + lifts into place as it scrolls into view. Mirrors how the
  // home-page sections animate, just driven by viewport intersection
  // instead of `FullPageScroller`'s snap state.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    if (typeof IntersectionObserver === "undefined") {
      targets.forEach((t) => t.classList.add("is-revealed"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <main
      ref={rootRef}
      className="relative min-h-screen overflow-x-hidden bg-white text-neutral-900"
    >
      <MenuOverlay theme="light" />

      <PageHeader post={post} />

      <TitleHero post={post} />
      <CoverSection post={post} />
      <BodyArticle post={post} adjacent={adjacent} />
    </main>
  );
}

/* =============================================================================
 *   Sticky page chrome
 *
 *   A thin top bar that stays fixed while the user scrolls all three
 *   sections — gives the page a consistent "wrapper" without the
 *   rounded-card shell we used before.
 * ========================================================================== */

function PageHeader({ post }: { post: BlogPost }) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-4 px-6 pt-5 sm:px-10 sm:pt-7 lg:px-16 lg:pt-9">
      <Link
        href="/"
        className="pointer-events-auto text-[12px] font-semibold tracking-[0.32em] text-neutral-900 transition hover:text-violet-600 sm:text-sm"
      >
        LORUM IPSUM
      </Link>
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        <Link
          href="/blog"
          className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-500 transition hover:text-neutral-900 sm:inline-flex sm:text-[11px]"
        >
          <ArrowLeft className="h-3 w-3" />
          The Journal
        </Link>
        <span
          aria-hidden
          className="hidden h-3 w-px bg-neutral-300 sm:inline-block"
        />
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-500 sm:text-[11px]">
          {post.date}
        </span>
      </div>
    </header>
  );
}

/* =============================================================================
 *   Section 1 — TITLE HERO
 *
 *   Tight hero block — natural height, generous-but-not-cavernous
 *   top/bottom padding so the title doesn't leave a huge vertical
 *   gap before section 2.
 * ========================================================================== */

function TitleHero({ post }: { post: BlogPost }) {
  return (
    <section className="relative flex flex-col overflow-hidden px-6 pb-12 pt-28 sm:px-10 sm:pb-16 sm:pt-32 lg:px-16 lg:pb-20 lg:pt-36">
      {/* Soft violet glow in upper-right (light-theme accent). */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full bg-violet-200/45 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-[320px] w-[320px] rounded-full bg-fuchsia-200/40 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <Link
          href="/blog"
          data-reveal
          className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-neutral-700 transition hover:text-violet-600 sm:text-[11px]"
        >
          <span className="flex items-center gap-1" aria-hidden>
            <span className="block h-2 w-3.5 bg-neutral-300" />
            <span className="block h-2 w-3.5 bg-neutral-500" />
            <span className="block h-2 w-3.5 bg-violet-500" />
          </span>
          {post.category}
        </Link>

        <div className="mt-6 grid grid-cols-1 items-end gap-6 sm:mt-8 sm:gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-16">
          <h1
            data-reveal
            style={{ transitionDelay: "120ms" }}
            className="text-[clamp(2.2rem,6vw,5.5rem)] font-semibold leading-[0.98] tracking-tight text-neutral-900 lg:col-span-9"
          >
            {post.title}
          </h1>
          <p
            data-reveal
            style={{ transitionDelay: "240ms" }}
            className="text-base leading-relaxed text-neutral-600 sm:text-lg lg:col-span-3 lg:pb-3"
          >
            {post.excerpt}
          </p>
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
 *   Section 2 — FULL COVER PHOTO + MINI DESCRIPTION
 *
 *   The cover photo dominates this viewport-tall section; the post
 *   excerpt sits below the photo as the editorial "dek".
 * ========================================================================== */

function CoverSection({ post }: { post: BlogPost }) {
  return (
    <section className="relative flex flex-col bg-neutral-50 px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
        {/* Full cover photo — fills the section. No tags, no title,
            no description: the photo speaks for itself. */}
        <div
          data-reveal
          className="relative flex-1 min-h-[55vh] overflow-hidden rounded-2xl bg-neutral-950 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.35)] sm:min-h-[62vh] sm:rounded-3xl"
        >
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            sizes="(min-width: 1024px) 1280px, 100vw"
            className="object-cover"
          />
          <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm sm:text-[11px]">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
            />
            {post.readTime}
          </span>
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
 *   Section 3 — FULL BODY
 *
 *   Full description: paragraph / h2 / quote / list blocks rendered
 *   in a narrow editorial column. Section flows naturally — the page
 *   ends here, no forced viewport height.
 * ========================================================================== */

function BodyArticle({
  post,
  adjacent,
}: {
  post: BlogPost;
  adjacent: { prev: BlogPost; next: BlogPost } | null;
}) {
  return (
    <section className="relative px-6 pb-24 pt-12 sm:px-10 sm:pb-28 sm:pt-14 lg:px-16 lg:pb-32 lg:pt-16">
      <div className="mx-auto w-full max-w-3xl">
        <article data-reveal className="space-y-7">
          {post.body.map((block, i) => (
            <BodyRenderer key={i} block={block} />
          ))}
        </article>

        {/* Author signoff — single byline block at the end of the
            article so the metadata (MA · Mira Akhand · Design Lead ·
            Mar 2026 · 6 min read) lives in exactly one place. */}
        <div
          data-reveal
          className="mt-14 flex flex-col gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid h-10 w-10 flex-none place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[12px] font-bold text-white"
            >
              {initials(post.author)}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-neutral-900">
                {post.author}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                {post.authorRole}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
            <span>{post.date}</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-neutral-300" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <div
          data-reveal
          style={{ transitionDelay: "120ms" }}
          className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <Link
            href="/blog"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-700 transition hover:-translate-y-0.5 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            All articles
          </Link>

          {adjacent && (
            <div className="flex items-center gap-3">
              <PagerLink direction="prev" post={adjacent.prev} />
              <PagerLink direction="next" post={adjacent.next} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ============================== Body renderer ============================ */

function BodyRenderer({ block }: { block: BodyBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h3 className="relative mt-2 pt-2 text-2xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-[1.75rem]">
          <span
            aria-hidden
            className="absolute left-0 top-0 h-px w-12 bg-violet-500"
          />
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p className="text-[15px] leading-[1.8] text-neutral-700 sm:text-[16px]">
          {block.text}
        </p>
      );
    case "quote":
      return (
        <blockquote className="my-2 border-l-2 border-violet-500 pl-5 sm:pl-6">
          <p className="text-lg font-medium leading-snug text-neutral-900 sm:text-xl">
            &ldquo;{block.text}&rdquo;
          </p>
          {block.cite && (
            <footer className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
              — {block.cite}
            </footer>
          )}
        </blockquote>
      );
    case "list":
      return (
        <ul className="space-y-2.5 text-[15px] leading-[1.7] text-neutral-700 sm:text-[16px]">
          {block.items.map((item, i) => (
            <li key={i} className="relative pl-6">
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

/* ============================== Adjacent pager =========================== */

function PagerLink({
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
      aria-label={`${isNext ? "Next" : "Previous"} article: ${post.title}`}
      className="group grid h-11 w-11 flex-none place-items-center rounded-full border border-neutral-300 text-neutral-900 transition-[transform,background-color,border-color,color] duration-300 hover:scale-110 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
    >
      {isNext ? (
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      ) : (
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
      )}
    </Link>
  );
}

/* ============================== utils + icons ============================ */

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

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
