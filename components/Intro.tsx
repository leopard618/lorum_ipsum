import Link from "next/link";

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function Intro() {
  return (
    <section>
      <div className="relative w-full overflow-hidden">
        {/* mesh gradient */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 55% 45% at 22% 18%, rgba(125, 155, 185, 0.75) 0%, transparent 65%),
              radial-gradient(ellipse 35% 32% at 78% 22%, rgba(225, 180, 140, 0.45) 0%, transparent 60%),
              radial-gradient(circle at 62% 48%, rgba(255, 120, 90, 0.95) 0%, transparent 42%),
              radial-gradient(ellipse 85% 45% at 50% 82%, rgba(185, 30, 40, 0.95) 0%, transparent 62%),
              linear-gradient(to bottom, #2a2232 0%, #1a0f1a 55%, #0a0306 100%)
            `,
          }}
        />

        {/* grainy noise */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay"
          style={{
            backgroundImage: NOISE_SVG,
            backgroundSize: "220px 220px",
          }}
        />

        {/* subtle bottom vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent"
        />

        {/* content */}
        <div className="relative z-10 flex min-h-screen flex-col">
          {/* header */}
          <header className="flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14 lg:py-8">
            <Link
              href="#"
              className="text-base font-semibold tracking-[0.25em] text-white sm:text-lg"
            >
              LORUM IPSUM
            </Link>

            <nav className="hidden items-center gap-10 text-[11px] font-medium uppercase tracking-[0.25em] text-white/85 md:flex">
              <Link href="#" className="transition hover:text-white">
                Home
              </Link>
              <Link href="#" className="transition hover:text-white">
                Services
              </Link>
              <Link href="#" className="transition hover:text-white">
                Blog
              </Link>
              <Link href="#" className="transition hover:text-white">
                Contact Us
              </Link>
            </nav>

            <Link
              href="#"
              className="rounded-full border border-white/60 px-5 py-2 text-[11px] font-medium text-white transition hover:bg-white hover:text-black sm:text-xs"
            >
              Schedule call
            </Link>
          </header>

          {/* hairline */}
          <div className="mx-6 h-px bg-white/20 sm:mx-10 lg:mx-14" />

          {/* hero */}
          <div className="flex flex-1 flex-col justify-center px-6 pb-10 pt-20 sm:px-10 lg:px-14 lg:pb-16 lg:pt-28">
            <h1 className="max-w-4xl text-4xl font-light leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Effective way for your digital presence!
            </h1>

            <Link
              href="#"
              className="group mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/60 bg-white/5 px-5 py-2.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
            >
              Read More
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* discover more */}
          <div className="flex items-end justify-end px-6 pb-8 sm:px-10 lg:px-14 lg:pb-10">
            <Link
              href="#"
              className="group flex items-end gap-4 text-xs leading-snug text-white/75 transition hover:text-white"
            >
              <p className="text-right">
                Discover more about
                <br />
                our services
              </p>
              <ArrowDown className="h-4 w-4 flex-none transition-transform group-hover:translate-y-0.5" />
            </Link>
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
      strokeWidth={2}
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

function ArrowDown({ className = "" }: { className?: string }) {
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
      <path d="M12 5v14" />
      <path d="M19 12l-7 7-7-7" />
    </svg>
  );
}
