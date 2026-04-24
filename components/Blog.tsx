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
];

const TRANSITION_MS = 480;

export default function Blog() {
  const [idx, setIdx] = useState(0);
  const [exiting, setExiting] = useState(false);

  const post = posts[idx];

  const goToNextPost = () => {
    if (exiting) return;
    setExiting(true);
    window.setTimeout(() => {
      setIdx((current) => (current + 1) % posts.length);
      setExiting(false);
    }, TRANSITION_MS);
  };

  return (
    <section className="h-full w-full">
      <div className="relative h-full w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/blog.png')" }}
        />

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

        {/* Bottom-right: "Next Blog" cycle CTA. Click advances `idx` (with
            wrap-around) so the post body slides out, swaps content, and
            slides back in. */}
        <div
          data-reveal
          style={{ transitionDelay: "900ms" }}
          className="absolute bottom-8 right-8 z-10 flex items-center gap-4 sm:bottom-12 sm:right-12 lg:bottom-16 lg:right-16"
        >
          <span
            aria-hidden
            className="hidden h-px w-14 bg-white/35 sm:block"
          />
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.35em] text-white/70 sm:block">
            Next Blog
          </span>
          <button
            type="button"
            onClick={goToNextPost}
            disabled={exiting}
            aria-label={`Show next blog post (${idx + 1} of ${posts.length})`}
            className="group relative grid h-14 w-14 flex-none place-items-center rounded-full border border-white/50 text-white transition-[transform,background-color,border-color,color,opacity] duration-300 hover:scale-110 hover:border-white hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:text-white"
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border border-white/30 opacity-0 transition-opacity duration-300 group-hover:animate-ping group-hover:opacity-60 group-disabled:hidden"
            />
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Content anchored bottom-left — editorial "poster" layout */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            {/* Inner wrapper handles the per-click swap animation: it slides
                out, the post index changes mid-transition, then slides back
                in with the new copy. Keep this wrapper outside the
                data-reveal'd elements so the slide-stagger only plays on
                first slide entry, not every click. */}
            <div
              className={`transition-[opacity,transform,filter] ease-out`}
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
                className="mt-6 text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl"
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
                className="mt-6 max-w-lg text-[15px] leading-relaxed text-white/75"
              >
                {post.description}
              </p>

              <div
                data-reveal
                style={{ transitionDelay: "620ms" }}
                className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-medium uppercase tracking-[0.25em] text-white/55"
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
                className="mt-10"
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

            {/* Pagination dots — visible cue that there are multiple posts
                and where you are in the rotation. */}
            <div
              data-reveal
              style={{ transitionDelay: "1020ms" }}
              className="mt-10 flex items-center gap-2"
              aria-hidden
            >
              {posts.map((_, i) => (
                <span
                  key={i}
                  className={`h-[3px] rounded-full transition-all duration-500 ${
                    i === idx ? "w-8 bg-white" : "w-3 bg-white/30"
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
