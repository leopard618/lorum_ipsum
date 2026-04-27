"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import MenuOverlay from "@/components/MenuOverlay";
import { posts, type BlogPost } from "@/lib/blogPosts";

/**
 * /blog — the journal index, structured as two stacked viewport
 * sections:
 *
 *   Section 1 — FEATURED.  Smart-Grid layout: huge hero photo filling
 *   most of the viewport, then a slim band underneath with an overline,
 *   a horizontal rule and a two-column row (headline left, paragraph
 *   plus "Read More" pill right). Cycles through the 2-3 posts marked
 *   `featured: true` in `lib/blogPosts.ts`.
 *
 *   Section 2 — ALL ARTICLES.  Grid of every post as a portrait card
 *   with the cover photo filling the card and the title / author /
 *   read-time chip overlaid at the bottom. Paginated — `GRID_PAGE_SIZE`
 *   cards per page.
 *
 * Both sections are `min-h-[100svh]` so they each occupy a full
 * viewport — the page reads as two distinct, premium sections rather
 * than a single long-scrolling list.
 */

/** Cross-fade duration when paginating either carousel/grid. */
const FEATURED_TRANSITION_MS = 380;
const GRID_TRANSITION_MS = 320;

/** Cards per page in Section 2. With six posts in `lib/blogPosts.ts`
 *  and three columns on desktop, this shows one full row of three
 *  cards per page so each card has room to breathe. */
const GRID_PAGE_SIZE = 3;

export default function BlogPage() {
  const featured = useMemo(
    () => posts.filter((p) => p.featured).slice(0, 3),
    [],
  );
  const featuredCount = Math.max(featured.length, 1);

  // ---- Section 1 (featured carousel) ----
  const [activeIdx, setActiveIdx] = useState(0);
  const [exiting, setExiting] = useState(false);

  // ---- Section 2 (article grid pagination) ----
  const [gridPage, setGridPage] = useState(0);
  const [gridExiting, setGridExiting] = useState(false);
  const gridTotalPages = Math.max(
    1,
    Math.ceil(posts.length / GRID_PAGE_SIZE),
  );
  const visiblePosts: BlogPost[] = posts.slice(
    gridPage * GRID_PAGE_SIZE,
    (gridPage + 1) * GRID_PAGE_SIZE,
  );

  const sectionTwoRef = useRef<HTMLDivElement | null>(null);

  // Reveal data-reveal elements once on mount (same idiom as /contact).
  useEffect(() => {
    const root = document.querySelector("[data-blog-root]");
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, i) => {
      window.setTimeout(() => el.classList.add("is-revealed"), i * 40);
    });
  }, []);

  const goToFeatured = (target: number) => {
    if (exiting || featuredCount <= 1) return;
    const next = ((target % featuredCount) + featuredCount) % featuredCount;
    if (next === activeIdx) return;
    setExiting(true);
    window.setTimeout(() => {
      setActiveIdx(next);
      setExiting(false);
    }, FEATURED_TRANSITION_MS);
  };
  const changeFeatured = (dir: 1 | -1) => goToFeatured(activeIdx + dir);
  const active: BlogPost | undefined = featured[activeIdx];

  const goToGridPage = (target: number) => {
    if (gridExiting || gridTotalPages <= 1) return;
    const next = ((target % gridTotalPages) + gridTotalPages) % gridTotalPages;
    if (next === gridPage) return;
    setGridExiting(true);
    window.setTimeout(() => {
      setGridPage(next);
      setGridExiting(false);
    }, GRID_TRANSITION_MS);
  };
  const changeGrid = (dir: 1 | -1) => goToGridPage(gridPage + dir);

  const scrollToGrid = () => {
    sectionTwoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main data-blog-root className="relative bg-white text-neutral-900">
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
       *                                                                 *
       *   Layout:                                                       *
       *     ┌─────────────────────────────────────────────────────┐     *
       *     │  Header (max-w-7xl, padded)                         │     *
       *     ├─────────────────────────────────────────────────────┤     *
       *     │  Hero photo — FULL viewport WIDTH, reduced height   │     *
       *     │  (`h-[50svh]` → `h-[58svh]` on desktop). No side    │     *
       *     │  padding so the image bleeds edge-to-edge.          │     *
       *     ├─────────────────────────────────────────────────────┤     *
       *     │  Below: overline + rule + 2-col band (max-w-7xl)    │     *
       *     ├─────────────────────────────────────────────────────┤     *
       *     │  Bottom band: pagination + "All articles ↓"         │     *
       *     └─────────────────────────────────────────────────────┘     *
       * ============================================================ */}
      <section
        id="featured"
        aria-label="Featured stories"
        className="relative flex min-h-[100svh] flex-col"
      >
        {/* Header bar */}
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

        {/* ---------- Full-width banner photo ---------- *
         * No horizontal padding on this wrapper so the image sits
         * edge-to-edge across the viewport. Vertical height is
         * intentionally short (50–58 svh) — this is a wide cinematic
         * banner, not a full-bleed hero. */}
        <Link
          href={active ? `/blog/${active.slug}` : "#"}
          data-reveal
          aria-label={active ? `Read ${active.title}` : undefined}
          className="group relative mt-5 block h-[50svh] w-full overflow-hidden bg-neutral-950 sm:mt-6 sm:h-[54svh] lg:mt-7 lg:h-[58svh]"
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
                sizes="100vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              />
            )}
          </div>

          {/* Subtle scrim — keeps the white badges + counter legible
              regardless of how light the underlying photo is. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/15"
          />

          {/* Top-left badge */}
          <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-900 backdrop-blur-sm sm:left-10 lg:left-16">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            Featured Story
          </span>

          {/* Top-right counter */}
          <span className="absolute right-5 top-5 tabular-nums text-[11px] font-semibold uppercase tracking-[0.28em] text-white/85 sm:right-10 lg:right-16">
            <span className="text-white">
              {String(activeIdx + 1).padStart(2, "0")}
            </span>
            <span className="mx-1.5 text-white/40">/</span>
            <span>{String(featuredCount).padStart(2, "0")}</span>
          </span>
        </Link>

        {/* ---------- Below the image — overline + rule + 2-col band ---------- */}
        <div className="relative z-[1] mx-auto w-full max-w-7xl flex-1 px-6 pb-5 pt-6 sm:px-10 sm:pb-6 sm:pt-7 lg:px-16 lg:pb-7 lg:pt-8">
          <div
            data-reveal
            style={{ transitionDelay: "120ms" }}
            className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-neutral-500 sm:text-[11px]"
            key={`overline-${activeIdx}`}
          >
            <span>{active?.category}</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-neutral-300" />
            <span>{active?.date}</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-neutral-300" />
            <span>{active?.readTime}</span>
          </div>

          <div className="mt-4 h-px w-full bg-neutral-300 sm:mt-5" />

          <div
            className="mt-5 grid grid-cols-1 items-center gap-4 sm:mt-6 lg:grid-cols-12 lg:gap-10"
            style={{
              opacity: exiting ? 0.35 : 1,
              transition: `opacity ${FEATURED_TRANSITION_MS}ms ease-out`,
            }}
          >
            {/* Left — big headline */}
            <Link
              href={active ? `/blog/${active.slug}` : "#"}
              className="group lg:col-span-7"
            >
              <h2
                data-reveal
                style={{ transitionDelay: "180ms" }}
                className="text-[clamp(1.5rem,3.4vw,2.75rem)] font-semibold leading-[1.05] tracking-tight text-neutral-900 transition-colors group-hover:text-violet-700"
              >
                {active?.title}
              </h2>
            </Link>

            {/* Right — short paragraph + Read More pill, in a row */}
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5 lg:col-span-5">
              <p
                data-reveal
                style={{ transitionDelay: "240ms" }}
                className="line-clamp-3 flex-1 text-[13px] leading-relaxed text-neutral-600 sm:text-sm"
              >
                {active?.excerpt}
              </p>
              <Link
                href={active ? `/blog/${active.slug}` : "#"}
                data-reveal
                style={{ transitionDelay: "300ms" }}
                className="group inline-flex flex-none items-center gap-3 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-900 transition hover:-translate-y-0.5 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
              >
                <span>Read More</span>
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

        {/* ---------- Bottom band: pagination + scroll hint ---------- */}
        <div className="relative z-[1] mx-auto w-full max-w-7xl px-6 pb-5 sm:px-10 sm:pb-6 lg:px-16 lg:pb-7">
          <div className="flex items-center justify-between gap-4 border-t border-neutral-300 pt-4">
            {/* Left — dot pills */}
            <div className="flex items-center gap-2">
              {featured.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show featured story ${i + 1}`}
                  onClick={() => goToFeatured(i)}
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
                onClick={() => changeFeatured(-1)}
                disabled={exiting || featuredCount <= 1}
                label="Previous featured story"
              />
              <PagerButton
                direction="next"
                onClick={() => changeFeatured(1)}
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
       *   SECTION 2 — ALL ARTICLES (paginated grid)                    *
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

        <div className="relative z-[1] mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-6 pt-8 sm:px-10 sm:pb-8 sm:pt-12 lg:px-16 lg:pb-10 lg:pt-14">
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
              <h2 className="mt-3 text-[clamp(1.875rem,4.5vw,3rem)] font-bold leading-[1] tracking-tight text-neutral-900">
                Field notes &amp; essays.
              </h2>
            </div>
            <p className="hidden max-w-xs text-sm leading-relaxed text-neutral-600 lg:block">
              Every article in the journal — from quick field notes to
              longer essays. Click any tile to open the full piece.
            </p>
          </div>

          {/* Grid — cross-fades on page change */}
          <div
            className="mt-8 grid flex-1 grid-cols-1 gap-5 transition-[opacity,transform,filter] ease-out sm:grid-cols-2 sm:gap-6 lg:mt-10 lg:grid-cols-3 lg:gap-7"
            style={{
              transitionDuration: `${GRID_TRANSITION_MS}ms`,
              opacity: gridExiting ? 0 : 1,
              transform: gridExiting ? "translateX(-12px)" : "translateX(0)",
              filter: gridExiting ? "blur(3px)" : "blur(0)",
            }}
            aria-live="polite"
          >
            {visiblePosts.map((post) => (
              <GridCard
                key={post.slug}
                post={post}
                index={posts.findIndex((p) => p.slug === post.slug)}
              />
            ))}
          </div>
        </div>

        {/* Bottom band — counter, dot pills, prev/next arrows + back link */}
        <footer className="relative z-[1] mx-auto w-full max-w-7xl px-6 pb-7 sm:px-10 sm:pb-9 lg:px-16 lg:pb-10">
          <div className="flex flex-col items-stretch gap-5 border-t border-neutral-300 pt-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Left — back to home */}
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-600 transition hover:text-neutral-900"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Back to home
            </Link>

            {/* Right — pagination cluster */}
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="tabular-nums text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
                <span className="text-neutral-900">
                  {String(gridPage + 1).padStart(2, "0")}
                </span>
                <span className="mx-1.5 text-neutral-300">/</span>
                <span>{String(gridTotalPages).padStart(2, "0")}</span>
              </span>

              {gridTotalPages > 1 && (
                <span
                  aria-hidden
                  className="hidden h-px w-10 bg-neutral-300 sm:inline-block"
                />
              )}

              {gridTotalPages > 1 && (
                <div className="flex items-center gap-2">
                  {Array.from({ length: gridTotalPages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Jump to page ${i + 1}`}
                      onClick={() => goToGridPage(i)}
                      className={`h-[3px] rounded-full transition-all duration-500 ${
                        i === gridPage
                          ? "w-9 bg-neutral-900"
                          : "w-3 bg-neutral-300 hover:bg-neutral-500"
                      }`}
                    />
                  ))}
                </div>
              )}

              <PagerButton
                direction="prev"
                onClick={() => changeGrid(-1)}
                disabled={gridExiting || gridTotalPages <= 1}
                label={`Previous page (currently page ${gridPage + 1} of ${gridTotalPages})`}
              />
              <PagerButton
                direction="next"
                onClick={() => changeGrid(1)}
                disabled={gridExiting || gridTotalPages <= 1}
                label={`Next page (currently page ${gridPage + 1} of ${gridTotalPages})`}
              />
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}

/* ============================== Grid Card ============================== *
 * Image-3-style card: cover photo fills the card, with a small
 * category badge top-left, a read-time pill top-right, and a bottom
 * scrim that holds the title + a tiny author chip.
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
  tone = "onLight",
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  label: string;
  /**
   * `onLight` — the default, dark outline button used on the white
   * Section 2 footer.
   * `onPhoto` — translucent-white outline button used on top of the
   * photo hero in Section 1.
   */
  tone?: "onLight" | "onPhoto";
}) {
  const isNext = direction === "next";
  const toneClasses =
    tone === "onPhoto"
      ? "border-white/40 text-white hover:border-white hover:bg-white hover:text-neutral-900 disabled:hover:bg-transparent disabled:hover:text-white"
      : "border-neutral-300 text-neutral-900 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white disabled:hover:bg-transparent disabled:hover:text-neutral-900";
  const pingClasses =
    tone === "onPhoto" ? "border-white/40" : "border-neutral-200";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`group relative grid h-11 w-11 flex-none place-items-center rounded-full border transition-[transform,background-color,border-color,color,opacity] duration-300 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 ${toneClasses}`}
    >
      <span
        aria-hidden
        className={`absolute inset-0 rounded-full border opacity-0 transition-opacity duration-300 group-hover:animate-ping group-hover:opacity-60 group-disabled:hidden ${pingClasses}`}
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
