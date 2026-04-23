import Link from "next/link";

export type Service = {
  eyebrow?: string;
  title: string;
  description: string;
  cta: string;
  image: string;
  background: string;
};

export const services: Service[] = [
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

export default function ServicePanel({ service }: { service: Service }) {
  return (
    <div
      className="relative flex h-full w-full items-center overflow-hidden"
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

      {/* left-edge fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/10 to-transparent md:from-black/40 md:via-transparent"
      />

      {/* content */}
      <div className="relative z-10 max-w-xl px-8 sm:px-14 lg:px-20">
        {service.eyebrow && (
          <p
            data-reveal
            style={{ transitionDelay: "100ms" }}
            className="mb-5 text-sm text-white/70"
          >
            {service.eyebrow}
          </p>
        )}
        <h2
          data-reveal
          style={{ transitionDelay: "250ms" }}
          className="text-5xl font-light leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          {service.title}
        </h2>
        <p
          data-reveal
          style={{ transitionDelay: "450ms" }}
          className="mt-6 max-w-md text-sm leading-relaxed text-white/65"
        >
          {service.description}
        </p>
        <div data-reveal style={{ transitionDelay: "650ms" }} className="mt-10">
          <Link
            href="#"
            className="group relative inline-flex w-fit items-center gap-3 overflow-hidden rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black shadow-[0_6px_20px_rgba(0,0,0,0.3)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(255,255,255,0.18)]"
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
