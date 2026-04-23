"use client";

import { useEffect, useState } from "react";

const headlines = [
  "Effective way for your digital presence!",
  "Build software that moves at your speed.",
  "Turning bold ideas into shipped products.",
];

const CYCLE_MS = 7000;
const WORD_STAGGER_MS = 90;
const ENTER_BASE_DELAY_MS = 450;
const EXIT_STAGGER_MS = 45;
const DURATION_MS = 1100;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

type LineState = "active" | "leaving" | "waiting";

export default function AnimatedHeadline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % headlines.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const prev = (index - 1 + headlines.length) % headlines.length;

  return (
    <h1 className="grid max-w-4xl text-4xl font-light leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
      {headlines.map((text, i) => {
        const state: LineState =
          i === index ? "active" : i === prev ? "leaving" : "waiting";

        return <HeadlineLine key={i} text={text} state={state} />;
      })}
    </h1>
  );
}

function HeadlineLine({ text, state }: { text: string; state: LineState }) {
  const words = text.split(" ");

  return (
    <div
      aria-hidden={state !== "active"}
      className="col-start-1 row-start-1"
    >
      {words.map((word, w) => {
        const delay =
          state === "active"
            ? ENTER_BASE_DELAY_MS + w * WORD_STAGGER_MS
            : state === "leaving"
              ? w * EXIT_STAGGER_MS
              : 0;

        const pose =
          state === "active"
            ? "translate-y-0 opacity-100 blur-none"
            : state === "leaving"
              ? "-translate-y-3 opacity-0 blur-[4px]"
              : "translate-y-6 opacity-0 blur-[4px]";

        return (
          <span
            key={w}
            className={`mr-[0.28em] inline-block transition-all ${pose}`}
            style={{
              transitionDuration: `${DURATION_MS}ms`,
              transitionTimingFunction: EASE,
              transitionDelay: `${delay}ms`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}
