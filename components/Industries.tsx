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
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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
  }, [phase]);

  const currentWord = HEADING_WORDS[phase];
  const hoveredIndustry =
    hoveredIdx !== null ? industriesData[hoveredIdx] : null;

  return (
    <section className="relative h-full w-full overflow-hidden bg-white">
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

      {/* faint oversized backdrop word */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-6 flex select-none items-end justify-center"
      >
        <span
          className="text-[18vw] font-extrabold leading-[0.85] tracking-tight text-transparent"
          style={{ WebkitTextStroke: "1px rgba(0,0,0,0.04)" }}
        >
          INDUSTRIES
        </span>
      </div>

      <div className="relative z-10 flex h-full flex-col p-10 sm:p-14 lg:p-20">
        {/* Header */}
        <div data-reveal style={{ transitionDelay: "100ms" }}>
          <p className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-black/50">
            <span className="h-px w-8 bg-black/30" />
            Our reach
          </p>
          <h2 className="mt-6 text-5xl font-light leading-[1.05] tracking-tight text-black sm:text-6xl lg:text-7xl">
            Industries we{" "}
            <AnimatedWord word={currentWord} phase={phase} />
            <span>.</span>
          </h2>
        </div>

        {/* Bottom area: description (left) + list + nav (right) */}
        <div className="mt-auto flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <DescriptionPanel industry={hoveredIndustry} />

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
                const isHovered = hoveredIdx === industryIdx;
                const isDimmed = hoveredIdx !== null && !isHovered;
                return (
                  <IndustryRow
                    key={`${phase}-${slotIdx}`}
                    name={ind.name}
                    number={number}
                    delay={slotIdx * 260}
                    shimmer={shimmer}
                    isDimmed={isDimmed}
                    onHoverChange={(h) =>
                      setHoveredIdx(h ? industryIdx : null)
                    }
                  />
                );
              })}
            </div>

            {/* Phase pagination + prev/next buttons */}
            <div
              data-reveal
              style={{ transitionDelay: "400ms" }}
              className="mt-10 flex items-center gap-4 text-xs font-medium text-black/70"
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
    <div
      data-reveal
      style={{ transitionDelay: "260ms" }}
      className="hidden w-full max-w-md lg:block lg:mt-10 lg:max-w-sm"
    >
      <p className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-black/50">
        <span className="h-px w-8 bg-black/30" />
        {industry ? "In focus" : "Hover a row"}
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
            Hover any industry on the right to see how we engage with that
            sector.
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
  onHoverChange,
}: {
  name: string;
  number: number;
  delay: number;
  shimmer?: boolean;
  isDimmed?: boolean;
  onHoverChange?: (hovered: boolean) => void;
}) {
  return (
    <div
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      className={`group relative flex items-baseline gap-6 border-b py-4 transition-[opacity,border-color] duration-500 ease-out sm:gap-8 sm:py-5 lg:py-6 ${
        isDimmed
          ? "border-black/5 opacity-40"
          : "border-black/10 opacity-100 hover:border-black/30"
      }`}
    >
      <span
        className="tabular-nums text-sm font-medium text-black/40 transition-colors duration-300 group-hover:text-black"
        style={{
          animation: `ind-row-in 1000ms ${delay}ms ${EASE} both`,
        }}
      >
        {String(number).padStart(2, "0")}
      </span>
      <h3 className="flex flex-wrap text-4xl font-light leading-none tracking-tight text-black sm:text-5xl lg:text-6xl">
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
