"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import MenuOverlay from "@/components/MenuOverlay";
import PostArt from "@/components/PostArt";
import { posts, type BlogPost } from "@/lib/blogPosts";

/**
 * /blog — the journal index.
 *
 * Visual contract (per the latest direction): the page reads as a single
 * full-bleed *section* on a white canvas, mirroring the contact page's
 * black/white/violet palette. No long scrolling content stack — instead
 * the layout is sized to fit the viewport on desktop and stacks
 * gracefully on mobile.
 *
 * Layout, top to bottom:
 *   1. Brand header (LORUM IPSUM + journal eyebrow + menu)
 *   2. Hero — large headline / supporting paragraph
 *   3. Section rule + counter ("Articles · 06")
 *   4. Three portrait cards in a row (paginated)
 *   5. Footer band — pagination, prev/next, back link
 *
 * Cards are clickable in their entirety and route to `/blog/[slug]`.
 */

/** Cross-fade duration when paginating the cards row. */
const PAGE_TRANSITION_MS = 320;

/** Cards per pager page. The grid stacks to 1 col on mobile and 2 on
 *  tablet, but the page count is always derived from this fixed slot
 *  count so the position counter ("01 / 02") matches the desktop
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

  const [page, setPage] = useState(0);
  const [exiting, setExiting] = useState(false);
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const visible: BlogPost[] = posts.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  );

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
      className="relative flex min-h-screen flex-col overflow-x-hidden bg-white text-neutral-900"
    >
      {/* Subtle dot grid — same idiom as /contact so the white pages
          feel like one family. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* HEADER */}
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

      <MenuOverlay theme="light" />

      {/* HERO */}
      <section className="relative z-[1] mx-auto w-full max-w-7xl px-6 pt-10 sm:px-10 sm:pt-14 lg:px-16 lg:pt-16">
        <div
          data-reveal
          className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-neutral-700"
        >
          <span className="flex items-center gap-1" aria-hidden>
            <span className="block h-2.5 w-5 bg-neutral-300" />
            <span className="block h-2.5 w-5 bg-neutral-500" />
            <span className="block h-2.5 w-5 bg-neutral-900" />
          </span>
          Field Notes
        </div>

        <div className="mt-5 grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-10">
          <h1
            data-reveal
            style={{ transitionDelay: "80ms" }}
            className="text-[clamp(2.75rem,7.5vw,6rem)] font-bold leading-[0.95] tracking-tight text-neutral-900 lg:col-span-8"
          >
            The Journal.
          </h1>
          <p
            data-reveal
            style={{ transitionDelay: "180ms" }}
            className="text-base leading-relaxed text-neutral-600 lg:col-span-4"
          >
            Essays, field notes, and the occasional rant — on AI, design, and
            what it takes to ship calm software in a noisy industry.
          </p>
        </div>
      </section>

      {/* SECTION RULE + COUNTER */}
      <div className="relative z-[1] mx-auto mt-10 w-full max-w-7xl px-6 sm:mt-14 sm:px-10 lg:mt-16 lg:px-16">
        <div className="flex items-center gap-4 border-t border-neutral-300 pt-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-neutral-700">
            Articles
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-400">
            · {String(posts.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* CARDS ROW */}
      <section className="relative z-[1] mx-auto w-full max-w-7xl flex-1 px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 lg:px-16">
        <div
          className="grid grid-cols-1 gap-6 transition-[opacity,transform,filter] ease-out sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8"
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
      </section>

      {/* FOOTER — pagination row + back link */}
      <footer className="relative z-[1] mx-auto w-full max-w-7xl px-6 pb-8 sm:px-10 sm:pb-10 lg:px-16 lg:pb-12">
        <div className="flex flex-col gap-6 border-t border-neutral-300 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-600 transition hover:text-neutral-900"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <span className="tabular-nums text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
              <span className="text-neutral-900">
                {String(page + 1).padStart(2, "0")}
              </span>
              <span className="mx-1.5 text-neutral-300">/</span>
              <span>{String(totalPages).padStart(2, "0")}</span>
            </span>

            {totalPages > 1 && (
              <span
                aria-hidden
                className="hidden h-px w-10 bg-neutral-300 sm:inline-block"
              />
            )}

            {totalPages > 1 && (
              <div className="flex items-center gap-2" aria-hidden>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Jump to page ${i + 1}`}
                    onClick={() => goToPage(i)}
                    className={`h-[3px] rounded-full transition-all duration-500 ${
                      i === page
                        ? "w-8 bg-neutral-900"
                        : "w-3 bg-neutral-300 hover:bg-neutral-500"
                    }`}
                  />
                ))}
              </div>
            )}

            <PagerButton
              direction="prev"
              onClick={() => change(-1)}
              disabled={exiting || totalPages <= 1}
              label={`Previous page (currently page ${page + 1} of ${totalPages})`}
            />
            <PagerButton
              direction="next"
              onClick={() => change(1)}
              disabled={exiting || totalPages <= 1}
              label={`Next page (currently page ${page + 1} of ${totalPages})`}
            />
          </div>
        </div>
      </footer>
    </main>
  );
}

/* -------------------------------- cards ---------------------------------- */

function Card({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
    >
      {/* Visual block — keeps the existing dark PostArt look but framed
          inside a white card. The dark scene reads as a tasteful
          contrast accent against the white page rather than dominating
          the page like before. */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950">
        <PostArt
          variant={post.art}
          uid={`card-${post.slug}`}
          className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-900 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
          {post.category.split("·")[0].trim()}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="text-xl font-semibold leading-snug tracking-tight text-neutral-900 transition-colors group-hover:text-violet-700 sm:text-[22px]">
          <span className="line-clamp-2">{post.title}</span>
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-neutral-600">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-500">
            <span>{post.date}</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-neutral-300" />
            <span>{post.readTime}</span>
          </div>
          <span
            aria-hidden
            className="grid h-9 w-9 flex-none place-items-center rounded-full border border-neutral-300 text-neutral-700 transition group-hover:-rotate-45 group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Circular Prev / Next button used by the pager. Light-page variant of
 * the dark-page button used inside the home Blog slide.
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
