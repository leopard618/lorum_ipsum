"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import MenuOverlay from "@/components/MenuOverlay";
import type { BlogPost, BodyBlock } from "@/lib/blogPosts";

/**
 * Per-post detail viewer split *vertically* (left/right columns) on
 * desktop, stacked on mobile. Layout:
 *
 *   ┌──────────────────────┬──────────────────────┐
 *   │ ▒▒▒ photo (full)     │  pills               │
 *   │ ▒▒▒                  │  title + excerpt     │
 *   │ ▒▒▒  pills           │  ───────             │
 *   │ ▒▒▒  title           │  long-form body      │
 *   │ ▒▒▒  mini desc       │  (scrolls inside     │
 *   │ ▒▒▒                  │   the right column)  │
 *   └──────────────────────┴──────────────────────┘
 *
 * Both halves fill the viewport on desktop (`lg:h-screen`); the right
 * column has `overflow-y-auto` so a long article scrolls *inside*
 * the column without ever pushing the cover photo off-screen.
 *
 * On phones / tablets we drop back to a single vertical flow: photo
 * hero on top, then the long-form body below — two columns side-by-
 * side would crush both into unreadable strips.
 */

export default function BlogDetailClient({
  post,
  adjacent,
}: {
  post: BlogPost;
  adjacent: { prev: BlogPost; next: BlogPost } | null;
}) {
  const rootRef = useRef<HTMLElement | null>(null);

  // `data-reveal` elements default to `opacity: 0` and only become
  // visible when something flips them to `is-revealed` (or when an
  // ancestor `FullPageScroller` slide goes active).  Now that this
  // page is a plain layout — not part of the FPS — we have to mark
  // everything as revealed ourselves on mount, otherwise the title,
  // pills, mini description, and body all stay invisible.  The
  // contact page does the same thing.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((el) => el.classList.add("is-revealed"));
  }, [post.slug]);

  return (
    <main
      ref={rootRef}
      className="relative min-h-screen bg-white text-neutral-900 lg:flex lg:h-screen lg:min-h-0 lg:overflow-hidden"
    >
      {/* Menu trigger overlay — same dark-on-light variant we use on
          the contact and services pages. */}
      <MenuOverlay theme="light" />

      <HeroHalf post={post} />
      <BodyHalf post={post} adjacent={adjacent} />
    </main>
  );
}

/* =============================================================================
 *   LEFT COLUMN — full-bleed cover photo + pills + title + mini description
 *
 *   Mobile / tablet: takes the full viewport width and `min-h-[55vh]`
 *   so the photo doesn't collapse into a thin band on portrait screens.
 *
 *   Desktop (lg+): becomes the *left half* of the viewport — fixed at
 *   `lg:w-1/2`, `lg:h-full` — and never scrolls.  The right column
 *   handles all internal scrolling for the long-form body.
 *
 *   A dark gradient overlay sits *between* the photo and the text so
 *   the title + description stay legible regardless of which photo
 *   the post happens to use.
 * ========================================================================== */

function HeroHalf({ post }: { post: BlogPost }) {
  return (
    <section className="relative w-full overflow-hidden bg-neutral-950 text-white lg:h-full lg:w-1/2 lg:flex-none">
      {/* Photo */}
      <div className="absolute inset-0">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-top"
        />
        {/* Legibility scrim — darker at the top + bottom (where pills,
            title, and description live) and gentler in the middle so
            the photo still reads as the dominant element. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/65"
        />
      </div>

      {/* Content lockup. Pills stay anchored to the top, then a
          flex-grow spacer pushes the title + mini-description group
          down into the lower portion of the column so they sit
          *together* (title with the description directly underneath
          it) rather than the title floating up top while the
          description hugs the bottom edge. */}
      <div className="relative z-[1] flex h-full w-full flex-col px-6 pb-12 pt-10 sm:px-10 sm:pb-14 sm:pt-14 lg:px-12 lg:pb-16 lg:pt-14 min-h-[55vh] sm:min-h-[58vh] lg:min-h-0">
        {/* Pills row */}
        <div data-reveal>
          <BreadcrumbPills post={post} variant="dark" />
        </div>

        {/* Spacers — flex-[5] above + flex-1 below sits the title +
            description group ~83% of the way down the column, near
            the bottom edge (but still clear of the menu trigger
            circle) so the photo gets the most visual real estate. */}
        <div className="flex-[5]" />

        {/* Title + mini description, grouped together so the
            description reads directly under the title (not stranded
            at the bottom of the column). */}
        <div className="space-y-5 sm:space-y-6 lg:space-y-5">
          <h1
            data-reveal
            style={{ transitionDelay: "160ms" }}
            className="max-w-3xl text-[clamp(1.85rem,3.6vw,3rem)] font-semibold leading-[1.05] tracking-[-0.015em] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)]"
          >
            {post.title}
          </h1>

          <div
            data-reveal
            style={{ transitionDelay: "320ms" }}
            className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-1 lg:gap-2.5 xl:grid-cols-2 xl:gap-5"
          >
            <p className="text-[12px] leading-[1.7] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)] sm:text-[12.5px]">
              {firstSentence(post.excerpt)}
            </p>
            {restAfterFirstSentence(post.excerpt) && (
              <p className="text-[12px] leading-[1.7] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)] sm:text-[12.5px]">
                {restAfterFirstSentence(post.excerpt)}
              </p>
            )}
          </div>
        </div>

        {/* Bottom spacer — paired with the upper one to give the
            title group its ~83%-from-top resting position. */}
        <div className="flex-1" />
      </div>
    </section>
  );
}

/* =============================================================================
 *   RIGHT COLUMN — full long-form description on a white canvas
 *
 *   Mobile / tablet: stacks under the hero, flows naturally.
 *   Desktop (lg+): pinned to the right half of the viewport, takes
 *   `lg:w-1/2`, `lg:h-full`, and scrolls *internally* with
 *   `lg:overflow-y-auto` — that way long articles never push the
 *   cover photo off-screen, the photo stays "framed" on the left.
 *
 *   On desktop the title/excerpt lockup is dropped (it would simply
 *   duplicate the title that's already overlaid on the photo to its
 *   left) and the body kicks off from the top of the column.  On
 *   mobile we keep the lockup so the body still reads as a section
 *   below the hero.
 * ========================================================================== */

function BodyHalf({
  post,
  adjacent,
}: {
  post: BlogPost;
  adjacent: { prev: BlogPost; next: BlogPost } | null;
}) {
  return (
    <section className="relative bg-white text-neutral-900 lg:h-full lg:w-1/2 lg:flex-none lg:overflow-y-auto">
      {/* Top header lockup — duplicates info from the photo overlay
          on the left, so we hide it on lg+ where they sit side-by-
          side and it would just feel redundant. */}
      <div className="relative z-[1] mx-auto flex w-full max-w-7xl flex-col gap-7 px-6 pt-10 sm:gap-9 sm:px-10 sm:pt-14 lg:hidden">
        <div data-reveal>
          <BreadcrumbPills post={post} variant="light" />
        </div>

        <div className="grid grid-cols-1 items-end gap-8 sm:gap-10">
          <h2
            data-reveal
            style={{ transitionDelay: "120ms" }}
            className="text-[clamp(1.75rem,4.2vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.015em] text-neutral-900"
          >
            {post.title}
          </h2>
          <p
            data-reveal
            style={{ transitionDelay: "240ms" }}
            className="text-[12.5px] leading-[1.75] text-neutral-600"
          >
            {post.excerpt}
          </p>
        </div>
      </div>

      {/* Long-form article body. Padding is intentionally tighter on
          desktop (where the column is only ~50vw wide) than on
          mobile, so the column doesn't feel cramped at narrow
          breakpoints but also doesn't waste a ton of horizontal
          space at lg+. */}
      <div className="relative z-[1] mt-9 w-full px-6 pb-14 sm:px-10 sm:pb-16 lg:mt-0 lg:px-12 lg:pb-16 lg:pt-14">
        <article
          data-reveal
          style={{ transitionDelay: "360ms" }}
          className="mx-auto max-w-[640px] space-y-5 lg:mx-0 lg:max-w-none"
        >
          {/* Desktop-only title overhead — gives the body column its
              own anchor without forcing the user to glance back at
              the photo for context. */}
          <div className="hidden lg:mb-2 lg:block">
            <BreadcrumbPills post={post} variant="light" />
            <h2
              className="mt-5 text-[clamp(1.6rem,2.4vw,2.25rem)] font-semibold leading-[1.05] tracking-[-0.015em] text-neutral-900"
            >
              {post.title}
            </h2>
          </div>

          {post.body.map((block, i) => (
            <BodyRenderer key={i} block={block} />
          ))}

          {/* Author signoff */}
          <div className="mt-10 flex flex-col gap-4 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
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
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                  {post.authorRole}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
              <span>{post.date}</span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-neutral-400" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Pager */}
          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/blog"
              className="group inline-flex w-fit items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-neutral-700 transition hover:-translate-y-0.5 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
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
        </article>
      </div>
    </section>
  );
}

/* =============================================================================
 *   Shared bits
 * ========================================================================== */

function BreadcrumbPills({
  post,
  variant,
}: {
  post: BlogPost;
  variant: "light" | "dark";
}) {
  const pills = breadcrumbsFor(post);
  const isDark = variant === "dark";
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {pills.map((label, i) => (
        <span
          key={`${label}-${i}`}
          className={
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.24em] sm:text-[10px] " +
            (isDark
              ? "bg-white/10 text-white/95 backdrop-blur-[2px]"
              : "bg-neutral-100 text-neutral-700")
          }
        >
          {i === 0 && (
            <span
              aria-hidden
              className="block h-1.5 w-1.5 rounded-full bg-violet-500"
            />
          )}
          {label}
        </span>
      ))}
    </div>
  );
}

/* ============================== Body renderer ============================ */

function BodyRenderer({ block }: { block: BodyBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h3 className="relative mt-2 pt-2 text-[1.35rem] font-semibold leading-tight tracking-tight text-neutral-900 sm:text-[1.5rem]">
          <span
            aria-hidden
            className="absolute left-0 top-0 h-px w-12 bg-violet-500"
          />
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p className="text-[14px] leading-[1.78] text-neutral-700 sm:text-[15px]">
          {block.text}
        </p>
      );
    case "quote":
      return (
        <blockquote className="my-2 border-l-2 border-violet-500 pl-5 sm:pl-6">
          <p className="text-[1.05rem] font-medium leading-snug text-neutral-900 sm:text-[1.15rem]">
            &ldquo;{block.text}&rdquo;
          </p>
          {block.cite && (
            <footer className="mt-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
              — {block.cite}
            </footer>
          )}
        </blockquote>
      );
    case "list":
      return (
        <ul className="space-y-2.5 text-[14px] leading-[1.7] text-neutral-700 sm:text-[15px]">
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
      className="group grid h-11 w-11 flex-none place-items-center rounded-full border border-neutral-300 text-neutral-700 transition-[transform,background-color,border-color,color] duration-300 hover:scale-110 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
    >
      {isNext ? (
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      ) : (
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
      )}
    </Link>
  );
}

/* =============================== utilities ================================ */

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Returns up to three short breadcrumb labels for the top-of-card pill row,
 * derived from the post's `category` string ("A · B · C") + a tail label.
 */
function breadcrumbsFor(post: BlogPost): string[] {
  const tags = post.category
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);
  const labels = tags.length ? tags : ["Article"];
  if (!labels.includes("The Journal")) labels.push("The Journal");
  return labels.slice(0, 3);
}

/**
 * Splits the post excerpt into a "first sentence" and "everything else"
 * for the two-column body block. If the excerpt is a single sentence
 * the second column simply renders nothing.
 */
function firstSentence(text: string): string {
  const m = text.match(/^[\s\S]*?[.!?](?=\s|$)/);
  return (m ? m[0] : text).trim();
}
function restAfterFirstSentence(text: string): string {
  const first = firstSentence(text);
  return text.slice(first.length).trim();
}

/* ================================ icons ================================== */

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
