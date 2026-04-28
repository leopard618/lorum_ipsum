"use client";

import Image from "next/image";
import Link from "next/link";

import FullPageScroller, {
  type Slide,
  useFpsControls,
} from "@/components/FullPageScroller";
import MenuOverlay from "@/components/MenuOverlay";
import type { BlogPost, BodyBlock } from "@/lib/blogPosts";

/**
 * Per-post detail viewer rendered as three full-screen slides inside
 * `FullPageScroller`. No card, no border, no sidebar — every slide
 * is full-bleed and the article's cover photo is rendered ONCE as a
 * shared `backdrop` layer behind the slides so slides 1 + 2 reveal
 * the *same* image element (no visual jump between them):
 *
 *   ┌─ Slide 1 ─────────────┐    ┌─ Slide 2 ─────────────┐    ┌─ Slide 3 ─────────────┐
 *   │ pills                 │    │ pills (white on photo)│    │ pills (dark on white) │
 *   │                       │    │                       │    │                       │
 *   │ Big title    excerpt  │    │ Big title (overlay)   │    │ Big title    excerpt  │
 *   │              column   │    │                       │    │              cols     │
 *   │                       │    │                       │    │                       │
 *   │   ── 1/4 strip ──     │    │  ▒▒▒ shared photo ▒▒▒ │    │   article body        │
 *   │  (shared photo peeks  │    │  full-bleed reveal    │    │   (scrollable, black  │
 *   │   through transparent │    │  with text overlay    │    │   text on white)      │
 *   │   bottom 25%)         │    │  no scrim/overlay     │    │                       │
 *   └───────────────────────┘    └───────────────────────┘    └───────────────────────┘
 *
 * Because the photo lives in the scroller's `backdrop` slot — outside
 * the translating slide column — it stays *fixed* to the viewport
 * during transitions. Slide 1's white "title cap" simply slides up &
 * out, smoothly revealing more of the image until slide 2 arrives
 * fully transparent and you're left with the photo edge-to-edge.
 * Slide 3 paints its own white canvas on top of the photo.
 */

export default function BlogDetailClient({
  post,
  adjacent,
}: {
  post: BlogPost;
  adjacent: { prev: BlogPost; next: BlogPost } | null;
}) {
  const slides: Slide[] = [
    {
      type: "vertical",
      content: <TitleSlide post={post} />,
      label: "Title",
    },
    {
      type: "vertical",
      content: <PictureSlide post={post} />,
      label: "Cover & summary",
    },
    {
      type: "vertical",
      content: <BodySlide post={post} adjacent={adjacent} />,
      label: "Article",
    },
  ];

  return (
    <FullPageScroller
      theme="light"
      slides={slides}
      backdrop={<BackdropPhoto post={post} />}
    >
      <MenuOverlay theme="light" />
    </FullPageScroller>
  );
}

/* =============================================================================
 *   Shared backdrop — ONE Image element behind the entire scroller.
 *
 *   Sized to fill the viewport (100vw × 100vh) with `object-cover`
 *   anchored to the TOP of the photo. Slide 1's TOP strip leaves an
 *   uncovered area where this exact element peeks through as a teaser
 *   crop; slide 2 is fully transparent so the SAME element expands to
 *   fill the viewport.
 *
 *   To make slide 1 → slide 2 feel like a real cinematic "zoom-up"
 *   reveal (rather than a hard cut), we read the active slide index
 *   from `useFpsControls()` and animate the backdrop's `transform`
 *   between two states:
 *
 *     slide 0 (TITLE)   →  scale(1.18) translateY(-3%)   ← zoomed in
 *     slide 1 (COVER)   →  scale(1.00) translateY(0)     ← full reveal
 *     slide 2 (BODY)    →  scale(1.06) translateY(2%)    ← gentle drift
 *                                                          (covered by
 *                                                          dark anyway)
 *
 *   The transition runs on the same 1000ms / cubic-bezier curve as the
 *   FullPageScroller's column translation so the zoom feels welded to
 *   the scroll motion.
 * ========================================================================== */

const BACKDROP_TRANSFORM = [
  // slide 0 — TITLE: image is zoomed in & nudged up so the visible
  // top strip in slide 1 frames the photo's top edge tightly.
  "scale(1.18) translateY(-3%)",
  // slide 1 — COVER: image at its natural framing, full-bleed reveal.
  "scale(1.00) translateY(0%)",
  // slide 2 — BODY: subtle counter-drift so if the dark canvas above
  // it ever shows a sliver mid-transition, the photo isn't frozen.
  "scale(1.06) translateY(2%)",
] as const;

function BackdropPhoto({ post }: { post: BlogPost }) {
  const { currentSlide } = useFpsControls();
  const transform =
    BACKDROP_TRANSFORM[currentSlide] ?? BACKDROP_TRANSFORM[1];
  return (
    <div className="absolute inset-0 overflow-hidden bg-neutral-950">
      <div
        className="absolute inset-0 origin-center"
        style={{
          transform,
          transition:
            "transform 1000ms cubic-bezier(0.76, 0, 0.24, 1)",
          willChange: "transform",
        }}
      >
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

/* =============================================================================
 *   Slide 1 — TITLE  (mirrors reference Card 1)
 *
 *   Top 75% of the slide is opaque white and carries the title +
 *   excerpt block. The bottom 25% is transparent, letting the shared
 *   backdrop photo peek through as a strip — which is the very same
 *   element that fills slide 2, so there is zero visual jump.
 * ========================================================================== */

function TitleSlide({ post }: { post: BlogPost }) {
  return (
    <section className="absolute inset-0 flex flex-col">
      {/* Top ~70% — solid white panel that carries the title and
          excerpt. */}
      <div className="relative flex flex-1 flex-col bg-white text-neutral-900">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 pt-8 sm:gap-10 sm:px-10 sm:pt-12 lg:gap-12 lg:px-16 lg:pt-14">
          {/* Pills row */}
          <div data-reveal>
            <BreadcrumbPills post={post} variant="light" />
          </div>

          {/* Title + narrow excerpt column */}
          <div className="grid grid-cols-1 items-end gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12">
            <h1
              data-reveal
              style={{ transitionDelay: "120ms" }}
              className="text-[clamp(2rem,5vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.015em] text-neutral-900 lg:col-span-9"
            >
              {post.title}
            </h1>
            <div
              data-reveal
              style={{ transitionDelay: "240ms" }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-1 lg:pb-2"
            >
              <p className="text-[12px] leading-[1.7] text-neutral-600">
                {firstSentence(post.excerpt)}
              </p>
              {restAfterFirstSentence(post.excerpt) && (
                <p className="text-[12px] leading-[1.7] text-neutral-600">
                  {restAfterFirstSentence(post.excerpt)}
                </p>
              )}
            </div>
          </div>

          {/* breathing room */}
          <div className="flex-1" />
        </div>

        {/* Tiny seam line softens the white→photo edge so it reads
            as an intentional design break, not a render gap. */}
        <div
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-px bg-neutral-200/70"
        />
      </div>

      {/* Bottom ~30% — TRANSPARENT so the shared backdrop image shows
          through as a teaser strip at the BOTTOM of the slide. When
          the user scrolls to slide 2, the same image element zooms
          out & the white panel above slides up off-screen, so this
          strip visually "expands" into the full-bleed cover. */}
      <div
        data-reveal
        className="relative h-[30%] min-h-[160px] w-full sm:h-[32%]"
      />
    </section>
  );
}

/* =============================================================================
 *   Slide 2 — COVER  (mirrors reference Card 2)
 *
 *   Fully transparent slide — the shared backdrop photo IS the slide.
 *   Pills, title and the two-column description sit on top with dark
 *   scrims for legibility. Because no new <Image> is rendered here,
 *   the element from slide 1 simply expands into view as the white
 *   cap above slides off — perfectly continuous.
 * ========================================================================== */

function PictureSlide({ post }: { post: BlogPost }) {
  return (
    /* No scrims, no overlay panel — the shared backdrop photo sits
       fully revealed.  Pills + title + description rely on white
       text + a soft drop-shadow for legibility on whichever photo
       the post happens to use. */
    <section className="absolute inset-0 text-white">
      <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col px-6 pt-8 pb-8 sm:px-10 sm:pt-12 sm:pb-10 lg:px-16 lg:pt-14 lg:pb-14">
        {/* Pills row (white-on-photo variant) */}
        <div data-reveal>
          <BreadcrumbPills post={post} variant="dark" />
        </div>

        {/* Big white title — top-left */}
        <h2
          data-reveal
          style={{ transitionDelay: "160ms" }}
          className="mt-8 max-w-3xl text-[clamp(1.75rem,4.2vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.015em] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)] sm:mt-10"
        >
          {post.title}
        </h2>

        {/* Two-column description — bottom-left */}
        <div
          data-reveal
          style={{ transitionDelay: "320ms" }}
          className="mt-auto grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6"
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
    </section>
  );
}

/* =============================================================================
 *   Slide 3 — BODY  (mirrors reference Card 3)
 *
 *   White canvas covers the shared backdrop. Title + excerpt lockup
 *   at the top, then the long-form article body flows as a readable
 *   column with dark text on a clean white surface. Author signoff +
 *   prev/next pager close it off.
 * ========================================================================== */

function BodySlide({
  post,
  adjacent,
}: {
  post: BlogPost;
  adjacent: { prev: BlogPost; next: BlogPost } | null;
}) {
  return (
    /* Natural-flow block (NOT absolute inset-0): the parent
       `fps-slide` section already has `overflow-y-auto` so anything
       taller than the viewport scrolls inside it, and the
       FullPageScroller knows the user is at the top/bottom edge so
       wheel/swipe at the edge advances to the previous/next slide
       without ever stealing the user's scroll mid-article.

       `min-h-[100dvh]` (matched to FullPageScroller's `slideHeight`
       fallback) guarantees the white surface paints at least one full
       viewport tall — without it the shared backdrop photo bleeds
       through at the end of the article on viewports where the
       parent's percentage-height resolves a few pixels short. */
    <div className="relative min-h-[100dvh] bg-white text-neutral-900">
      {/* Top header lockup */}
      <div className="relative z-[1] mx-auto flex w-full max-w-7xl flex-col gap-7 px-6 pt-8 sm:gap-9 sm:px-10 sm:pt-12 lg:px-16 lg:pt-14">
        <div data-reveal>
          <BreadcrumbPills post={post} variant="light" />
        </div>

        <div className="grid grid-cols-1 items-end gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12">
          <h2
            data-reveal
            style={{ transitionDelay: "120ms" }}
            className="text-[clamp(1.75rem,4.2vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.015em] text-neutral-900 lg:col-span-7"
          >
            {post.title}
          </h2>
          <p
            data-reveal
            style={{ transitionDelay: "240ms" }}
            className="text-[12.5px] leading-[1.75] text-neutral-600 lg:col-span-5 lg:pb-1.5"
          >
            {post.excerpt}
          </p>
        </div>
      </div>

      {/* Long-form article body — naturally tall, scrolled by the
          parent fps-slide section. */}
      <div className="relative z-[1] mt-9 mx-auto w-full max-w-7xl px-6 pb-12 sm:px-10 sm:pb-14 lg:px-16 lg:pb-16">
        <article
          data-reveal
          style={{ transitionDelay: "360ms" }}
          className="ml-auto max-w-[640px] space-y-5"
        >
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
    </div>
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
