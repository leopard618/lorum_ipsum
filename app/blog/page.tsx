"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import MenuOverlay from "@/components/MenuOverlay";
import { posts, type BlogPost } from "@/lib/blogPosts";

/**
 * /blog — the journal index, structured as two stacked viewport
 * sections (matching the latest direction):
 *
 *   Section 1 — FEATURED.  A big landscape hero image with a small
 *   eyebrow + horizontal rule and a 2-column band underneath: headline
 *   on the left, paragraph + "View story" pill on the right. Cycles
 *   through 2–3 posts marked `featured: true` in `lib/blogPosts.ts`.
 *
 *   Section 2 — ALL ARTICLES.  A grid of every post as a portrait card
 *   with the dark PostArt visual filling the card and the title /
 *   author / read-time chip overlaid at the bottom.
 *
 * Both sections are `min-h-screen` so they each occupy a full viewport
 * — the page reads as two distinct, premium sections rather than a
 * single long-scrolling list. Palette: black text on white, with
 * violet-500 reserved as the only accent (matches /contact).
 */

const FEATURED_TRANSITION_MS = 380;

export default function BlogPage() {
  const featured = useMemo(() => posts.filter((p) => p.featured).slice(0, 3), []);
  const featuredCount = Math.max(featured.length, 1);

  const [activeIdx, setActiveIdx] = useState(0);
  const [exiting, setExiting] = useState(false);
  const sectionTwoRef = useRef<HTMLDivElement | null>(null);

  // Reveal data-reveal elements once on mount (same idiom as /contact).
  useEffect(() => {
    const root = document.querySelector("[data-blog-root]");
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, i) => {
      window.setTimeout(() => el.classList.add("is-revealed"), i * 40);
    });
  }, []);

  const goTo = (target: number) => {
    if (exiting || featuredCount <= 1) return;
    const next = ((target % featuredCount) + featuredCount) % featuredCount;
    if (next === activeIdx) return;
    setExiting(true);
    window.setTimeout(() => {
      setActiveIdx(next);
      setExiting(false);
    }, FEATURED_TRANSITION_MS);
  };

  const change = (dir: 1 | -1) => goTo(activeIdx + dir);
  const active: BlogPost | undefined = featured[activeIdx];

  const scrollToGrid = () => {
    sectionTwoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main
      data-blog-root
      className="relative bg-white text-neutral-900"
    >
      {/* Subtle dot grid — same as /contact, applied page-wide so both
          sections share the same canvas. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <MenuOverlay theme="light" />

      {/* ============================================================ *
       *   SECTION 1 — FEATURED                                          *
       * ============================================================ */}
      <section
        id="featured"
        aria-label="Featured stories"
        className="relative flex min-h-[100svh] flex-col"
      >
        {/* Header bar inside the section */}
        <header className="relative z-[1] mx-auto flex w-full max-w-7xl items-center justify-between px-6 pt-6 sm:px-10 sm:pt-7 lg:px-16 lg:pt-9">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.28em] text-neutral-900 transition hover:text-violet-600"
          >
            LORUM IPSUM
          </Link>
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500 sm:inline-flex">
            The Journal · {new Date().getFullYear()}
          </span>
        </header>

        {/* Content card — hero image on top, headline + excerpt below. */}
        <div className="relative z-[1] mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-8 pt-6 sm:px-10 sm:pt-8 lg:px-16 lg:pb-12 lg:pt-10">
          {/* Hero image — large landscape PostArt visual. The dark
              scene is intentional contrast against the white page,
              just like the /contact form's dark "Send" button. */}
          <Link
            href={active ? `/blog/${active.slug}` : "#"}
            data-reveal
            className="group relative block aspect-[16/9] w-full overflow-hidden rounded-[28px] bg-neutral-950 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] transition lg:aspect-[16/8]"
            aria-label={active ? `Read ${active.title}` : undefined}
          >
            {/* Cross-fade between featured posts */}
            <div
              className="absolute inset-0 transition-[opacity,transform,filter]"
              style={{
                transitionDuration: `${FEATURED_TRANSITION_MS}ms`,
                opacity: exiting ? 0 : 1,
                transform: exiting ? "scale(1.02)" : "scale(1)",
                filter: exiting ? "blur(4px)" : "blur(0)",
              }}
            >
              {active && (
                <Image
                  key={active.slug}
                  src={active.image}
                  alt={active.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 1100px, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                />
              )}
            </div>

            {/* Subtle overlay so the white badges and counter stay
                legible regardless of how light the underlying photo is. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20"
            />

            {/* Top-left badge */}
            <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-900 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              Featured Story
            </span>

            {/* Top-right counter */}
            <span className="absolute right-5 top-5 tabular-nums text-[11px] font-semibold uppercase tracking-[0.28em] text-white/85">
              <span className="text-white">
                {String(activeIdx + 1).padStart(2, "0")}
              </span>
              <span className="mx-1.5 text-white/40">/</span>
              <span>{String(featuredCount).padStart(2, "0")}</span>
            </span>
          </Link>

          {/* Below the image — overline + 2-col band */}
          <div className="mt-7 flex flex-1 flex-col gap-5 sm:mt-8 lg:mt-9">
            <div
              data-reveal
              style={{ transitionDelay: "120ms" }}
              className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-neutral-500"
              key={`overline-${activeIdx}`}
            >
              <span>{active?.category}</span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-neutral-300" />
              <span>{active?.date}</span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-neutral-300" />
              <span>{active?.readTime}</span>
            </div>

            <div className="h-px w-full bg-neutral-300" />

            <div
              className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12"
              style={{
                opacity: exiting ? 0.35 : 1,
                transition: `opacity ${FEATURED_TRANSITION_MS}ms ease-out`,
              }}
            >
              {/* Left — big headline, links to detail */}
              <Link
                href={active ? `/blog/${active.slug}` : "#"}
                className="group lg:col-span-7"
              >
                <h2
                  data-reveal
                  style={{ transitionDelay: "180ms" }}
                  className="text-[clamp(1.875rem,4.5vw,3.5rem)] font-semibold leading-[1.05] tracking-tight text-neutral-900 transition-colors group-hover:text-violet-700"
                >
                  {active?.title}
                </h2>
              </Link>

              {/* Right — short paragraph + View story pill */}
              <div className="flex flex-col items-start gap-5 lg:col-span-5">
                <p
                  data-reveal
                  style={{ transitionDelay: "240ms" }}
                  className="text-sm leading-relaxed text-neutral-600 sm:text-[15px]"
                >
                  {active?.excerpt}
                </p>
                <Link
                  href={active ? `/blog/${active.slug}` : "#"}
                  data-reveal
                  style={{ transitionDelay: "300ms" }}
                  className="group inline-flex items-center gap-3 rounded-full border border-neutral-300 bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-900 transition hover:-translate-y-0.5 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                >
                  <span>View story</span>
                  <span
                    aria-hidden
                    className="grid h-6 w-6 place-items-center rounded-full border border-neutral-300 transition group-hover:border-white"
                  >
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom band — pagination + scroll hint */}
        <div className="relative z-[1] mx-auto w-full max-w-7xl px-6 pb-7 sm:px-10 sm:pb-9 lg:px-16 lg:pb-10">
          <div className="flex items-center justify-between gap-4 border-t border-neutral-300 pt-5">
            {/* Left — dot pills (matches the home Industries section) */}
            <div className="flex items-center gap-2" aria-hidden>
              {featured.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show featured story ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-[3px] rounded-full transition-all duration-500 ${
                    i === activeIdx
                      ? "w-9 bg-neutral-900"
                      : "w-3 bg-neutral-300 hover:bg-neutral-500"
                  }`}
                />
              ))}
            </div>

            {/* Middle — Prev / Next arrows */}
            <div className="flex items-center gap-3 sm:gap-4">
              <PagerButton
                direction="prev"
                onClick={() => change(-1)}
                disabled={exiting || featuredCount <= 1}
                label="Previous featured story"
              />
              <PagerButton
                direction="next"
                onClick={() => change(1)}
                disabled={exiting || featuredCount <= 1}
                label="Next featured story"
              />
            </div>

            {/* Right — scroll-to-grid hint */}
            <button
              type="button"
              onClick={scrollToGrid}
              className="group hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-600 transition hover:text-neutral-900 sm:inline-flex"
              aria-label="Scroll to all articles"
            >
              All articles
              <span
                aria-hidden
                className="grid h-7 w-7 place-items-center rounded-full border border-neutral-300 transition group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white"
              >
                <ArrowDown className="h-3 w-3 transition-transform group-hover:translate-y-0.5" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ *
       *   SECTION 2 — ALL ARTICLES (grid)                              *
       * ============================================================ */}
      <section
        ref={sectionTwoRef}
        id="all"
        aria-label="All articles"
        className="relative flex min-h-[100svh] flex-col"
      >
        <header className="relative z-[1] mx-auto flex w-full max-w-7xl items-center justify-between px-6 pt-6 sm:px-10 sm:pt-7 lg:px-16 lg:pt-9">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.28em] text-neutral-900 transition hover:text-violet-600"
          >
            LORUM IPSUM
          </Link>
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500 sm:inline-flex">
            Library · {String(posts.length).padStart(2, "0")} stories
          </span>
        </header>

        <div className="relative z-[1] mx-auto w-full max-w-7xl flex-1 px-6 pb-10 pt-10 sm:px-10 sm:pb-12 sm:pt-14 lg:px-16 lg:pb-14 lg:pt-16">
          {/* Section heading */}
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-neutral-700">
                <span className="flex items-center gap-1" aria-hidden>
                  <span className="block h-2.5 w-5 bg-neutral-300" />
                  <span className="block h-2.5 w-5 bg-neutral-500" />
                  <span className="block h-2.5 w-5 bg-neutral-900" />
                </span>
                All Articles
              </div>
              <h2 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1] tracking-tight text-neutral-900">
                Field notes &amp; essays.
              </h2>
            </div>
            <p className="hidden max-w-xs text-sm leading-relaxed text-neutral-600 lg:block">
              Every article in the journal — from quick field notes to
              longer essays. Click any tile to open the full piece.
            </p>
          </div>

          {/* Grid — 3 columns on desktop, 2 on tablet, 1 on mobile */}
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-12 lg:grid-cols-3 lg:gap-7">
            {posts.map((post, i) => (
              <GridCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </div>

        {/* Footer band */}
        <footer className="relative z-[1] mx-auto w-full max-w-7xl px-6 pb-8 sm:px-10 sm:pb-10 lg:px-16 lg:pb-12">
          <div className="flex flex-col items-start justify-between gap-4 border-t border-neutral-300 pt-6 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-600 transition hover:text-neutral-900"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Back to home
            </Link>
            <p className="text-xs text-neutral-500">
              © {new Date().getFullYear()} Lorum Ipsum. All rights reserved.
            </p>
          </div>
        </footer>
      </section>
    </main>
  );
}

/* ============================== Grid Card ============================== *
 * Image-3-style card: dark PostArt fills the card, with a small
 * "Recommended"-style top-left badge, a read-time pill top-right, and
 * a bottom overlay that holds the title + a tiny author chip. The
 * dark visual reads as a deliberate accent block on the white grid.
 * ----------------------------------------------------------------------- */

function GridCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex aspect-[3/4] flex-col overflow-hidden rounded-2xl bg-neutral-950 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-20px_rgba(0,0,0,0.25)]"
    >
      <Image
        src={post.image}
        alt={post.imageAlt}
        fill
        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
      />

      {/* Top-left small label — first segment of category */}
      <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-neutral-900 backdrop-blur-sm">
        <span className="h-1 w-1 rounded-full bg-violet-500" />
        {post.category.split("·")[0].trim()}
      </span>

      {/* Top-right read-time pill */}
      <span className="absolute right-3.5 top-3.5 tabular-nums rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
        {post.readTime.replace(" read", "")}
      </span>

      {/* Bottom scrim + title + author chip */}
      <div className="relative mt-auto flex flex-col gap-3 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 pt-16 sm:p-5 sm:pt-20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
          Recommended
        </p>
        <h3 className="text-base font-semibold leading-snug tracking-tight text-white transition-colors group-hover:text-violet-200 sm:text-[17px]">
          <span className="line-clamp-2">{post.title}</span>
        </h3>

        <div className="mt-1 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid h-6 w-6 flex-none place-items-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 text-[9px] font-bold text-white"
            >
              {initials(post.author)}
            </span>
            <span className="truncate text-[11px] font-medium text-white/80">
              {post.author}
            </span>
          </div>
          <span className="tabular-nums text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">
            /{String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>
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

/* ============================== Pager Button ============================ *
 * Light-page variant. Same vocabulary as the dark-page version on the
 * home Blog slide so prev/next gestures feel consistent across the
 * whole site.
 * ------------------------------------------------------------------------ */

function PagerButton({
  direction,
  onClick,
  disabled,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  const isNext = direction === "next";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="group relative grid h-11 w-11 flex-none place-items-center rounded-full border border-neutral-300 text-neutral-900 transition-[transform,background-color,border-color,color,opacity] duration-300 hover:scale-110 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:text-neutral-900"
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full border border-neutral-200 opacity-0 transition-opacity duration-300 group-hover:animate-ping group-hover:opacity-60 group-disabled:hidden"
      />
      {isNext ? (
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
      ) : (
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:-translate-x-0.5" />
      )}
    </button>
  );
}

/* ================================== Icons ================================ */

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

function ArrowDown({ className = "" }: { className?: string }) {
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
      <path d="M12 5v14" />
      <path d="M5 13l7 7 7-7" />
    </svg>
  );
}
