"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import FullPageScroller, {
  type Slide,
  useFpsControls,
} from "@/components/FullPageScroller";
import MenuOverlay from "@/components/MenuOverlay";
import { posts, type BlogPost } from "@/lib/blogPosts";

/**
 * /blog — the journal index.
 *
 * Layout:
 *
 *   Section 1 — FEATURED (white).  Smart-Grid layout: rounded hero
 *   photo with overline, headline + paragraph + "Read More" pill
 *   underneath. Cycles through the 2-3 posts marked `featured: true`.
 *
 *   Section 2 — ALL ARTICLES (white).  Discovery grid of 6 portrait
 *   cards (3 × 2 on desktop, 2 × 3 on mobile) sized to fit the
 *   viewport — no filter rail, no search, just the artwork. Bottom
 *   band carries numbered pagination + "Back to home".
 *
 * Both sections live inside `FullPageScroller` so a single scroll /
 * swipe / arrow-press snaps between them with the same animation the
 * home page uses (translate column + scale-up + un-blur). The scroller
 * is themed `light` so the canvas behind transitions is white instead
 * of the home page's black, and the right-side dot nav + bottom
 * "Scroll" hint flip to dark-on-white.
 */

/** Cross-fade duration when paginating either carousel/grid. */
const FEATURED_TRANSITION_MS = 380;
const GRID_TRANSITION_MS = 320;

/** Cards per page in Section 2. With twelve posts in `lib/blogPosts.ts`
 *  and three columns on desktop, this shows two full rows of three
 *  cards per page (3 × 2 = 6) so each card has room to breathe and
 *  pagination is always meaningful (12 posts → 2 pages, ready to
 *  scale to 18 / 24 with numbered page buttons). */
const GRID_PAGE_SIZE = 6;

export default function BlogPage() {
  const slides: Slide[] = [
    {
      type: "vertical",
      content: <FeaturedSection />,
      label: "Featured stories",
    },
    {
      type: "vertical",
      content: <GridSection />,
      label: "All articles",
    },
  ];

  return (
    <FullPageScroller theme="light" slides={slides}>
      <MenuOverlay theme="light" />
    </FullPageScroller>
  );
}

/* =============================================================================
 *   SECTION 1 — FEATURED
 *
 *   Layout (matches the user's reference screenshot):
 *     ┌─────────────────────────────────────────────────────┐
 *     │  Header (LORUM IPSUM ··· The Journal · 2026)         │
 *     │ ┌──────────────────────────────────────────────────┐ │
 *     │ │  Hero photo (rounded card, side padding)          │ │
 *     │ │  • Featured Story badge (top-left)                │ │
 *     │ │  • 01 / 03 counter      (top-right)               │ │
 *     │ └──────────────────────────────────────────────────┘ │
 *     │  Overline · rule · headline / paragraph / Read More  │
 *     │  Bottom band: dots · prev next · All articles ↓      │
 *     └─────────────────────────────────────────────────────┘
 *
 *   `absolute inset-0` so the section reliably fills the slide height
 *   FullPageScroller measures from the visible viewport (matches how
 *   `Intro`, `Industries` and `Blog` snap to FPS slides on the home
 *   page).
 * ========================================================================== */

function FeaturedSection() {
  const featured = useMemo(
    () => posts.filter((p) => p.featured).slice(0, 3),
    [],
  );
  const featuredCount = Math.max(featured.length, 1);
  const fps = useFpsControls();

  const [activeIdx, setActiveIdx] = useState(0);
  const [exiting, setExiting] = useState(false);

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

  return (
    <section
      id="featured"
      aria-label="Featured stories"
      className="absolute inset-0 flex flex-col bg-white text-neutral-900"
    >
      {/* Subtle dot grid — same as /contact. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

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

      {/* Content — rounded hero photo + headline / excerpt row underneath. */}
      <div className="relative z-[1] mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-5 pt-5 sm:px-10 sm:pb-6 sm:pt-7 lg:px-16 lg:pb-7 lg:pt-9">
        {/* Hero photo */}
        <Link
          href={active ? `/blog/${active.slug}` : "#"}
          data-reveal
          className="group relative block min-h-[40svh] flex-1 overflow-hidden rounded-[28px] bg-neutral-950 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] transition sm:min-h-[44svh] lg:min-h-[48svh]"
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

          {/* Subtle scrim — keeps the white badges + counter legible
              regardless of how light the underlying photo is. */}
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

        {/* Below the image — overline + rule + headline / excerpt band */}
        <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:gap-4 lg:mt-6">
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

          <div className="h-px w-full bg-neutral-300" />

          <div
            className="grid grid-cols-1 items-center gap-4 lg:grid-cols-12 lg:gap-10"
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

            {/* Right — short paragraph + Read More pill */}
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
      </div>

      {/* Bottom band: pagination + scroll hint */}
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

          {/* Right — scroll-to-grid hint. Routes through the FPS
              controls so a click triggers the same one-scroll snap
              animation a wheel/swipe would. */}
          <button
            type="button"
            onClick={() => fps.advance()}
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
  );
}

/* =============================================================================
 *   SECTION 2 — ALL ARTICLES  (white discovery grid)
 *
 *   • Top rail: filter tabs (For You / Featured / AI / …),
 *     search field, settings cog
 *   • 4-up grid of portrait photo cards (2-up on mobile)
 *   • Bottom band: pagination counter + dots + prev/next
 *
 *   Cards are dark photo-fills on the white canvas — the photo *is*
 *   the visual, and the dark cards punch nicely against the page.
 * ========================================================================== */

function GridSection() {
  const [query, setQuery] = useState<string>("");
  const [gridPage, setGridPage] = useState(0);
  const [gridExiting, setGridExiting] = useState(false);

  // Single full-text filter — matches title / excerpt / author /
  // category. No tabs, no fancy ranking — just "does the typed
  // string appear anywhere meaningful on the post".
  const filteredPosts: BlogPost[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [query]);

  const gridTotalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / GRID_PAGE_SIZE),
  );

  // Snap back to page 1 whenever the query changes so the user
  // doesn't end up on an out-of-range page (e.g. page 2 of 1).
  useEffect(() => {
    setGridPage(0);
  }, [query]);

  const visiblePosts: BlogPost[] = filteredPosts.slice(
    gridPage * GRID_PAGE_SIZE,
    (gridPage + 1) * GRID_PAGE_SIZE,
  );

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

  return (
    <section
      id="all"
      aria-label="All articles"
      className="absolute inset-0 flex flex-col bg-white text-neutral-900"
    >
      {/* Subtle dot grid — same as Section 1 / /contact. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Soft violet glow in the top-left so the white canvas isn't
          completely flat. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl"
      />

      {/* Header bar */}
      <header className="relative z-[1] mx-auto flex w-full max-w-7xl items-center justify-between px-6 pt-6 sm:px-10 sm:pt-7 lg:px-16 lg:pt-9">
        <Link
          href="/"
          data-reveal
          className="text-sm font-semibold tracking-[0.28em] text-neutral-900 transition hover:text-violet-600"
        >
          LORUM IPSUM
        </Link>
        <span
          data-reveal
          style={{ transitionDelay: "60ms" }}
          className="hidden text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500 sm:inline-flex"
        >
          Library · {String(posts.length).padStart(2, "0")} stories
        </span>
      </header>

      {/* Search bar — only filter control on the page; right-aligned
          on desktop, full-width on mobile. */}
      <div className="relative z-[1] mx-auto mt-5 w-full max-w-7xl px-6 sm:mt-6 sm:px-10 lg:mt-7 lg:px-16">
        <div className="flex justify-end">
          <label
            data-reveal
            style={{ transitionDelay: "60ms" }}
            className="group relative flex w-full items-center sm:w-72"
          >
            <SearchIcon className="pointer-events-none absolute left-3 h-4 w-4 text-neutral-400 transition group-focus-within:text-neutral-700" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles"
              className="h-10 w-full rounded-md bg-neutral-100 pl-9 pr-3 text-sm text-neutral-900 placeholder-neutral-400 ring-1 ring-neutral-200 transition focus:bg-white focus:outline-none focus:ring-violet-400/60"
              aria-label="Search articles"
            />
          </label>
        </div>
      </div>

      {/* Grid — 3×2 on desktop, 2×3 on mobile, sized to fit the
          viewport so all 6 cards are visible without scrolling
          inside the section. `flex-1 min-h-0` + `grid-rows-{n}`
          makes each row split the available height evenly so cards
          stretch instead of overflowing. */}
      <div className="relative z-[1] mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-6 pt-5 sm:px-10 sm:pb-8 sm:pt-6 lg:px-16 lg:pb-10 lg:pt-7">
        {visiblePosts.length === 0 ? (
          <div className="grid flex-1 place-items-center text-center">
            <div className="max-w-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-400">
                No matches
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
                Nothing matches that search.
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                Clear the search to see every article in the journal.
              </p>
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-900 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            className="grid min-h-0 flex-1 grid-cols-2 grid-rows-3 gap-x-4 gap-y-6 transition-[opacity,transform,filter] ease-out sm:gap-x-5 sm:gap-y-7 lg:grid-cols-3 lg:grid-rows-2 lg:gap-x-6 lg:gap-y-8"
            style={{
              transitionDuration: `${GRID_TRANSITION_MS}ms`,
              opacity: gridExiting ? 0 : 1,
              transform: gridExiting ? "translateX(-12px)" : "translateX(0)",
              filter: gridExiting ? "blur(3px)" : "blur(0)",
            }}
            aria-live="polite"
          >
            {visiblePosts.map((post, i) => (
              <GridCard
                key={post.slug}
                post={post}
                revealDelay={i * 90}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom band: pagination + back link */}
      <footer className="relative z-[1] mx-auto w-full max-w-7xl px-6 pb-7 sm:px-10 sm:pb-9 lg:px-16 lg:pb-10">
        <div className="flex flex-col items-stretch gap-5 border-t border-neutral-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Left — back to home */}
          <Link
            href="/"
            data-reveal
            className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500 transition hover:text-neutral-900"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>

          {/* Right — numbered pagination.
              Clusters as `[<] 01 02 03 [>]` so the user can jump
              directly to a page or step one at a time. The counter +
              dot row that lived here previously is replaced by the
              numbered buttons themselves: each one shows its index
              and the active number doubles as the page indicator. */}
          <nav
            aria-label="Page navigation"
            data-reveal
            style={{ transitionDelay: "80ms" }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <PagerButton
              direction="prev"
              onClick={() => changeGrid(-1)}
              disabled={gridExiting || gridPage === 0}
              label={`Previous page (currently page ${gridPage + 1} of ${gridTotalPages})`}
            />

            {gridTotalPages > 1 && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {Array.from({ length: gridTotalPages }).map((_, i) => {
                  const isActive = i === gridPage;
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to page ${i + 1}`}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => goToGridPage(i)}
                      className={`grid h-9 min-w-[2.25rem] place-items-center rounded-full px-2 text-[12px] font-semibold tabular-nums tracking-[0.18em] transition-colors ${
                        isActive
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </button>
                  );
                })}
              </div>
            )}

            <PagerButton
              direction="next"
              onClick={() => changeGrid(1)}
              disabled={gridExiting || gridPage >= gridTotalPages - 1}
              label={`Next page (currently page ${gridPage + 1} of ${gridTotalPages})`}
            />
          </nav>
        </div>
      </footer>
    </section>
  );
}

/* ============================== Grid Card ============================== *
 * Stripped-down editorial card: just the cover photo (rounded) with
 * the post title sitting cleanly below it on the white canvas. No
 * overlay text, no author chip, no read-time pill — the photo speaks,
 * and the title labels.
 * ----------------------------------------------------------------------- */

function GridCard({
  post,
  revealDelay = 0,
}: {
  post: BlogPost;
  /** Per-card stagger so a fresh row of cards cascades into view
   *  rather than appearing simultaneously. */
  revealDelay?: number;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-reveal
      style={{ transitionDelay: `${revealDelay}ms` }}
      className="group flex h-full min-h-0 flex-col gap-3 transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Cover photo */}
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-neutral-900 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.45)] ring-1 ring-neutral-200 transition-shadow duration-300 group-hover:ring-neutral-300 group-hover:shadow-[0_28px_60px_-25px_rgba(0,0,0,0.45)]">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>

      {/* Title — clean text below the image */}
      <h3 className="text-[14px] font-semibold leading-snug tracking-tight text-neutral-900 transition-colors group-hover:text-violet-600 sm:text-[15px]">
        <span className="line-clamp-2">{post.title}</span>
      </h3>
    </Link>
  );
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

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

