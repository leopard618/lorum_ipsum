import Link from "next/link";
import type { ReactNode } from "react";

import AIChipAnimated from "./AIChipAnimated";

export type Service = {
  eyebrow?: string;
  title: string;
  description: string;
  cta: string;
  image: string;
  imageAlign?: "center" | "bottom";
  imageWidth?: string;
  /**
   * Optional override for the image width/background-size on phones.
   * Lets us scale a hero photo up on small screens (where it competes
   * with the headline) without changing the desktop composition.
   */
  mobileImageWidth?: string;
  imageOffsetRight?: string;
  floatVariant?: "normal" | "subtle";
  background: string;
  accent: string;
  /**
   * Optional custom media. When provided, renders in place of the static
   * background image (used for A.I Automations to show an animated SVG chip).
   */
  renderMedia?: () => ReactNode;
};

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export const services: Service[] = [
  {
    title: "Blockchain Experts",
    // Non-breaking hyphens (\u2011) keep compound technical terms like
    // "next-generation" and "high-performance" together so the wrap engine
    // can't split them across lines mid-word.
    description:
      "Future-proof your business with next\u2011generation blockchain architecture. From smart contracts to customized dApps, we build scalable decentralized ecosystems that fuel efficiency and turn your visionary ideas into secure, high\u2011performance digital reality.",
    cta: "Learn More",
    image: "/service-blockchain.png",
    background: "linear-gradient(135deg, #030512 0%, #000000 70%)",
    accent: "rgba(70, 120, 230, 0.38)",
  },
  {
    title: "A.I Automations",
    description:
      "Data-driven digital marketing strategies that boost your ROI and accelerate business growth.",
    cta: "View More",
    image: "/service-ai.png",
    imageWidth: "38%",
    imageOffsetRight: "5%",
    floatVariant: "subtle",
    // Violet theme anchored on #8B5CF6 (Tailwind violet-500).
    background: "linear-gradient(135deg, #1A0A30 0%, #000000 70%)",
    accent: "rgba(139, 92, 246, 0.4)",
    renderMedia: () => <AIChipAnimated />,
  },
  {
    title: "The Reality Warp",
    description:
      "At our platform, we specialize in building powerful, scalable, and user-friendly digital solutions tailored to modern business needs.",
    cta: "Learn More",
    image: "/service-vr.png",
    imageAlign: "bottom",
    imageWidth: "60%",
    // On phones the hero composition has more vertical room to give the
    // photo, and the headline takes the full top half on its own — so we
    // scale the VR portrait up to read as a true hero, not a corner accent.
    mobileImageWidth: "94%",
    floatVariant: "subtle",
    background: "linear-gradient(135deg, #180625 0%, #05000d 70%)",
    accent: "rgba(215, 85, 170, 0.35)",
  },
];

export default function ServicePanel({
  service,
  index = 1,
  total = 3,
}: {
  service: Service;
  index?: number;
  total?: number;
}) {
  const isBottomAligned = service.imageAlign === "bottom";
  const floatClass =
    service.floatVariant === "subtle"
      ? "animate-service-float-subtle"
      : "animate-service-float";

  const imageContainerClasses = isBottomAligned
    ? "pointer-events-none absolute inset-0"
    : "pointer-events-none absolute inset-y-0 right-0 w-full md:w-[50%]";

  const imagePosition = isBottomAligned ? "bottom right" : "center";

  return (
    <div
      className="relative flex h-full w-full items-center overflow-hidden"
      style={{ background: service.background }}
    >
      {/* Ambient glow — centered at 75% across, behind the image */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[75%] top-1/2 h-[72vh] w-[72vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
        style={{ background: service.accent }}
      />

      {/* Image / media — centered inside the right half (or anchored bottom-right for VR).
          If the service supplies renderMedia, we render that node instead of the static PNG
          so it can run its own animations (see AIChipAnimated). */}
      {service.renderMedia ? (
        // On phones the chip floats centered as a hero accent (the dark gradient
        // on top keeps the headline readable). From md+ we restore the
        // data-driven, right-anchored placement using the service's
        // imageWidth / imageOffsetRight (passed as CSS vars so Tailwind's
        // arbitrary values can resolve them at responsive breakpoints).
        <div
          aria-hidden
          className={`${floatClass} pointer-events-none absolute inset-y-0 left-1/2 flex w-[62%] max-w-[180px] -translate-x-1/2 items-center justify-center md:left-auto md:right-[var(--media-right,0%)] md:w-[50%] md:max-w-[var(--media-w,100%)] md:translate-x-0`}
          style={{
            ...(service.imageWidth && !isBottomAligned
              ? { ["--media-w" as string]: service.imageWidth }
              : {}),
            ...(service.imageOffsetRight && !isBottomAligned
              ? { ["--media-right" as string]: service.imageOffsetRight }
              : {}),
          }}
        >
          {service.renderMedia()}
        </div>
      ) : (
        // Bottom-aligned hero photos can opt into a responsive background-
        // size by supplying both `imageWidth` and `mobileImageWidth`. The
        // values flow in as CSS vars so Tailwind's arbitrary-length classes
        // can pick the right one per breakpoint without a JS resize watcher.
        <div
          aria-hidden
          className={`${imageContainerClasses} ${floatClass} ${
            isBottomAligned && service.imageWidth
              ? "bg-[length:var(--bg-w-mobile,60%)] md:bg-[length:var(--bg-w-desktop,60%)]"
              : ""
          }`}
          style={{
            backgroundImage: `url('${service.image}')`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: imagePosition,
            ...(!(isBottomAligned && service.imageWidth)
              ? { backgroundSize: "contain" }
              : {}),
            ...(service.imageWidth && !isBottomAligned
              ? { maxWidth: service.imageWidth }
              : {}),
            ...(service.imageWidth && isBottomAligned
              ? {
                  ["--bg-w-mobile" as string]:
                    service.mobileImageWidth ?? service.imageWidth,
                  ["--bg-w-desktop" as string]: service.imageWidth,
                }
              : {}),
            ...(service.imageOffsetRight && !isBottomAligned
              ? { right: service.imageOffsetRight }
              : {}),
          }}
        />
      )}

      {/* Left dark gradient for text legibility. On phones the image fills
          the panel, so we run an opaque-to-transparent black wash across the
          full width to keep the headline + CTA readable. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black via-black/85 to-black/30 md:w-[60%] md:via-black/35 md:to-transparent"
      />

      {/* Soft vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/45"
      />

      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: NOISE_SVG,
          backgroundSize: "220px 220px",
        }}
      />

      {/* Vertical SERVICES rail — left edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-7 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-5 lg:flex"
      >
        <span className="h-20 w-px bg-white/20" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/45 [writing-mode:vertical-rl]">
          Services
        </span>
        <span className="h-20 w-px bg-white/20" />
      </div>

      {/* Top-left corner marker. Lives on the left so the global menu
          trigger (top-right) has clear space and never overlaps the year
          tag. The hairline trails outward to the right for visual balance. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-8 top-8 hidden items-center gap-3 lg:flex"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/50">
          LI · {new Date().getFullYear()}
        </span>
        <span className="h-px w-10 bg-white/25" />
      </div>

      {/* Bottom-left: pulsing accent + counter */}
      <div className="pointer-events-none absolute bottom-8 left-24 hidden items-center gap-3 lg:flex">
        <span className="relative flex h-1.5 w-1.5">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-80"
            style={{ background: service.accent }}
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ background: service.accent }}
          />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/55">
          {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* Bottom hairline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      {/* Content — left-aligned. Widened from max-w-xl/lg:px-28 so the
          description paragraph below has room to span longer line lengths
          rather than wrapping into a tall narrow block. */}
      <div className="relative z-10 w-full max-w-2xl px-8 sm:px-14 lg:px-20">
        <div data-reveal style={{ transitionDelay: "80ms" }}>
          <div className="inline-flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">
            <span className="tabular-nums text-white/85">
              {String(index).padStart(2, "0")}
            </span>
            <span className="h-px w-10 bg-white/30" />
            <span>Service</span>
          </div>
        </div>

        {service.eyebrow && (
          <p
            data-reveal
            style={{ transitionDelay: "220ms" }}
            className="mt-8 text-sm font-medium text-white/75"
          >
            {service.eyebrow}
          </p>
        )}

        <h2
          data-reveal
          style={{ transitionDelay: "360ms" }}
          className="mt-6 whitespace-normal break-words text-4xl font-light leading-[1.05] tracking-tight text-white sm:text-5xl md:whitespace-nowrap md:text-6xl lg:text-7xl"
        >
          {service.title}
        </h2>

        <div
          aria-hidden
          data-reveal
          style={{
            transitionDelay: "520ms",
            background: service.accent,
          }}
          className="mt-6 h-[2px] w-24"
        />

        <p
          data-reveal
          style={{ transitionDelay: "660ms" }}
          className="mt-7 max-w-xl text-[15px] leading-relaxed text-white/65 sm:max-w-2xl"
        >
          {service.description}
        </p>

        <div
          data-reveal
          style={{ transitionDelay: "820ms" }}
          className="mt-10"
        >
          <Link
            href="#"
            className="group relative inline-flex w-fit items-center gap-3 overflow-hidden rounded-full bg-white px-6 py-3 text-xs font-semibold text-black shadow-[0_6px_24px_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(255,255,255,0.22)]"
          >
            <span className="relative">{service.cta}</span>
            <span className="relative grid h-3.5 w-3.5 place-items-center overflow-hidden">
              <ArrowUpRight className="absolute h-3 w-3 transition-transform duration-300 ease-out group-hover:-translate-y-4 group-hover:translate-x-4" />
              <ArrowUpRight className="absolute h-3 w-3 -translate-x-4 translate-y-4 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
            </span>
          </Link>
        </div>
      </div>
    </div>
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

