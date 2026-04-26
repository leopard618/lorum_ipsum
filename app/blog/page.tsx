"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import MenuOverlay from "@/components/MenuOverlay";
import PostArt from "@/components/PostArt";
import { posts, type BlogPost } from "@/lib/blogPosts";

/**
 * Standalone /blog index. Sits outside the FullPageScroller so it scrolls
 * naturally like a content page. Each card is a single big `<Link>` to
 * the per-post detail at `/blog/[slug]` — no in-card "Read story" pill,
 * the whole card is the affordance.
 */

/** Cross-fade duration used by the More-stories pager. Matches the home
 *  Blog slide so the two cycling experiences feel related. */
const PAGE_TRANSITION_MS = 320;

/** Cards per pager page. The grid stacks to 1 col on mobile and 2 on
 *  tablet, but the page count is always derived from this fixed slot
 *  count so the position counter ("01 / 02") matches the desktop's
 *  visual page rather than each individual card. */
const PAGE_SIZE = 3;

export default function BlogPage() {
  useEffect(() => {
    const root = document.querySelector("[data-blog-root]");
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, i) => {
      window.setTimeout(() => el.classList.add("is-revealed"), i * 40);
    });
  }, []);

  const [featured, ...rest] = posts;

  // Page-based pagination. With 5 cards and a page size of 3, we get
  // two pages: [0,1,2] and [3,4]. `page` is 0-indexed; the visible
  // counter humanises it to 1-indexed.
  const [page, setPage] = useState(0);
  const [exiting, setExiting] = useState(false);
  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const visible: BlogPost[] = rest.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const goToPage = (target: number) => {
    if (exiting) return;
    const next = ((target % totalPages) + totalPages) % totalPages;
    if (next === page) return;
    setExiting(true);
    window.setTimeout(() => {
      setPage(next);
      setExiting(false);
    }, PAGE_TRANSITION_MS);
  };

  const change = (dir: 1 | -1) => goToPage(page + dir);

  return (
    <main
      data-blog-root
      className="relative min-h-screen overflow-x-hidden bg-neutral-950 text-white"
    >
      {/* Ambient background — soft violet glow + dot grid. Keeps the dark
          page from feeling flat without competing with the cards. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-violet-500/15 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/10 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <header className="relative z-[1] mx-auto flex w-full max-w-7xl items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8 lg:px-16 lg:pt-10">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.28em] text-white hover:text-violet-300"
        >
          LORUM IPSUM
        </Link>
      </header>

      <MenuOverlay theme="dark" />

      {/* HERO */}
      <section className="relative z-[1] mx-auto w-full max-w-7xl px-6 pb-16 pt-12 sm:px-10 sm:pt-16 lg:px-16 lg:pb-20 lg:pt-20">
        <div
          data-reveal
          className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/55"
        >
          <span className="flex items-center gap-1" aria-hidden>
            <span className="block h-2.5 w-5 bg-white/15" />
            <span className="block h-2.5 w-5 bg-white/35" />
            <span className="block h-2.5 w-5 bg-white/65" />
          </span>
          Field Notes · {new Date().getFullYear()}
        </div>

        <div className="mt-6 grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-10">
          <h1
            data-reveal
            style={{ transitionDelay: "80ms" }}
            className="text-[clamp(3rem,9vw,7.5rem)] font-bold leading-[0.95] tracking-tight lg:col-span-8"
          >
            The{" "}
            <span className="bg-gradient-to-r from-white via-white to-violet-300 bg-clip-text text-transparent">
              Journal.
            </span>
          </h1>
          <p
            data-reveal
            style={{ transitionDelay: "180ms" }}
            className="text-base leading-relaxed text-white/65 lg:col-span-4"
          >
            Essays, field notes, and the occasional rant — on AI, design, and
            what it takes to ship calm software in a noisy industry.
          </p>
        </div>
      </section>

      {/* FEATURED — full-width card with art on the left, copy on the
          right. The whole article is one big link, so we wrap with
          <Link> and let hover effects flow from the group. */}
      <section className="relative z-[1] mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
        <FeaturedCard post={featured} />
      </section>

      {/* MORE STORIES — paginated. Same 1/2/3 column grid as before, but
          we render only a 3-card sliding window over `rest` and let the
          user cycle through it with the Prev/Next buttons. The window
          wraps, so you can never reach a dead end. */}
      <section className="relative z-[1] mx-auto w-full max-w-7xl px-6 pb-24 pt-12 sm:px-10 sm:pt-16 lg:px-16 lg:pb-32">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <h2
            data-reveal
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            More stories
          </h2>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Position counter — "01 / 02" style. The `5 articles, 3
                visible per page = 2 pages` math is encoded by `totalPages`,
                so this reads as the user's current page out of the total
                pages, not as the card index. */}
            <span className="tabular-nums text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">
              <span className="text-white">
                {String(page + 1).padStart(2, "0")}
              </span>
              <span className="mx-1.5 text-white/30">/</span>
              <span>{String(totalPages).padStart(2, "0")}</span>
            </span>

            <span
              aria-hidden
              className="hidden h-px w-10 bg-white/15 sm:inline-block"
            />

            <PagerButton
              direction="prev"
              onClick={() => change(-1)}
              disabled={exiting || totalPages <= 1}
              label={`Show previous page (currently page ${page + 1} of ${totalPages})`}
            />
            <PagerButton
              direction="next"
              onClick={() => change(1)}
              disabled={exiting || totalPages <= 1}
              label={`Show next page (currently page ${page + 1} of ${totalPages})`}
            />
          </div>
        </div>

        {/* Cross-fade the visible window when `page` changes. `exiting`
            handles the opacity/blur dip, then we swap the page mid-fade
            and fade back in. The cards inside use `data-pager-card` (NOT
            data-reveal) so the parent's transition is the single source
            of fade animation — otherwise the per-card reveal would lock
            new cards at opacity:0 after a paginate. */}
        <div
          className="grid grid-cols-1 gap-6 transition-[opacity,transform,filter] ease-out sm:grid-cols-2 sm:gap-8 lg:grid-cols-3"
          style={{
            transitionDuration: `${PAGE_TRANSITION_MS}ms`,
            opacity: exiting ? 0 : 1,
            transform: exiting ? "translateX(-12px)" : "translateX(0)",
            filter: exiting ? "blur(3px)" : "blur(0)",
          }}
          aria-live="polite"
        >
          {visible.map((post) => (
            <Card key={post.slug} post={post} />
          ))}
        </div>

        {/* Pagination pills — one per page. Clicking a pill jumps to
            that page directly (handy if there were many more later). */}
        {totalPages > 1 && (
          <div
            className="mt-8 flex items-center gap-2 sm:mt-10"
            aria-hidden
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Jump to page ${i + 1}`}
                onClick={() => goToPage(i)}
                className={`h-[3px] rounded-full transition-all duration-500 ${
                  i === page
                    ? "w-8 bg-white sm:w-10"
                    : "w-3 bg-white/30 hover:bg-white/60 sm:w-4"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Bottom band — back to home + © line. Lightweight on purpose;
          the main site footer lives inside the home page's dock slide
          and doesn't belong on a flat content route. */}
      <footer className="relative z-[1] mx-auto w-full max-w-7xl border-t border-white/10 px-6 py-8 sm:px-10 lg:px-16">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-white/70 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Lorum Ipsum. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

/* -------------------------------- cards ---------------------------------- */

function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-reveal
      style={{ transitionDelay: "240ms" }}
      className="group relative grid grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)] transition hover:border-white/25 hover:bg-white/[0.05] lg:grid-cols-12"
    >
      <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7 lg:aspect-auto">
        <PostArt
          variant={post.art}
          uid={`featured-${post.slug}`}
          className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/85 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          Featured
        </div>
      </div>
      <div className="flex flex-col justify-between gap-8 p-7 sm:p-10 lg:col-span-5 lg:p-12">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-violet-300/80">
            {post.category}
          </p>
          <h3 className="mt-4 text-3xl font-semibold leading-tight tracking-tight transition-colors group-hover:text-violet-200 sm:text-4xl">
            {post.title}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-[15px]">
            {post.excerpt}
          </p>
        </div>
        <div className="flex items-end justify-between gap-4">
          <Meta post={post} />
          <span
            aria-hidden
            className="grid h-12 w-12 flex-none place-items-center rounded-full border border-white/20 text-white/80 transition group-hover:-rotate-45 group-hover:border-white group-hover:bg-white group-hover:text-black"
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Card({ post }: { post: BlogPost }) {
  return (
    // No `data-reveal` here on purpose. This card lives inside the
    // pager, which re-mounts its children on every page change. The
    // global useEffect that turns reveal-marked elements visible only
    // runs once at page mount, so any data-reveal applied here would
    // leave newly paginated cards stuck at opacity:0. The parent grid's
    // own opacity transition is what fades the page change.
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.04]"
    >
      <div className="relative aspect-[5/3] overflow-hidden">
        <PostArt
          variant={post.art}
          uid={`card-${post.slug}`}
          className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-300/80">
          {post.category}
        </p>
        <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-violet-200 sm:text-2xl">
          <span className="line-clamp-3">{post.title}</span>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/60">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <Meta post={post} compact />
          <span
            aria-hidden
            className="grid h-10 w-10 flex-none place-items-center rounded-full border border-white/15 text-white/70 transition group-hover:border-white group-hover:bg-white group-hover:text-black"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Meta({ post, compact = false }: { post: BlogPost; compact?: boolean }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${
        compact ? "text-[10px]" : "text-[11px]"
      } font-medium uppercase tracking-[0.22em] text-white/45`}
    >
      <span>{post.author}</span>
      <span aria-hidden className="h-1 w-1 rounded-full bg-white/30" />
      <span>{post.date}</span>
      <span aria-hidden className="h-1 w-1 rounded-full bg-white/30" />
      <span>{post.readTime}</span>
    </div>
  );
}

/**
 * Circular Prev / Next button used by the More-stories pager. Visual
 * style intentionally matches the home page Blog slide's nav buttons
 * — same border-radius, ring expansion, and disabled treatment — so
 * the two cycling experiences read as one pattern.
 */
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
      className="group relative grid h-11 w-11 flex-none place-items-center rounded-full border border-white/30 text-white transition-[transform,background-color,border-color,color,opacity] duration-300 hover:scale-110 hover:border-white hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:text-white sm:h-12 sm:w-12"
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full border border-white/20 opacity-0 transition-opacity duration-300 group-hover:animate-ping group-hover:opacity-60 group-disabled:hidden"
      />
      {isNext ? (
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
        />
      ) : (
        <ArrowLeft
          className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:-translate-x-0.5"
        />
      )}
    </button>
  );
}

/* -------------------------------- icons --------------------------------- */

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

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
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
