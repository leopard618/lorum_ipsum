"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Service = {
  eyebrow?: string;
  title: string;
  description: string;
  cta: string;
  image: string;
  background: string;
};

const services: Service[] = [
  {
    title: "Blockchain Experts",
    description:
      "Transform your operations with next-generation blockchain architecture. From smart contracts to customized dApps, we build scalable decentralized ecosystems that fuel efficiency and turn your visionary ideas into secure, high-performance digital reality.",
    cta: "Learn More",
    image: "/service-blockchain.png",
    background: `
      radial-gradient(ellipse 70% 60% at 78% 50%, rgba(90, 30, 130, 0.55), transparent 60%),
      radial-gradient(ellipse 45% 45% at 85% 30%, rgba(40, 40, 180, 0.35), transparent 55%),
      linear-gradient(to bottom right, #050008, #000000)
    `,
  },
  {
    eyebrow: "Your fastest path to production with A.I Automations",
    title: "A.I Automations",
    description:
      "Data-driven digital marketing strategies that boost your ROI and accelerate business growth.",
    cta: "View More",
    image: "/service-ai.png",
    background: `
      radial-gradient(ellipse 65% 55% at 78% 50%, rgba(130, 45, 190, 0.5), transparent 60%),
      linear-gradient(to bottom, #170624, #060010)
    `,
  },
  {
    title: "The Reality Warp",
    description:
      "At our platform, we specialize in building powerful, scalable, and user-friendly digital solutions tailored to modern business needs.",
    cta: "Learn More",
    image: "/service-vr.png",
    background: `
      radial-gradient(ellipse 80% 70% at 72% 55%, rgba(135, 35, 165, 0.5), transparent 55%),
      radial-gradient(ellipse 45% 45% at 60% 80%, rgba(230, 45, 120, 0.22), transparent 60%),
      linear-gradient(to bottom, #1a0826, #0a0310)
    `,
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = Math.max(0, -rect.top);
      setProgress(Math.min(1, scrolled / scrollable));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isMobile]);

  const count = services.length;

  if (isMobile) {
    return (
      <section className="bg-black">
        {services.map((s, i) => (
          <div key={i} className="min-h-screen">
            <Panel service={s} />
          </div>
        ))}
      </section>
    );
  }

  const tx = progress * (count - 1) * 100;
  const activeIndex = Math.min(count - 1, Math.round(progress * (count - 1)));

  return (
    <section
      ref={sectionRef}
      style={{ height: `${count * 100}vh` }}
      className="relative bg-black"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          className="flex h-full"
          style={{
            width: `${count * 100}vw`,
            transform: `translate3d(-${tx}vw, 0, 0)`,
            willChange: "transform",
          }}
        >
          {services.map((s, i) => (
            <Panel key={i} service={s} />
          ))}
        </div>

        {/* progress indicator */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4 text-xs font-medium text-white/70 sm:bottom-10">
          <span className="tabular-nums">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1.5">
            {services.map((_, i) => (
              <span
                key={i}
                className={`h-[3px] rounded-full transition-all duration-500 ${
                  i === activeIndex ? "w-12 bg-white" : "w-5 bg-white/25"
                }`}
              />
            ))}
          </div>
          <span className="tabular-nums text-white/40">
            {String(count).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}

function Panel({ service }: { service: Service }) {
  return (
    <div
      className="relative flex h-full w-full flex-none items-center overflow-hidden md:w-screen"
      style={{ background: service.background }}
    >
      {/* hero visual */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-full md:w-[62%]"
        style={{
          backgroundImage: `url('${service.image}')`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right bottom",
          backgroundSize: "contain",
        }}
      />

      {/* left-edge fade for legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/10 to-transparent md:from-black/40 md:via-transparent"
      />

      {/* content */}
      <div className="relative z-10 max-w-xl px-8 sm:px-14 lg:px-20">
        {service.eyebrow && (
          <p className="mb-5 text-sm text-white/70">{service.eyebrow}</p>
        )}
        <h2 className="text-5xl font-light leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          {service.title}
        </h2>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-white/65">
          {service.description}
        </p>
        <Link
          href="#"
          className="group relative mt-10 inline-flex w-fit items-center gap-3 overflow-hidden rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black shadow-[0_6px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(255,255,255,0.18)]"
        >
          <span className="relative">{service.cta}</span>
          <span className="relative grid h-3.5 w-3.5 place-items-center overflow-hidden">
            <ArrowUpRight className="absolute h-3 w-3 transition-transform duration-300 ease-out group-hover:-translate-y-4 group-hover:translate-x-4" />
            <ArrowUpRight className="absolute h-3 w-3 -translate-x-4 translate-y-4 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
          </span>
        </Link>
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
