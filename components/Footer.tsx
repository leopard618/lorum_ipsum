"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-neutral-950 text-white">
      {/* top accent line */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent"
      />

      {/* ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/4 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-0 h-[32rem] w-[32rem] rounded-full bg-red-500/15 blur-[140px]"
      />

      {/* dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* scroll to top */}
      <ScrollTopButton />

      <div className="relative z-[1] mx-auto max-w-7xl px-8 pt-20 sm:px-12 lg:px-16 lg:pt-24">
        {/* top grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Newsletter */}
          <div className="lg:col-span-5">
            <h3 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Subscribe to our{" "}
              <span className="bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                newsletter.
              </span>
            </h3>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="group relative mt-7 flex w-full max-w-md items-center gap-3 border-b border-white/20 py-3 transition focus-within:border-white"
            >
              <input
                type="email"
                required
                placeholder="you@company.com"
                className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex-none text-white/70 transition hover:text-red-400"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Link columns */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 lg:col-span-4 lg:grid-cols-2"
          >
            <FooterColumn
              title="Quick Links"
              links={[
                { label: "Home", href: "#" },
                { label: "Services", href: "#" },
                { label: "Blogs", href: "#" },
                { label: "Contact Us", href: "#" },
              ]}
            />
            <FooterColumn
              title="Policies"
              links={[
                { label: "Privacy Policy", href: "#" },
                { label: "Terms and Conditions", href: "#" },
              ]}
            />
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <ul className="space-y-4 text-sm text-white/75">
              <li className="flex items-center gap-3">
                <PhoneIcon className="h-4 w-4 flex-none text-white/60" />
                <a href="tel:+1000000000" className="hover:text-white">
                  +1 000 000000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon className="h-4 w-4 flex-none text-white/60" />
                <a
                  href="mailto:email@address.here"
                  className="hover:text-white"
                >
                  email@address.here
                </a>
              </li>
              <li className="flex items-center gap-3">
                <PinIcon className="h-4 w-4 flex-none text-white/60" />
                <span>Address Here</span>
              </li>
            </ul>
          </div>
        </div>

        {/* giant logo */}
        <div className="mt-16 border-t border-white/10 pt-10 sm:mt-20 sm:pt-14">
          <div className="group relative">
            <div
              className="select-none text-[14vw] font-extrabold leading-[0.85] tracking-tight text-transparent sm:text-[10vw] lg:text-[7vw]"
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}
            >
              LORUM IPSUM
            </div>
            <div
              aria-hidden
              className="animate-glow-pan pointer-events-none absolute inset-0 select-none bg-gradient-to-r from-red-500 via-fuchsia-400 to-cyan-400 bg-clip-text text-[14vw] font-extrabold leading-[0.85] tracking-tight text-transparent opacity-0 transition duration-700 group-hover:opacity-100 sm:text-[10vw] lg:text-[7vw]"
            >
              LORUM IPSUM
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-[1] mx-auto mt-10 flex max-w-7xl flex-col items-center gap-6 border-t border-white/10 px-8 py-8 sm:flex-row sm:justify-between sm:px-12 lg:px-16">
        <div className="flex items-center gap-3">
          <SocialLink href="#" label="X">
            <XIcon className="h-3.5 w-3.5" />
          </SocialLink>
          <SocialLink href="#" label="Instagram">
            <InstagramIcon className="h-4 w-4" />
          </SocialLink>
          <SocialLink href="#" label="YouTube">
            <YouTubeIcon className="h-4 w-4" />
          </SocialLink>
          <SocialLink href="#" label="LinkedIn">
            <LinkedInIcon className="h-4 w-4" />
          </SocialLink>
        </div>

        <p className="text-xs text-white/50">
          © <span className="text-white/70">2026</span> Lorum Ipsum. All rights
          reserved.
        </p>

        <div className="hidden sm:block sm:w-12" aria-hidden />
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5 text-sm text-white/75">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-2 transition hover:text-white"
            >
              <span className="inline-flex -translate-x-2 items-center opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                <ArrowRight className="h-3 w-3 text-red-400" />
              </span>
              <span className="-ml-5 transition-all duration-300 group-hover:ml-0">
                {link.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.03] text-white/70 transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white hover:text-black"
    >
      {children}
    </Link>
  );
}

function ScrollTopButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      aria-label="Scroll to top"
      className="group absolute right-6 top-6 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/[0.03] text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-white hover:text-black sm:right-10 sm:top-10"
    >
      <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
    </button>
  );
}

/* icons */
function ArrowRight({ className = "" }: { className?: string }) {
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
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

function ArrowUp({ className = "" }: { className?: string }) {
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
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </svg>
  );
}

function PhoneIcon({ className = "" }: { className?: string }) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon({ className = "" }: { className?: string }) {
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
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function PinIcon({ className = "" }: { className?: string }) {
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
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.84l-5.36-6.98L3.8 22H1.04l6.97-7.97L1.5 2h6.98l4.84 6.4L18.244 2zm-1.2 18.2h1.88L7.04 3.72H5.03l12.014 16.48z" />
    </svg>
  );
}

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M23.5 7.1a3 3 0 0 0-2.1-2.1C19.6 4.5 12 4.5 12 4.5s-7.6 0-9.4.5A3 3 0 0 0 .5 7.1C0 8.9 0 12 0 12s0 3.1.5 4.9a3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.8.5-4.9.5-4.9s0-3.1-.5-4.9zM9.6 15.5v-7l6.4 3.5-6.4 3.5z" />
    </svg>
  );
}

function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z" />
    </svg>
  );
}
