"use client";

import Link from "next/link";

import AnimatedHeadline from "./AnimatedHeadline";
import { useFpsControls } from "./FullPageScroller";

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function Intro() {
  const { advance } = useFpsControls();
  return (
    // `absolute inset-0` makes Intro stretch to fill its slide directly off
    // the FullPageScroller's `relative` wrapper, *without* relying on the
    // `h-full` percentage chain to propagate (which we hit edge cases for
    // on certain desktops where the inner `flex-1` hero collapsed and left
    // a black band — the FullPageScroller's `bg-black` showing through —
    // at the bottom of section 1). With an absolute fill the inner
    // `h-full` chain has a definite parent height and resolves cleanly.
    <section className="absolute inset-0">
      <div className="relative h-full w-full overflow-hidden">
        {/* mesh gradient */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 55% 45% at 22% 18%, rgba(125, 155, 185, 0.75) 0%, transparent 65%),
              radial-gradient(ellipse 35% 32% at 78% 22%, rgba(225, 180, 140, 0.45) 0%, transparent 60%),
              radial-gradient(circle at 62% 48%, rgba(255, 120, 90, 0.95) 0%, transparent 42%),
              radial-gradient(ellipse 85% 45% at 50% 82%, rgba(185, 30, 40, 0.95) 0%, transparent 62%),
              linear-gradient(to bottom, #2a2232 0%, #1a0f1a 55%, #0a0306 100%)
            `,
          }}
        />

        {/* grainy noise */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay"
          style={{
            backgroundImage: NOISE_SVG,
            backgroundSize: "220px 220px",
          }}
        />

        {/* subtle bottom vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent"
        />

        {/* Content fills the slide's measured visible-viewport height (the
            chain is: FullPageScroller's section -> Intro's <section> -> this
            wrapper, all `h-full`). `100vh` on real mobile devices is taller
            than the visible area because it counts the URL-bar space, which
            previously bled the prior section in at the top after each page
            transition — using the measured height avoids that. */}
        <div className="relative z-10 flex h-full flex-col">
          {/* header — just the wordmark; navigation + Schedule call now
              live in the global MenuOverlay (see app/page.tsx). The right
              edge is reserved for the menu hamburger trigger, which is
              fixed-positioned and drawn on top of every section. */}
          <header
            data-reveal
            style={{ transitionDelay: "100ms" }}
            className="flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14 lg:py-8"
          >
            <Link
              href="#"
              className="text-base font-semibold tracking-[0.25em] text-white sm:text-lg"
            >
              LORUM IPSUM
            </Link>
          </header>

          {/* hairline */}
          <div className="mx-6 h-px bg-white/20 sm:mx-10 lg:mx-14" />

          {/* hero */}
          <div className="flex flex-1 flex-col justify-center px-6 pb-10 pt-20 sm:px-10 lg:px-14 lg:pb-16 lg:pt-28">
            <AnimatedHeadline />

            <div data-reveal style={{ transitionDelay: "700ms" }} className="mt-10">
              <Link
                href="#"
                className="group relative inline-flex w-fit items-center gap-3 overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(255,255,255,0.25)]"
              >
                <span className="relative">Read More</span>
                <span className="relative grid h-4 w-4 place-items-center overflow-hidden">
                  <ArrowUpRight className="absolute h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-5 group-hover:translate-x-5" />
                  <ArrowUpRight className="absolute h-3.5 w-3.5 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
                </span>
              </Link>
            </div>
          </div>

          {/* discover more — advances the FullPageScroller by one step.
              Extra bottom padding on phones keeps the down-arrow above the
              browser's address-bar / system nav. */}
          <div
            data-reveal
            style={{ transitionDelay: "1000ms" }}
            className="flex justify-end px-6 pb-24 pt-6 sm:px-10 sm:py-10 lg:px-14 lg:py-14"
          >
            <button
              type="button"
              onClick={advance}
              aria-label="Discover more about our services"
              className="group relative grid h-12 w-12 flex-none place-items-center rounded-full border border-white/60 text-white transition-[transform,background-color,border-color,color] duration-300 hover:scale-110 hover:border-white hover:bg-white hover:text-black"
            >
              <ArrowDown className="h-4 w-4 animate-arrow-bob" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowUpRight({ className = "" }: { className?: string }) {
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
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function ArrowDown({ className = "" }: { className?: string }) {
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
      <path d="M12 5v14" />
      <path d="M19 12l-7 7-7-7" />
    </svg>
  );
}
