"use client";

import { useEffect, useState } from "react";

type IndustryData = {
  name: string;
  description: string;
};

const industriesData: IndustryData[] = [
  {
    name: "Finance",
    description:
      "Modernizing capital markets with data-driven platforms, quant tooling, and resilient trading infrastructure built to scale with volatility.",
  },
  {
    name: "Real Estate",
    description:
      "Bringing transparency and speed to property markets through intelligent listings, valuation models, and end-to-end deal-flow automation.",
  },
  {
    name: "Software",
    description:
      "Shipping production-grade SaaS, developer tooling, and cloud-native systems that accelerate engineering velocity without trading away reliability.",
  },
  {
    name: "Banking",
    description:
      "Designing secure, compliant core-banking experiences — from onboarding to ledgers — that customers actually want to use.",
  },
  {
    name: "Healthcare",
    description:
      "Building HIPAA-ready platforms, clinical workflows, and patient experiences that reduce friction for providers and patients alike.",
  },
  {
    name: "Logistics",
    description:
      "Optimizing fleets, warehouses, and last-mile operations with real-time visibility and smarter routing across the supply chain.",
  },
];

// Each of the 3 slots cycles between two industries: phase 0 shows [0,2,4], phase 1 shows [1,3,5].
const SLOT_PAIRS: Array<[number, number]> = [
  [0, 3],
  [1, 4],
  [2, 5],
];

// The heading's variable word cycles alongside the list.
const HEADING_WORDS = ["serve", "are into"];

const CYCLE_MS = 9000;
const EXIT_MS = 900;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function Industries() {
  const [phase, setPhase] = useState(0);
  const [exiting, setExiting] = useState(false);
  // Two channels feed the description panel:
  //   - hoveredIdx: live, desktop-only, cleared on mouse-leave
  //   - selectedIdx: sticky, set by tap/click (primary input on mobile)
  // Hover wins when present so a desktop user never sees a stale tap state.
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const changePhase = (direction: 1 | -1) => {
    if (exiting) return;
    setExiting(true);
    window.setTimeout(() => {
      setPhase((p) => (p + direction + 2) % 2);
      setExiting(false);
    }, EXIT_MS);
  };

  // Auto-cycle — depending on `phase` restarts the interval on every phase
  // change (including manual ones), which is the natural "reset the timer
  // after the user pressed next/prev" behavior.
  useEffect(() => {
    const id = setInterval(() => {
      setExiting(true);
      window.setTimeout(() => {
        setPhase((p) => (p + 1) % 2);
        setExiting(false);
      }, EXIT_MS);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [phase]);

  // Clear any lingering description when the visible set flips.
  useEffect(() => {
    setHoveredIdx(null);
    setSelectedIdx(null);
  }, [phase]);

  const toggleSelection = (idx: number) => {
    setSelectedIdx((curr) => (curr === idx ? null : idx));
  };

  const currentWord = HEADING_WORDS[phase];
  const activeIdx = hoveredIdx ?? selectedIdx;
  const activeIndustry =
    activeIdx !== null ? industriesData[activeIdx] : null;

  return (
    // `absolute inset-0` (instead of `relative h-full`) makes Industries
    // stretch to fill its slide directly off the FullPageScroller's
    // `relative` wrapper. This is what lets the `flex-1` spacer below
    // actually grow on desktop — when the `h-full` percentage chain
    // failed to propagate (which we observed on some PC viewports) the
    // inner flex column collapsed to natural content height, the spacer
    // had nothing to grow into, and the description + list + pager row
    // floated up under the heading instead of docking against the
    // bottom of the section. The client described this as "industries
    // went up on Desktop".
    <section className="absolute inset-0 overflow-hidden bg-white">
      {/* Border beam — rotating highlight that sweeps the edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="animate-border-beam absolute left-1/2 top-1/2 h-[220%] w-[220%]"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, transparent 0%, transparent 86%, rgba(20, 40, 120, 0.35) 93%, rgba(60, 90, 200, 0.6) 96%, transparent 100%)",
          }}
        />
        <div className="absolute inset-[1.5px] bg-white" />
      </div>

      {/* dot pattern background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* soft ambient washes */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-neutral-900/5 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-neutral-900/[0.04] blur-3xl"
      />

      {/* faint oversized backdrop word — hidden on phones where vertical room
          is tight and it would otherwise crowd the list rows. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-6 hidden select-none items-end justify-center sm:flex"
      >
        <span
          className="text-[18vw] font-extrabold leading-[0.85] tracking-tight text-transparent"
          style={{ WebkitTextStroke: "1px rgba(0,0,0,0.04)" }}
        >
          INDUSTRIES
        </span>
      </div>

      {/* The slide height is already the *visible* viewport (FullPageScroller
          measures `visualViewport.height`, not `100vh`), so the mobile bottom
          padding only needs a small breathing margin — anything larger
          re-introduces the empty band the client called out under the
          industry list. Desktop now uses `lg:pt-24` (was 10) so the heading
          sits visibly inset from the top edge instead of hugging it, and
          `lg:pb-6` (was 12) keeps pushing the description + list + pager
          row toward the bottom edge — together those nudge both the title
          *and* the description block down on desktop, which is exactly the
          micro-adjustment the client asked for. */}
      <div className="relative z-10 flex h-full flex-col p-6 pb-6 sm:p-10 md:p-14 lg:px-20 lg:pb-6 lg:pt-24">
        {/* Header — stays anchored at the top of the section. `flex-none`
            keeps the heading from being squeezed by the list below it on
            short viewports, so "Industries we serve." reads as a real
            page title rather than floating somewhere in the middle. */}
        <div data-reveal style={{ transitionDelay: "100ms" }} className="flex-none">
          <p className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-black/50">
            <span className="h-px w-8 bg-black/30" />
            Our reach
          </p>
          <h2 className="mt-5 text-4xl font-light leading-[1.05] tracking-tight text-black sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl">
            Industries we{" "}
            <AnimatedWord word={currentWord} phase={phase} />
            <span>.</span>
          </h2>
        </div>

        {/* Mobile-only: description card lives directly above the list so
            tapping a row reveals it without scrolling. Hidden at lg+ where
            the side-by-side DescriptionPanel takes over. */}
        <MobileDescriptionPanel industry={activeIndustry} />

        {/* Explicit flex-grow spacer. We previously relied on `mt-auto` on
            the next row to push the list to the bottom, but in practice
            the data-reveal margins + collapsed mobile description card
            interfered with the auto-margin and left the list floating
            mid-section. A dedicated `flex-1` div is much more reliable —
            it grows to consume *all* free vertical space, guaranteeing
            the content row docks against the bottom of the section. */}
        <div aria-hidden className="flex-1" />

        {/* Description (left) + list + nav (right). With the spacer above,
            this row is pinned to the bottom of the section on every
            breakpoint. The small `pt-*` keeps the visual gap between the
            heading and the list from collapsing on extremely short
            viewports where the spacer would otherwise shrink to zero. */}
        <div className="flex flex-col gap-6 pt-6 sm:gap-10 sm:pt-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:pt-16">
          <DescriptionPanel industry={activeIndustry} />

          <div className="w-full lg:w-[44rem]">
            {/* Three-slot industry list */}
            <div
              className={`transition-[opacity,transform,filter] duration-[900ms] ease-out ${
                exiting
                  ? "-translate-y-3 opacity-0 blur-[3px]"
                  : "translate-y-0 opacity-100 blur-none"
              }`}
            >
              {SLOT_PAIRS.map((pair, slotIdx) => {
                const industryIdx = pair[phase];
                const ind = industriesData[industryIdx];
                const number = industryIdx + 1;
                // Shimmer on outer slots only (1st and 3rd)
                const shimmer = slotIdx !== 1;
                const isActive = activeIdx === industryIdx;
                const isDimmed = activeIdx !== null && !isActive;
                return (
                  <IndustryRow
                    key={`${phase}-${slotIdx}`}
                    name={ind.name}
                    number={number}
                    delay={slotIdx * 260}
                    shimmer={shimmer}
                    isDimmed={isDimmed}
                    isSelected={selectedIdx === industryIdx}
                    onHoverChange={(h) =>
                      setHoveredIdx(h ? industryIdx : null)
                    }
                    onSelect={() => toggleSelection(industryIdx)}
                  />
                );
              })}
            </div>

            {/* Phase pagination + prev/next buttons */}
            <div
              data-reveal
              style={{ transitionDelay: "400ms" }}
              className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium text-black/70 sm:mt-10 sm:gap-4"
            >
              <NavButton
                direction="prev"
                onClick={() => changePhase(-1)}
                disabled={exiting}
              />

              <div className="flex items-center gap-4">
                <span className="tabular-nums">
                  {String(phase + 1).padStart(2, "0")}
                </span>
                <div className="flex gap-1.5">
                  {HEADING_WORDS.map((_, i) => (
                    <span
                      key={i}
                      className={`h-[3px] rounded-full transition-all duration-500 ${
                        phase === i ? "w-10 bg-black" : "w-5 bg-black/25"
                      }`}
                    />
                  ))}
                </div>
                <span className="tabular-nums text-black/40">
                  {String(HEADING_WORDS.length).padStart(2, "0")}
                </span>
              </div>

              <NavButton
                direction="next"
                onClick={() => changePhase(1)}
                disabled={exiting}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DescriptionPanel({
  industry,
}: {
  industry: IndustryData | null;
}) {
  return (
    // Aligns to the TOP of the bottom row (no `lg:mt-*` offset) so the
    // description card sits right under the heading at the same level as
    // the list — previously a 160px `lg:mt-40` pushed it into the middle
    // of the section and made the whole layout read as "centered".
    <div
      data-reveal
      style={{ transitionDelay: "260ms" }}
      className="hidden w-full max-w-md lg:block lg:max-w-sm"
    >
      <p className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-black/50">
        <span className="h-px w-8 bg-black/30" />
        {industry ? "In focus" : "Hover or tap a row"}
      </p>

      <div className="relative mt-5 min-h-[7.5rem]">
        {industry ? (
          <div key={industry.name} className="industries-desc-in">
            <h4 className="text-2xl font-light leading-tight tracking-tight text-black sm:text-3xl">
              {industry.name}
            </h4>
            <p className="mt-3 text-[15px] leading-relaxed text-black/65 sm:text-base">
              {industry.description}
            </p>
          </div>
        ) : (
          <p className="text-[15px] leading-relaxed text-black/45 sm:text-base">
            Hover or tap any industry on the right to see how we engage with
            that sector.
          </p>
        )}
      </div>
    </div>
  );
}

function AnimatedWord({ word, phase }: { word: string; phase: number }) {
  return (
    <span className="italic text-black/70">
      {word.split("").map((char, i) => (
        <span
          key={`${phase}-${i}`}
          className="inline-block"
          style={{
            animation: `ind-letter-in 1000ms ${140 + i * 65}ms ${EASE} both`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

function IndustryRow({
  name,
  number,
  delay,
  shimmer = false,
  isDimmed = false,
  isSelected = false,
  onHoverChange,
  onSelect,
}: {
  name: string;
  number: number;
  delay: number;
  shimmer?: boolean;
  isDimmed?: boolean;
  isSelected?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  onSelect?: () => void;
}) {
  // Rendered as a button so phones (no real hover) can tap to reveal the
  // description and keyboard users get focus / Enter / Space for free.
  return (
    <button
      type="button"
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onClick={() => onSelect?.()}
      aria-pressed={isSelected}
      aria-label={`${name} — show description`}
      className={`group relative flex w-full items-baseline gap-4 border-b py-3 text-left transition-[opacity,border-color] duration-500 ease-out focus:outline-none focus-visible:border-black/40 sm:gap-8 sm:py-5 lg:py-6 ${
        isDimmed
          ? "border-black/5 opacity-40"
          : "border-black/10 opacity-100 hover:border-black/30"
      }`}
    >
      <span
        className={`tabular-nums text-sm font-medium transition-colors duration-300 group-hover:text-black ${
          isSelected ? "text-black" : "text-black/40"
        }`}
        style={{
          animation: `ind-row-in 1000ms ${delay}ms ${EASE} both`,
        }}
      >
        {String(number).padStart(2, "0")}
      </span>
      <h3 className="flex flex-wrap text-3xl font-light leading-none tracking-tight text-black sm:text-5xl lg:text-6xl">
        {name.split("").map((char, i) => (
          <span
            key={i}
            className="inline-block"
            style={{
              animation: `ind-letter-in 1000ms ${delay + 180 + i * 55}ms ${EASE} both`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h3>

      {shimmer && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-px h-px overflow-hidden"
        >
          <span
            className="animate-row-shimmer absolute inset-y-0 left-0 w-1/3"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,0,0,0.55), transparent)",
            }}
          />
        </span>
      )}
    </button>
  );
}

/**
 * Mobile / tablet description card. Slides into the empty zone above the
 * list when an industry is tapped; collapses back to zero height (and
 * stops painting) when nothing is active. Hidden at lg+ since the
 * side-by-side `DescriptionPanel` handles that breakpoint.
 */
function MobileDescriptionPanel({
  industry,
}: {
  industry: IndustryData | null;
}) {
  return (
    <div
      aria-live="polite"
      className={`mt-6 grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-out lg:hidden ${
        industry
          ? "grid-rows-[1fr] opacity-100"
          : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="min-h-0">
        {industry && (
          <div key={industry.name} className="industries-desc-in">
            <p className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-black/50">
              <span className="h-px w-6 bg-black/30" />
              In focus
            </p>
            <h4 className="mt-3 text-2xl font-light leading-tight tracking-tight text-black sm:text-3xl">
              {industry.name}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-black/65 sm:text-[15px]">
              {industry.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function NavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}) {
  const label = direction === "prev" ? "Previous phase" : "Next phase";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="group/nav inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-black/60 transition-colors duration-300 hover:border-black/50 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
    >
      {direction === "prev" ? (
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover/nav:-translate-x-0.5" />
      ) : (
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/nav:translate-x-0.5" />
      )}
    </button>
  );
}

function ArrowLeft({ className = "" }: { className?: string }) {
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
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
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
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}
