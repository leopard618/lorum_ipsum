"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useFpsControls } from "./FullPageScroller";

export type MenuItem = {
  /** Display label for the nav row. */
  label: string;
  /** Step index in the FullPageScroller to jump to when clicked. */
  step: number;
  /** Tiny subtitle shown beneath the label inside the panel. */
  hint?: string;
};

/**
 * Default site nav. Step indices match the slide order defined in
 * `app/page.tsx`. If the slide list changes, update these numbers (or pass
 * an explicit `items` prop from the page).
 */
export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { label: "Home", step: 0, hint: "Welcome" },
  { label: "Services", step: 1, hint: "What we do" },
  { label: "Industries", step: 4, hint: "Where we work" },
  { label: "Blog", step: 5, hint: "Field notes & essays" },
  { label: "Contact", step: 6, hint: "Get in touch" },
];

/**
 * Site-wide menu. Renders a fixed hamburger trigger that morphs into an X
 * when the slide-in panel is open. Navigation items drive the
 * FullPageScroller via `useFpsControls().goto(step)`, so wherever the user
 * is in the page they can jump to any section.
 *
 * Must be rendered inside `FullPageScroller` (which provides the controls
 * context) — see `app/page.tsx`.
 */
export default function MenuOverlay({
  items = DEFAULT_MENU_ITEMS,
}: {
  items?: MenuItem[];
}) {
  const [open, setOpen] = useState(false);
  const { goto } = useFpsControls();

  // Esc closes; lock body scroll while open (defense-in-depth — the
  // FullPageScroller already prevents page scroll, but native body scroll
  // can still escape via long pages on some browsers).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleNav = (step: number) => {
    setOpen(false);
    // Fire goto on the same tick — the panel's slide-out and the
    // scroller's section transition animate concurrently, which feels
    // snappier than waiting for the panel to fully close first.
    goto(step);
  };

  return (
    <>
      {/* Trigger — hamburger that morphs into an X when open. Highest z
          so it stays clickable on top of the panel (acts as the close X). */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="site-menu-panel"
        className="fixed right-4 top-4 z-[70] grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition hover:scale-105 hover:border-white/70 hover:bg-white hover:text-black sm:right-6 sm:top-6 sm:h-12 sm:w-12"
      >
        <span className="relative h-3 w-5">
          <span
            aria-hidden
            className={`absolute left-0 right-0 h-px bg-current transition-all duration-300 ${
              open
                ? "top-1/2 -translate-y-1/2 rotate-45"
                : "top-0"
            }`}
          />
          <span
            aria-hidden
            className={`absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-current transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            aria-hidden
            className={`absolute left-0 right-0 h-px bg-current transition-all duration-300 ${
              open
                ? "top-1/2 -translate-y-1/2 -rotate-45"
                : "bottom-0"
            }`}
          />
        </span>
      </button>

      {/* Backdrop — clicking it closes the menu */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[55] bg-black/70 backdrop-blur-sm transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Slide-in panel */}
      <aside
        id="site-menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col overflow-y-auto bg-gradient-to-br from-neutral-950 via-neutral-950 to-[#1A0A30] shadow-[-20px_0_60px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-out sm:max-w-lg ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Subtle inner accent line on the left edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-violet-400/40 to-transparent"
        />

        <div className="flex h-full flex-col p-8 pt-20 sm:p-12 sm:pt-24">
          {/* Brand */}
          <div className="text-base font-semibold tracking-[0.25em] text-white sm:text-lg">
            LORUM IPSUM
          </div>

          {/* Nav list */}
          <nav className="mt-12 flex-1 sm:mt-16">
            <ul className="space-y-1">
              {items.map((item, i) => (
                <li
                  key={item.label}
                  style={{
                    transition:
                      "opacity 600ms ease-out, transform 600ms ease-out",
                    transitionDelay: open ? `${120 + i * 70}ms` : "0ms",
                    opacity: open ? 1 : 0,
                    transform: open ? "translateX(0)" : "translateX(24px)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleNav(item.step)}
                    className="group flex w-full items-baseline gap-5 border-b border-white/[0.08] py-4 text-left transition-colors duration-300 hover:border-white/30 sm:py-5"
                  >
                    <span className="tabular-nums text-[10px] font-medium uppercase tracking-[0.3em] text-white/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span className="block text-3xl font-light leading-tight tracking-tight text-white/85 transition-colors duration-300 group-hover:text-white sm:text-4xl">
                        {item.label}
                      </span>
                      {item.hint && (
                        <span className="mt-1 block text-[11px] uppercase tracking-[0.25em] text-white/40">
                          {item.hint}
                        </span>
                      )}
                    </span>
                    <span
                      aria-hidden
                      className="translate-x-0 text-white/40 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white group-hover:opacity-100"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer of the menu — Schedule call CTA + small print */}
          <div
            className="mt-8 space-y-6"
            style={{
              transition: "opacity 600ms ease-out, transform 600ms ease-out",
              transitionDelay: open ? `${120 + items.length * 70 + 80}ms` : "0ms",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(12px)",
            }}
          >
            <Link
              href="#"
              onClick={() => setOpen(false)}
              className="group inline-flex w-fit items-center gap-3 overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_8px_24px_rgba(255,255,255,0.18)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(255,255,255,0.28)]"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span>Schedule call</span>
            </Link>

            <p className="text-[11px] uppercase tracking-[0.25em] text-white/35">
              © {new Date().getFullYear()} Lorum Ipsum
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

function ArrowRight({ className = "" }: { className?: string }) {
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
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}
