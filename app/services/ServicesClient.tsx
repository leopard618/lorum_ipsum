"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import FullPageScroller, {
  type Slide,
  useFpsControls,
} from "@/components/FullPageScroller";
import MenuOverlay from "@/components/MenuOverlay";
import { SERVICES, type Service } from "@/lib/services";

/**
 * /services — single-slide horizontal-snap experience.
 *
 * One `type: "horizontal"` slide hosts every panel side-by-side.
 * Vertical wheel / swipe / arrow input slides through the panels
 * left-to-right; nothing scrolls vertically.  The dot-nav on the
 * right edge of the viewport renders one dot per panel so the user
 * can see how many sections are still ahead.
 *
 *   Panel 0       — IndexPanel:    Big "SERVICES" wordmark on the
 *                                  left, expandable accordion of
 *                                  every service on the right.
 *                                  Clicking a row's "View" arrow
 *                                  jumps directly to that service's
 *                                  panel (Panels 1-9).
 *
 *   Panels 1..N   — ServiceDetailPanel: One per service in
 *                                  catalogue order.  Each panel is
 *                                  a centred card on a near-black
 *                                  backdrop — left half is a white
 *                                  info panel (eyebrow, title,
 *                                  tagline, feature chip, copy,
 *                                  CTA, big numeric watermark and
 *                                  prev/next pager), right half is
 *                                  the service photograph.  A
 *                                  circular "0N / 09" badge floats
 *                                  top-right of the dark area as a
 *                                  pagination cue.
 *
 * Because each panel is its own React subtree, there's no shared
 * "active service" state — every panel renders for the service it
 * was given at mount.  Navigation between panels goes through
 * `useFpsControls().goto(stepIdx)`, so the in-card prev/next
 * buttons and the index accordion both drive the same scroller.
 */
export default function ServicesClient() {
  const total = SERVICES.length;
  const slides: Slide[] = [
    {
      type: "horizontal",
      panels: [
        <IndexPanel key="index" />,
        ...SERVICES.map((service, idx) => (
          <ServiceDetailPanel
            key={service.slug}
            service={service}
            idx={idx}
            total={total}
          />
        )),
      ],
      labels: ["All services", ...SERVICES.map((s) => s.title)],
    },
  ];

  return (
    <FullPageScroller theme="light" slides={slides}>
      <MenuOverlay theme="light" />
    </FullPageScroller>
  );
}

/* =============================================================================
 *   Panel 0 — INDEX
 *
 *     ● Our services                              Let's work together
 *
 *               SERVICES               (All services)
 *               (centred)              01  Blockchain          +
 *                                      02  AI Automations      +
 *                                      …
 *
 *               01 · Index
 * ========================================================================== */

function IndexPanel() {
  const { goto } = useFpsControls();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  /** Jump straight to the chosen service's detail panel.  Panel 0 is
   *  this index, so service N (0-indexed) lives at step N+1. */
  const jumpToService = (idx: number) => {
    goto(idx + 1);
  };

  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden bg-white text-neutral-900">
      <SlideHeader variant="brand" tone="light" />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-10 pt-2 sm:px-10 sm:pb-12 sm:pt-4 lg:px-16 lg:pb-16 lg:pt-6">
        <div className="grid flex-1 grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* LEFT — Big wordmark, vertically centred.  "01 · Index"
              counter pinned to the bottom of the column.  `min-w-0` +
              `overflow-hidden` keep the giant SERVICES wordmark
              inside its grid cell at every break-point. */}
          <div className="flex min-w-0 flex-col overflow-hidden lg:col-span-6">
            <div className="flex flex-1 items-center">
              <h1
                data-reveal
                className="text-[clamp(2.5rem,7.5vw,6.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.045em] text-neutral-900"
              >
                SERVICES
              </h1>
            </div>

            {/* "01 · Index" counter, anchored bottom-left of the column */}
            <div
              data-reveal
              style={{ transitionDelay: "240ms" }}
              className="hidden items-end gap-4 lg:flex"
            >
              <span className="font-bold leading-none tracking-[-0.02em] text-neutral-900 text-[clamp(3rem,6.5vw,5rem)]">
                01
              </span>
              <span className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
                · Index
              </span>
            </div>
          </div>

          {/* RIGHT — accordion list */}
          <div className="min-w-0 lg:col-span-6">
            <div
              data-reveal
              style={{ transitionDelay: "120ms" }}
              className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-500"
            >
              (All services)
            </div>

            <ul className="divide-y divide-neutral-200 border-b border-t border-neutral-200">
              {SERVICES.map((service, i) => {
                const open = openIdx === i;
                return (
                  <li key={service.slug}>
                    {/* Row header */}
                    <button
                      type="button"
                      onClick={() => setOpenIdx(open ? null : i)}
                      aria-expanded={open}
                      aria-controls={`svc-${service.slug}-panel`}
                      data-reveal
                      style={{ transitionDelay: `${160 + i * 40}ms` }}
                      className="group flex w-full items-center justify-between gap-4 py-4 text-left transition-colors duration-300 sm:py-5"
                    >
                      <span className="flex items-baseline gap-3 sm:gap-5">
                        <span className="hidden text-[10.5px] font-semibold uppercase tracking-[0.28em] text-neutral-400 sm:inline">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[1.1rem] font-medium text-neutral-900 sm:text-[1.25rem]">
                          {service.title}
                        </span>
                      </span>
                      <PlusIcon open={open} />
                    </button>

                    {/* Expanded description + jump link */}
                    <div
                      id={`svc-${service.slug}-panel`}
                      className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
                      style={{
                        gridTemplateRows: open ? "1fr" : "0fr",
                        opacity: open ? 1 : 0,
                      }}
                    >
                      <div className="min-h-0">
                        <div className="grid grid-cols-1 items-end gap-5 pb-5 sm:grid-cols-12 sm:gap-8 sm:pb-6 sm:pl-9">
                          <div className="sm:col-span-9">
                            <p className="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                              {service.tagline}
                            </p>
                            <p className="mt-2 text-[14px] leading-relaxed text-neutral-700 sm:text-[15px]">
                              {service.description}
                            </p>
                          </div>

                          {/* Diagonal-up arrow → preselects service +
                              jumps to the carousel slide below. */}
                          <div className="sm:col-span-3 sm:flex sm:justify-end">
                            <button
                              type="button"
                              onClick={() => jumpToService(i)}
                              aria-label={`Open ${service.title} in carousel`}
                              className="group relative inline-flex items-center gap-2 rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white transition-[transform,background-color,color] duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-neutral-900"
                            >
                              View
                              <DiagonalArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Mobile counter (the lg: variant lives in the LEFT column) */}
            <div className="mt-10 flex items-end gap-4 lg:hidden">
              <span className="font-bold leading-none tracking-[-0.02em] text-neutral-900 text-[clamp(3rem,9vw,4rem)]">
                01
              </span>
              <span className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
                · Index
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
 *   Panels 1..N — SERVICE DETAIL  (mirrors the "Lender Matches /
 *   Deutsche Bank" reference: a centred *card* on a near-black
 *   backdrop, split 50/50 — left half is a white panel with the
 *   service's editorial write-up + a giant numeric watermark and a
 *   prev/next pager at the bottom; right half is a photograph of
 *   the service.  Outside the card, in the dark area, a circular
 *   "0N / 0Total" badge floats top-right as a pagination anchor so
 *   the user can read off how many panels are still ahead.)
 * ========================================================================== */

function ServiceDetailPanel({
  service,
  idx,
  total,
}: {
  /** The service this panel renders.  Each panel is fixed to one
   *  service for the lifetime of the mount — there's no internal
   *  active-state any more. */
  service: Service;
  /** 0-based position of this service in the catalogue.  Used for
   *  the visible "0N" counter and watermark, AND to compute the
   *  step index that prev / next / X close push to. */
  idx: number;
  /** Total number of services so the counter can render "0N / 0M"
   *  without each panel re-deriving it. */
  total: number;
}) {
  const { goto } = useFpsControls();

  /* Panel 0 in the FullPageScroller is the index, so service N
     (0-indexed) lives at step N+1. */
  const stepIdx = idx + 1;
  const advance = () => goto(stepIdx + 1);
  const retreat = () => goto(stepIdx - 1);

  const counter = `${String(idx + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden bg-white">
      {/* Top header bar — back button + Let's work together.  Sits
          on the white surface so we use the `light` tone (dark text)
          rather than the `inverted` tone of the previous dark
          backdrop. */}
      <SlideHeader variant="back" tone="light" />

      {/* "0N / 0M" pagination pill — pinned to the upper-right of the
          viewport just below the SlideHeader, mirroring the "3/6"
          pill in the reference.  Dark glassy fill so it reads on
          both the white-panel side (mobile, when stacked) and the
          photo side (desktop, where it floats over the image). */}
      <div
        aria-hidden
        className="svc-fade-up pointer-events-none absolute z-[4] right-6 top-[80px] grid h-12 w-12 place-items-center rounded-full bg-neutral-900 text-[13px] font-medium tabular-nums text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] sm:right-10 sm:top-[92px] sm:h-14 sm:w-14 sm:text-[14px] lg:right-14 lg:top-[100px] xl:right-20"
      >
        {counter}
      </div>

      {/* MAIN SPLIT — full-screen 50/50 white panel + photo.  No
          centered card or shadow — the layout reaches the screen
          edges so the experience feels like a dedicated page per
          service rather than a floating modal. */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* LEFT — white info panel */}
        <div className="relative flex flex-col bg-white px-6 pb-6 pt-8 sm:px-10 sm:pb-8 sm:pt-10 lg:flex-1 lg:px-16 lg:pb-12 lg:pt-12 xl:px-20">
          {/* X close pill — top-right of the panel.  Mirrors the
              back button in the SlideHeader; both wired to `goto(0)`
              so either gesture returns the user to the index panel. */}
          <button
            type="button"
            onClick={() => goto(0)}
            aria-label="Back to all services"
            className="absolute right-6 top-8 z-[2] grid h-9 w-9 place-items-center rounded-full bg-neutral-900 text-white transition-colors duration-300 hover:bg-neutral-700 sm:right-10 sm:top-10 lg:right-14 lg:top-12 xl:right-16"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>

          {/* TOP EDITORIAL BLOCK — eyebrow → title → tagline → chip
              → description → CTA.  `max-w-md` keeps the prose at a
              comfortable reading line length on wide screens. */}
          <div className="max-w-md">
            <div className="svc-fade-up text-[10.5px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
              Service Match
            </div>

            <h2 className="svc-fade-up mt-3 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-neutral-900">
              {service.title}
            </h2>

            <p className="svc-fade-up mt-1 text-[clamp(1.2rem,2.2vw,1.65rem)] font-medium text-neutral-900">
              {service.tagline}
            </p>

            <div className="svc-fade-up mt-6">
              <span className="inline-flex items-center rounded-full border border-neutral-300 px-3.5 py-1.5 text-[12px] font-medium text-neutral-700">
                {service.features[0]}
              </span>
            </div>

            <p className="svc-fade-up mt-3 text-[14px] leading-relaxed text-neutral-500">
              {service.description}
            </p>

            <div className="svc-fade-up mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-white transition-colors duration-300 hover:bg-neutral-700"
              >
                Apply now
              </Link>
            </div>
          </div>

          {/* HORIZONTAL DIVIDER — splits the editorial block above
              from the navigation block below, just like the line in
              the reference card. */}
          <div className="mt-10 h-px w-full bg-neutral-200" />

          {/* BOTTOM NAVIGATION BLOCK — the giant numeric watermark
              dominates the centre of this band, with the prev/next
              circular pager pinned at the bottom-left.  `flex-1` on
              the wrapper makes this band absorb all the remaining
              vertical space inside the panel. */}
          <div className="relative flex flex-1 items-center justify-center pb-2 pt-8">
            <span
              aria-hidden
              className="svc-watermark-in font-bold leading-none tracking-[-0.04em] text-neutral-900 text-[clamp(5rem,12vw,10rem)]"
            >
              {idx + 1}
            </span>

            <div className="absolute bottom-0 left-0 flex items-center gap-3">
              <CardPager
                direction="prev"
                onClick={retreat}
                variant="ghost"
                disabled={false}
              />
              <CardPager
                direction="next"
                onClick={advance}
                variant="primary"
                disabled={idx === total - 1}
              />
            </div>
          </div>
        </div>

        {/* RIGHT — service photograph.  `flex-1` makes it 50% width
            on lg+ (sharing the row with the white panel) and lets it
            absorb whatever vertical space the white panel leaves on
            mobile (where the layout stacks).  The `.svc-hero-zoom`
            Ken-Burns animation fires whenever the panel becomes
            active, so the image lands with a subtle zoom-out as the
            user scrolls into it. */}
        <div className="relative flex-1 overflow-hidden bg-neutral-100">
          <div className="svc-hero-zoom absolute inset-0">
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              /* The first service panel is the one the user typically
                 scrolls into immediately after the index, so
                 prioritise its decode for LCP. */
              priority={idx === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
 *   Card-style pager arrow (used inside the white info panel).
 *   Two visual variants:
 *     · ghost   — outlined circle, neutral grey, used for prev
 *     · primary — solid black circle with white icon, used for next
 *   Together they read as a "back / forward" pair, exactly like
 *   the reference card.
 * ========================================================================== */

function CardPager({
  direction,
  onClick,
  variant,
  disabled = false,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  variant: "ghost" | "primary";
  /** When true the pager renders dimmed and ignores clicks — used at
   *  the catalogue boundaries (last service can't advance). */
  disabled?: boolean;
}) {
  const isNext = direction === "next";
  const base =
    "group grid h-10 w-10 place-items-center rounded-full transition-[transform,background-color,border-color,color,opacity] duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100";
  const skin =
    variant === "primary"
      ? "bg-neutral-900 text-white hover:bg-neutral-700"
      : "border border-neutral-300 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isNext ? "Next service" : "Previous service"}
      className={`${base} ${skin}`}
    >
      {isNext ? (
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      ) : (
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      )}
    </button>
  );
}

/* =============================================================================
 *   Shared chrome
 * ========================================================================== */

/** Top-of-slide header.
 *
 *  - `brand` (used on the index): a small dot + "Our services" wordmark on
 *    the left, plus "Let's work together" pinned to the right.
 *  - `back` (used on the carousel): a circular ⟵ button that
 *    returns the user to the index slide, with the same right-side CTA.
 *
 *  `tone` switches the colour palette between `light` (dark text on
 *  white surface) and `inverted` (white text on dark / photo
 *  surface) so the header reads on both slide types.
 */
function SlideHeader({
  variant,
  tone,
}: {
  variant: "brand" | "back";
  tone: "light" | "inverted";
}) {
  const { goto } = useFpsControls();
  const isInverted = tone === "inverted";

  const labelClass = isInverted ? "text-white" : "text-neutral-900";
  const labelHover = isInverted
    ? "hover:text-white/70"
    : "hover:text-violet-600";
  const dotClass = isInverted ? "bg-white" : "bg-neutral-900";
  const ctaClass = isInverted
    ? "text-white decoration-white/40 hover:text-white hover:decoration-white"
    : "text-neutral-900 decoration-neutral-900/40 hover:text-violet-600 hover:decoration-violet-600";
  const backRingClass = isInverted
    ? "border-white/40 text-white group-hover:border-white group-hover:bg-white group-hover:text-neutral-900"
    : "border-neutral-300 text-neutral-900 group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white";

  /* The brand-variant lives on the index slide whose body is anchored
     in `max-w-7xl`, so its header gets the same constraint.  The
     back-variant lives on the carousel where the title block sits at
     viewport-relative padding — we drop the max-width here so the
     back button + "Let's work together" line up flush with that title
     instead of indenting to a narrower container. */
  const containerClass =
    variant === "brand"
      ? "mx-auto max-w-7xl px-6 sm:px-10 lg:px-16"
      : "px-6 sm:px-10 lg:px-14 xl:px-20";

  return (
    <header
      className={`relative z-[3] flex w-full items-center justify-between pt-6 sm:pt-8 lg:pt-10 ${containerClass}`}
    >
      {variant === "brand" ? (
        <Link
          href="/"
          className={`inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.28em] transition-colors ${labelClass} ${labelHover}`}
        >
          <span aria-hidden className={`h-2 w-2 rounded-full ${dotClass}`} />
          Our services
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => goto(0)}
          aria-label="Back to all services"
          className="group inline-flex items-center gap-3"
        >
          <span
            className={`grid h-9 w-9 place-items-center rounded-full border transition-[transform,background-color,color,border-color] duration-300 group-hover:scale-105 ${backRingClass}`}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </span>
          <span
            className={`text-[12px] font-semibold uppercase tracking-[0.28em] ${labelClass}`}
          >
            Our services
          </span>
        </button>
      )}

      <Link
        href="/contact"
        className={`hidden items-center gap-2 text-[12px] font-semibold tracking-[0.05em] underline underline-offset-[6px] transition-colors sm:inline-flex ${ctaClass}`}
      >
        Let&apos;s work together
      </Link>
    </header>
  );
}

/** Animated +/× toggle for accordion rows. */
function PlusIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className="relative grid h-9 w-9 flex-none place-items-center rounded-full border border-neutral-300 transition-colors duration-300 group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white"
    >
      <span className="relative block h-3 w-3">
        <span
          className={`absolute left-1/2 top-1/2 block h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-current transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        />
        <span
          className={`absolute left-1/2 top-1/2 block h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-current transition-transform duration-300 ${
            open ? "rotate-45 scale-y-100" : "rotate-0"
          }`}
        />
      </span>
    </span>
  );
}

/* ================================== icons ================================= */

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

function DiagonalArrowUp({ className = "" }: { className?: string }) {
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
      <path d="M7 17L17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
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
      <path d="M6 6l12 12" />
      <path d="M18 6l-12 12" />
    </svg>
  );
}
