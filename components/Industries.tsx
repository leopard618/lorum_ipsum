"use client";

import { useEffect, useState } from "react";

// Six industries — the first three are shown initially, then animate to the next three.
const industries = [
  "Finance",
  "Real Estate",
  "Software",
  "Banking",
  "Healthcare",
  "Logistics",
];

// Each of the 3 slots cycles between two industries: phase 0 shows [0,2,4], phase 1 shows [1,3,5].
const SLOT_PAIRS: Array<[number, number]> = [
  [0, 3],
  [1, 4],
  [2, 5],
];

// The heading's variable word cycles alongside the list.
const HEADING_WORDS = ["serve", "are into"];

const CYCLE_MS = 6000;
const EXIT_MS = 550;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function Industries() {
  const [phase, setPhase] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setExiting(true);
      window.setTimeout(() => {
        setPhase((p) => (p + 1) % 2);
        setExiting(false);
      }, EXIT_MS);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const currentWord = HEADING_WORDS[phase];

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

        {/* Three-slot industry list */}
        <div
          className={`mt-auto transition-all duration-500 ease-out ${
            exiting
              ? "-translate-y-3 opacity-0 blur-[3px]"
              : "translate-y-0 opacity-100 blur-none"
          }`}
        >
          {SLOT_PAIRS.map((pair, slotIdx) => {
            const industryIdx = pair[phase];
            const name = industries[industryIdx];
            const number = industryIdx + 1;
            // Shimmer on outer slots only (1st and 3rd)
            const shimmer = slotIdx !== 1;
            return (
              <IndustryRow
                key={`${phase}-${slotIdx}`}
                name={name}
                number={number}
                delay={slotIdx * 180}
                shimmer={shimmer}
              />
            );
          })}
        </div>

        {/* Phase pagination */}
        <div
          data-reveal
          style={{ transitionDelay: "400ms" }}
          className="mt-10 flex items-center gap-4 text-xs font-medium text-black/70"
        >
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
      </div>
    </section>
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
            animation: `ind-letter-in 700ms ${100 + i * 45}ms ${EASE} both`,
          }}
        >
          {char === " " ? " " : char}
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
}: {
  name: string;
  number: number;
  delay: number;
  shimmer?: boolean;
}) {
  return (
    <div className="relative flex items-baseline gap-6 border-b border-black/10 py-4 sm:gap-8 sm:py-5 lg:py-6">
      <span
        className="tabular-nums text-sm font-medium text-black/40"
        style={{
          animation: `ind-row-in 700ms ${delay}ms ${EASE} both`,
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
              animation: `ind-letter-in 700ms ${delay + 120 + i * 35}ms ${EASE} both`,
            }}
          >
            {char === " " ? " " : char}
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
