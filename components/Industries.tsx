// Change these later as needed.
const industries = [
  "Finance",
  "Real Estate",
  "Software",
  "Banking",
  "Healthcare",
  "Logistics",
];

export default function Industries() {
  return (
    <section className="relative h-full w-full overflow-hidden bg-white">
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

      {/* faint oversized word in backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-6 flex items-end justify-center select-none"
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
            <span className="italic text-black/70">serve.</span>
          </h2>
        </div>

        {/* Grid of 6 industries */}
        <div className="mt-auto grid grid-cols-1 gap-x-12 sm:grid-cols-2 lg:gap-x-20">
          {industries.map((name, i) => (
            <IndustryItem
              key={name}
              name={name}
              number={i + 1}
              delay={220 + i * 80}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function IndustryItem({
  name,
  number,
  delay,
}: {
  name: string;
  number: number;
  delay: number;
}) {
  return (
    <div
      data-reveal
      style={{ transitionDelay: `${delay}ms` }}
      className="group relative flex items-baseline gap-5 border-b border-black/10 py-4 transition-colors duration-300 hover:border-black/40 sm:py-5 lg:py-6"
    >
      {/* hover accent line */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[-1px] left-0 h-[2px] w-0 bg-black transition-all duration-500 group-hover:w-full"
      />

      <span className="tabular-nums text-xs font-semibold text-black/40">
        {String(number).padStart(2, "0")}
      </span>

      <h3 className="text-3xl font-light tracking-tight text-black transition-transform duration-300 group-hover:translate-x-1 sm:text-4xl lg:text-5xl">
        {name}
      </h3>

      <span
        aria-hidden
        className="ml-auto -translate-x-2 text-black/40 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-black group-hover:opacity-100"
      >
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </div>
  );
}

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
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
