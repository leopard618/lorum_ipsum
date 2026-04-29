"use client";

import Link from "next/link";
import { useState } from "react";

import Footer from "@/components/Footer";
import FullPageScroller, { type Slide } from "@/components/FullPageScroller";
import MenuOverlay from "@/components/MenuOverlay";
import { SERVICES } from "@/lib/services";

/**
 * /services — two-slide composition:
 *
 *   1. IndexSection      (white)  — wordmark + accordion of every offering
 *   2. Footer (dock)     (black)  — same dock-pop footer as the home page
 *
 * No horizontal carousel and no per-service detail panel: every
 * service exposes its tagline + description inline through the
 * accordion in slide 1.
 */
export default function ServicesClient() {
  const slides: Slide[] = [
    { type: "vertical", content: <IndexSection />, label: "Services" },
    { type: "dock", content: <Footer />, label: "Footer" },
  ];

  return (
    <FullPageScroller theme="light" slides={slides}>
      <MenuOverlay theme="light" />
    </FullPageScroller>
  );
}

/* =============================================================================
 *   Section 1 — Services index
 *
 *     ● Our services                                          Contact us
 *
 *     Services                We're a highly collaborative team that…
 *                             ──────────────────────────────────────
 *                             Blockchain                           ↓
 *                             AI Automations                       ↓
 *                             IoT                                  ↓
 *                             …                                    …
 *                             ──────────────────────────────────────
 * ========================================================================== */

function IndexSection() {
  /** Which row (if any) is currently expanded.  `null` collapses the
   *  whole list — only one row may be open at a time so the layout
   *  never grows uncontrollably on tall accordions. */
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden bg-white text-neutral-900">
      <BrandHeader tone="light" />

      {/*
        `min-h-0` lets the body grid shrink to whatever height the
        parent flex container allocates instead of growing to fit the
        accordion's intrinsic content.  The right column is the only
        scroll container; the left column (Services wordmark) stays
        vertically centred regardless of how many rows are open.
      */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-8 pt-6 sm:px-10 sm:pb-10 sm:pt-8 lg:px-16 lg:pb-12 lg:pt-10">
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          {/* LEFT — "Services" wordmark.  Pinned to the top of the
              column so its baseline sits next to the right column's
              description paragraph rather than floating in the
              vertical middle.

              Animation stack (see `app/globals.css` →
              "Services title — in-place 3D unfold + chrome sweep"):

              - Each character sits in a `.title-mask` wrapper with
                the actual glyph in `.title-letter`.  The glyph tips
                back on the X axis 82°, pulls forward in Z, scales
                up from 0.94 and de-blurs from 14 px — i.e. it
                "unfolds toward the viewer" *in place*, never
                sliding up from below the baseline.
              - The wrapping `.title-3d` element opens its kerning
                from `+0.06em` to `-0.04em` over 1.5 s so the
                wordmark visibly *settles* into its final tracking.
              - After the last letter lands, a one-shot specular
                highlight sweeps across the wordmark via
                `.title-3d::after` (paints a `background-clip: text`
                chrome gradient using `data-text`).

              Per-letter `animation-delay` (75 ms apart) orchestrates
              the cascade left-to-right; tweaking the base offset
              (180 ms) controls how quickly the first letter starts
              after the slide becomes active. */}
          <div className="flex min-h-0 min-w-0 flex-col items-start justify-start lg:col-span-5">
            <h1
              aria-label="Services"
              data-text="Services"
              className="title-3d text-[clamp(2.5rem,6.5vw,5.25rem)] font-bold leading-[0.95] text-neutral-900"
            >
              {Array.from("Services").map((char, i) => (
                <span key={i} className="title-mask">
                  <span
                    className="title-letter"
                    style={{ animationDelay: `${180 + i * 75}ms` }}
                  >
                    {char}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          {/* RIGHT — short pitch + accordion list.  Native scrollbars
              are hidden because the accordion fits 9 rows + an
              expanded description in a typical viewport; the
              `mask-fade` at the bottom still hints at any rare
              overflow without exposing a chrome gutter. */}
          <div className="relative flex min-h-0 min-w-0 flex-col lg:col-span-7">
            <div
              className="flex min-h-0 flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 0, black calc(100% - 24px), transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0, black calc(100% - 24px), transparent 100%)",
              }}
            >
              <p
                data-reveal
                style={{ transitionDelay: "80ms" }}
                className="max-w-md text-[15px] leading-[1.55] text-neutral-700 sm:text-[16px]"
              >
                We&apos;re a highly collaborative team that enjoys working
                together and getting engaged in sharing our knowledge and
                experience.
              </p>

              <ul className="mt-8 divide-y divide-neutral-200 border-b border-t border-neutral-200">
                {SERVICES.map((service, i) => {
                  const open = openIdx === i;
                  return (
                    <li key={service.slug}>
                      {/* Row header — `outline-none` + `focus-visible:outline-none`
                          kill the browser's default focus ring, which on
                          click looks like a black box around the active
                          row.  Keyboard focus is still discoverable via
                          the row's `:hover` styles + the rotating arrow. */}
                      <button
                        type="button"
                        onClick={() => setOpenIdx(open ? null : i)}
                        aria-expanded={open}
                        aria-controls={`svc-${service.slug}`}
                        data-reveal
                        style={{ transitionDelay: `${160 + i * 35}ms` }}
                        className="group flex w-full items-center justify-between gap-4 py-3.5 text-left outline-none transition-colors duration-300 focus:outline-none focus-visible:outline-none sm:py-4"
                      >
                        <span className="text-[1.05rem] font-medium text-neutral-900 sm:text-[1.2rem]">
                          {service.title}
                        </span>
                        <ArrowToggle open={open} />
                      </button>

                      {/* Expanded copy — animated grid-template-rows
                          collapse for a smooth height transition without
                          measuring child heights manually. */}
                      <div
                        id={`svc-${service.slug}`}
                        className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
                        style={{
                          gridTemplateRows: open ? "1fr" : "0fr",
                          opacity: open ? 1 : 0,
                        }}
                      >
                        <div className="min-h-0">
                          <div className="pb-5 sm:pb-6">
                            <p className="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                              {service.tagline}
                            </p>
                            <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-neutral-700 sm:text-[14.5px]">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
 *   Top-of-section header (brand wordmark only)
 *
 *   Tone-aware so the same component reads correctly on either a
 *   light surface (dark text) or a dark surface (white text).  The
 *   right-hand "Contact us" link was removed per design feedback —
 *   the global menu (top-right hamburger) already exposes the route.
 * ========================================================================== */

function BrandHeader({ tone }: { tone: "light" | "dark" }) {
  const isDark = tone === "dark";
  const textClass = isDark ? "text-white" : "text-neutral-900";
  const dotClass = isDark ? "bg-white" : "bg-neutral-900";
  const wordmarkHover = isDark
    ? "hover:text-white/80"
    : "hover:text-neutral-700";
  // CTA on the top-right — points to the contact form.  Tone-aware so
  // it reads on both light and dark surfaces.
  const ctaHover = isDark ? "hover:text-white/80" : "hover:text-neutral-700";
  const ctaDecoration = isDark
    ? "decoration-white/40 hover:decoration-white"
    : "decoration-neutral-400 hover:decoration-neutral-900";

  return (
    // Mobile: column layout with the wordmark on row 1 (which leaves
    // the right-hand corner clear for the global menu trigger) and
    // "Get a quote" on row 2.
    //
    // The hamburger trigger is `fixed right-4 top-4` (44 × 44 px on
    // mobile) so its hit area extends to roughly y ≈ 60 px from the
    // top.  To make sure the CTA never tucks under it we (a) push the
    // second row further down with `gap-5`, and (b) give it a right
    // margin so its right edge sits to the *left* of the menu button
    // even when the user has tiny screens.
    //
    // sm+: drops the safety margins and switches to the original row
    // layout (`flex-row` + `justify-between`) so the wordmark sits on
    // the left and "Get a quote" on the right.
    <header className="relative z-[3] mx-auto flex w-full max-w-7xl flex-col items-start gap-5 px-6 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:px-10 sm:pt-8 lg:px-16 lg:pt-10">
      <Link
        href="/"
        className={`inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.28em] transition-colors ${textClass} ${wordmarkHover}`}
      >
        <span aria-hidden className={`h-2 w-2 rounded-full ${dotClass}`} />
        Our services
      </Link>

      <Link
        href="/contact"
        className={`mr-14 self-end text-[12px] font-semibold uppercase tracking-[0.28em] underline-offset-[6px] decoration-1 underline transition-colors sm:mr-0 sm:self-auto ${textClass} ${ctaHover} ${ctaDecoration}`}
      >
        Get a quote
      </Link>
    </header>
  );
}

/* =============================================================================
 *   ↓ / ↑ accordion toggle
 *
 *   Closed rows render the arrow rotated 90° clockwise (so it reads as
 *   ↓), open rows rotate it -90° (↑).  No surrounding pill / circle —
 *   the chevron sits flush against the row, matching the reference's
 *   minimal hairline style.
 * ========================================================================== */

function ArrowToggle({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className="grid h-7 w-7 flex-none place-items-center text-neutral-700 transition-colors duration-300 group-hover:text-neutral-900"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-4 w-4 transition-transform duration-300 ${
          open ? "-rotate-90" : "rotate-90"
        }`}
      >
        <path d="M5 12h14" />
        <path d="M13 5l7 7-7 7" />
      </svg>
    </span>
  );
}
