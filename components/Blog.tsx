"use client";

import Link from "next/link";
import { useState } from "react";

type BlogPost = {
  eyebrow: string;
  titleLineOne: string;
  titleLineTwo: string;
  description: string;
  byline: string;
  readTime: string;
  date: string;
};

const posts: BlogPost[] = [
  {
    eyebrow: "Featured · Culture × Tech",
    titleLineOne: "Tuning Into",
    titleLineTwo: "The Machine",
    description:
      "Headphones are the new heads-up display. We dig into how ambient AI, voice, and spatial audio are quietly rewriting the grammar of product design — and what it means for the interfaces we ship next.",
    byline: "By the Lorum Ipsum Studio",
    readTime: "8 min read",
    date: "Apr 2026",
  },
  {
    eyebrow: "Essay · Product",
    titleLineOne: "Designing For",
    titleLineTwo: "The Post-Screen Era",
    description:
      "Voice, gesture, and ambient interfaces are quietly rewiring how people meet software. A short field guide for designers shipping into a world where the screen is no longer the surface.",
    byline: "Mira Akhand · Design Lead",
    readTime: "6 min read",
    date: "Mar 2026",
  },
  {
    eyebrow: "Engineering · AI",
    titleLineOne: "When Code",
    titleLineTwo: "Starts Composing",
    description:
      "Generative models have moved from autocomplete to authorship. We share what changed in our workflow, our tooling, and our taste once AI became a real collaborator on the team.",
    byline: "Theo Park · Principal Engineer",
    readTime: "10 min read",
    date: "Mar 2026",
  },
  {
    eyebrow: "Field Notes · Edge",
    titleLineOne: "The Quiet",
    titleLineTwo: "Revolution Of Edge AI",
    description:
      "Smaller models, on-device inference, and the slow death of round-trips. How edge intelligence is reshaping latency, privacy, and the products we will buy next year.",
    byline: "Lina Vasquez · ML Strategist",
    readTime: "7 min read",
    date: "Feb 2026",
  },
  {
    eyebrow: "Opinion · Work",
    titleLineOne: "Slow Software",
    titleLineTwo: "For Fast Teams",
    description:
      "Speed of shipping is not the same as speed of thought. Why the tools that respect deep work will outlast the ones optimised for notifications and dashboards.",
    byline: "Kenji Ito · Staff Product Manager",
    readTime: "5 min read",
    date: "Feb 2026",
  },
];

/**
 * Hybrid visual strategy — three hand-picked photos that cycle via `idx %
 * visuals.length`. Blog posts can grow freely; the visuals keep looping.
 * To add the remaining two hero images, drop them into /public and swap
 * the filenames below. Until then all three slots point at the same file
 * so nothing 404s in development.
 */
const visuals: string[] = [
  "/blog.png",
  "/blog.png", // TODO: replace with /blog-2.png
  "/blog.png", // TODO: replace with /blog-3.png
];

const TRANSITION_MS = 480;

export default function Blog() {
  const [idx, setIdx] = useState(0);
  const [exiting, setExiting] = useState(false);

  const post = posts[idx];
  const activeVisual = idx % visuals.length;

  const changePost = (direction: 1 | -1) => {
    if (exiting) return;
    setExiting(true);
    window.setTimeout(() => {
      setIdx((current) => {
        const total = posts.length;
        return (current + direction + total) % total;
      });
      setExiting(false);
    }, TRANSITION_MS);
  };

  return (
    <section className="h-full w-full">
      <div className="relative h-full w-full overflow-hidden">
        {/* Layered background images — only the active one is opaque, the
            rest fade out. Gives a smooth crossfade when `idx` advances
            through a visual boundary without reloading any image. */}
        {visuals.map((src, i) => (
          <div
            key={`bg-${i}`}
            aria-hidden
            className="absolute inset-0 bg-cover bg-center transition-opacity ease-out"
            style={{
              backgroundImage: `url('${src}')`,
              opacity: i === activeVisual ? 1 : 0,
              transitionDuration: `${TRANSITION_MS * 2}ms`,
            }}
          />
        ))}

        {/* Left-to-right scrim so copy stays legible over the portrait */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent"
        />

        {/* Soft bottom vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
        />

        {/* Top-right section marker to match the rest of the site */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-8 top-8 hidden items-center gap-3 lg:flex"
        >
          <span className="h-px w-10 bg-white/25" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/50">
            Blog · {new Date().getFullYear()}
          </span>
        </div>

        {/* Bottom-right: Prev / Next post controls. Both wrap around, so
            clicking past either end cycles through the full post list. On
            phones we tighten the spacing and pull the cluster a touch in
            from the corner so it can't collide with the pagination pills. */}
        <div
          data-reveal
          style={{ transitionDelay: "900ms" }}
          className="absolute bottom-6 right-6 z-10 flex items-center gap-2 sm:bottom-12 sm:right-12 sm:gap-4 lg:bottom-16 lg:right-16"
        >
          <NavCircleButton
            direction="prev"
            onClick={() => changePost(-1)}
            disabled={exiting}
            label={`Show previous blog post (${idx + 1} of ${posts.length})`}
          />

          <span
            aria-hidden
            className="hidden h-px w-14 bg-white/35 sm:block"
          />
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.35em] text-white/70 sm:block">
            Next Blog
          </span>

          <NavCircleButton
            direction="next"
            onClick={() => changePost(1)}
            disabled={exiting}
            label={`Show next blog post (${idx + 1} of ${posts.length})`}
          />
        </div>

        {/* Content anchored bottom-left — editorial "poster" layout. We keep
            the bottom padding generous on phones so the copy clears the
            Prev/Next nav cluster sitting at the lower-right corner. */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 pb-24 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            {/* Per-click swap container: slides out, post index changes
                while invisible, then slides back in with the new copy. */}
            <div
              className="transition-[opacity,transform,filter] ease-out"
              style={{
                transitionDuration: `${TRANSITION_MS}ms`,
                opacity: exiting ? 0 : 1,
                transform: exiting ? "translateX(-12px)" : "translateX(0)",
                filter: exiting ? "blur(3px)" : "blur(0)",
              }}
            >
              <div
                data-reveal
                style={{ transitionDelay: "80ms" }}
                className="inline-flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70"
              >
                <span className="tabular-nums text-white/85">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-10 bg-white/30" />
                <span>{post.eyebrow}</span>
              </div>

              <h2
                data-reveal
                style={{ transitionDelay: "220ms" }}
                className="mt-5 text-[2.5rem] font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:mt-6 sm:text-6xl lg:text-7xl"
              >
                {post.titleLineOne} <br className="hidden sm:block" />
                {post.titleLineTwo}
              </h2>

              <div
                aria-hidden
                data-reveal
                style={{ transitionDelay: "360ms" }}
                className="mt-6 h-[2px] w-24 bg-gradient-to-r from-red-400 via-white/70 to-transparent"
              />

              <p
                data-reveal
                style={{ transitionDelay: "500ms" }}
                className="mt-5 max-w-lg text-sm leading-relaxed text-white/75 sm:mt-6 sm:text-[15px]"
              >
                {post.description}
              </p>

              <div
                data-reveal
                style={{ transitionDelay: "620ms" }}
                className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white/55 sm:mt-6 sm:gap-x-5 sm:text-[11px] sm:tracking-[0.25em]"
              >
                <span>{post.byline}</span>
                <span className="h-1 w-1 rounded-full bg-white/40" />
                <span>{post.readTime}</span>
                <span className="h-1 w-1 rounded-full bg-white/40" />
                <span>{post.date}</span>
              </div>

              <div
                data-reveal
                style={{ transitionDelay: "780ms" }}
                className="mt-7 sm:mt-10"
              >
                <Link
                  href="#"
                  className="group relative inline-flex w-fit items-center gap-3 overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(255,255,255,0.22)]"
                >
                  <span className="relative">Read More</span>
                  <span className="relative grid h-3.5 w-3.5 place-items-center overflow-hidden">
                    <ArrowUpRight className="absolute h-3 w-3 transition-transform duration-300 ease-out group-hover:-translate-y-4 group-hover:translate-x-4" />
                    <ArrowUpRight className="absolute h-3 w-3 -translate-x-4 translate-y-4 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Pagination pills — which post you're on within the rotation. */}
            <div
              data-reveal
              style={{ transitionDelay: "1020ms" }}
              className="mt-7 flex items-center gap-1.5 sm:mt-10 sm:gap-2"
              aria-hidden
            >
              {posts.map((_, i) => (
                <span
                  key={i}
                  className={`h-[3px] rounded-full transition-all duration-500 ${
                    i === idx ? "w-6 bg-white sm:w-8" : "w-2.5 bg-white/30 sm:w-3"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NavCircleButton({
  direction,
  onClick,
  disabled,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  const Icon = direction === "next" ? ArrowRight : ArrowLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="group relative grid h-12 w-12 flex-none place-items-center rounded-full border border-white/50 text-white transition-[transform,background-color,border-color,color,opacity] duration-300 hover:scale-110 hover:border-white hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:text-white sm:h-14 sm:w-14"
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full border border-white/30 opacity-0 transition-opacity duration-300 group-hover:animate-ping group-hover:opacity-60 group-disabled:hidden"
      />
      <Icon
        className={`h-4 w-4 transition-transform duration-300 ease-out ${
          direction === "next"
            ? "group-hover:translate-x-0.5"
            : "group-hover:-translate-x-0.5"
        }`}
      />
    </button>
  );
}

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
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
      <path d="M11 5l-7 7 7 7" />
    </svg>
  );
}
