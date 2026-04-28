"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useFpsControls } from "./FullPageScroller";

export default function Footer() {
  return (
    // Pure black surface (no gradient/glow/dot-grid decoration any
    // more) so the footer reads as a calm, flat dark band underneath
    // the rest of the site.  `lg:min-h-[68vh]` lifts the dock pop-up
    // higher than the previous 55vh — feedback was that the footer
    // was sitting too low on the home page, leaving a tall band of
    // the previous slide visible above it.
    //
    // On mobile we keep the footer paddings tight (`pt-7`, smaller
    // gaps) and add a `safe-area-inset-bottom` cushion to the bottom
    // bar so the browser's home / back / multitasking chrome doesn't
    // occlude the copyright row + back-to-top button.
    <footer className="relative flex flex-col overflow-hidden bg-black text-white lg:min-h-[68vh]">
      {/* TOP — Subscribe panel + navigation columns.  Top padding nudged
          down (`pt-12 / sm:pt-20 / lg:pt-24`) so there's breathing
          room between the previous slide and the "Stay connected" eyebrow,
          rather than hugging the slide's bottom edge. */}
      <div className="relative z-[1] mx-auto w-full max-w-7xl px-6 pt-12 sm:px-12 sm:pt-20 lg:px-16 lg:pt-24">
        <div className="grid grid-cols-1 gap-7 sm:gap-12 lg:grid-cols-12 lg:gap-12">
          {/* LEFT — newsletter pitch + social row.  The email input
              now lives at the top of the right column so it reads as
              "next to" the Subscribe headline rather than below it. */}
          <div className="lg:col-span-5">
            <p
              data-reveal
              style={{ transitionDelay: "0ms" }}
              className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50"
            >
              <span className="h-px w-8 bg-white/30" />
              Stay connected
            </p>

            <h3
              data-reveal
              style={{ transitionDelay: "80ms" }}
              className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
            >
              Subscribe to our{" "}
              <span className="bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                newsletter.
              </span>
            </h3>

            {/* Hidden on phones — copy was making the mobile footer
                feel cramped under the headline. Desktop keeps the
                supporting one-liner for context. */}
            <p
              data-reveal
              style={{ transitionDelay: "160ms" }}
              className="mt-4 hidden max-w-md text-sm leading-relaxed text-white/55 sm:block"
            >
              {
                "Studio updates, case studies, and the occasional production lesson \u2014 delivered straight to your inbox, no spam."
              }
            </p>

            {/* SOCIAL ROW */}
            <div
              data-reveal
              style={{ transitionDelay: "320ms" }}
              className="mt-7 flex items-center gap-3"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">
                Follow us
              </span>
              <span aria-hidden className="h-px w-6 bg-white/15" />
              <div className="flex items-center gap-2.5">
                <SocialLink href="#" label="X">
                  <XIcon className="h-4 w-4" />
                </SocialLink>
                <SocialLink href="#" label="Instagram">
                  <InstagramIcon className="h-[18px] w-[18px]" />
                </SocialLink>
                <SocialLink href="#" label="YouTube">
                  <YouTubeIcon className="h-[18px] w-[18px]" />
                </SocialLink>
                <SocialLink href="#" label="LinkedIn">
                  <LinkedInIcon className="h-[18px] w-[18px]" />
                </SocialLink>
              </div>
            </div>
          </div>

          {/* RIGHT — email input on top, three nav columns below.
              The input is given its own row so it occupies the same
              vertical band as the Subscribe headline on the left,
              reading horizontally as one "headline + input" unit. */}
          <div className="flex flex-col gap-6 sm:gap-12 lg:col-span-7">
            <NewsletterForm />

            <div
              data-reveal
              style={{ transitionDelay: "320ms" }}
              className="grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-10"
            >
              <FooterColumn
                title="Quick Links"
                links={[
                  { label: "Home", href: "/" },
                  { label: "Services", href: "/#step-1" },
                  { label: "Blogs", href: "/blog" },
                  { label: "Contact Us", href: "/contact" },
                ]}
              />
              <FooterColumn
                title="Policies"
                links={[
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms and Conditions", href: "#" },
                ]}
              />
              <ContactColumn />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR — copyright on the left, lone up-arrow back-to-top
          on the right.  Mobile bottom padding adds a `safe-area-inset`
          cushion so Android Chrome's home / back / multitasking row
          doesn't occlude the copyright + button. */}
      <div
        data-reveal
        style={{
          transitionDelay: "360ms",
          paddingBottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))",
        }}
        className="relative z-[1] mx-auto mt-6 w-full max-w-7xl px-6 sm:mt-12 sm:px-12 lg:mt-14 lg:px-16"
      >
        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 sm:pt-6">
          <p className="text-xs text-white/50">
            © <span className="text-white/70">2026</span> Lorum Ipsum. All
            rights reserved.
          </p>
          <BackToTopButton />
        </div>
      </div>
    </footer>
  );
}

/** RFC-5322-friendly shape (local@domain.tld). */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter form — own component so we can hold per-instance state
 * for the typing/submitting "lightning" shimmer (the white gradient
 * bar that sweeps the bottom border while the user is interacting)
 * AND the email validation lifecycle.
 *
 * Validation:
 *  - Empty field on submit                 → "Please enter your email…"
 *  - Doesn't match local@domain.tld shape  → "That email doesn't look right."
 *  - Longer than 254 characters            → "That email is unusually long."
 *
 * Shimmer triggers:
 *  - User types in the field        → shimmer runs
 *  - User submits a *valid* email   → shimmer runs for ~1.4s + success status
 *  - 600ms idle without typing      → shimmer hides
 */
function NewsletterForm() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [pulse, setPulse] = useState(false);
  const isTyping = useTypingState(value);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
    },
    [],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    // Clear stale error / success the moment the user edits the field
    // — keeps the messaging in sync with what the user actually sees.
    if (error) setError(null);
    if (submitted) setSubmitted(false);
  };

  const validate = (raw: string): string | null => {
    const trimmed = raw.trim();
    if (!trimmed) return "Please enter your email address.";
    if (trimmed.length > 254) return "That email is unusually long.";
    if (!EMAIL_REGEX.test(trimmed)) return "That email doesn't look right.";
    return null;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validate(value);
    if (validationError) {
      setError(validationError);
      setSubmitted(false);
      return;
    }
    // No backend wired yet — flash the shimmer + success status so the
    // submit feels real.  Replace this with your fetch / server action
    // call (and an `await` + status reset) when the API is in place.
    setError(null);
    setSubmitted(true);
    setPulse(true);
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setPulse(false), 1400);
    setValue("");
  };

  const shimmerActive = isTyping || pulse;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      data-reveal
      style={{ transitionDelay: "240ms" }}
      className="group relative w-full"
    >
      <div className="relative flex items-center gap-3 py-3">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={value}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? "newsletter-error"
              : submitted
                ? "newsletter-success"
                : undefined
          }
          className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className="flex-none text-white/70 transition hover:text-red-400"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Static bottom rule — visible at all times so the field reads
          as an input even before the user interacts.  Goes red when
          there's a validation error so the field itself signals the
          problem in addition to the message below. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-px transition-colors ${
          error
            ? "bg-red-400"
            : "bg-white/20 group-focus-within:bg-white"
        }`}
      />

      {/* Lightning bar — sits exactly on top of the static rule and
          fades in only while the user is typing or just submitted.
          Width is wider than 1/3 of the line so the white sliver is
          unmistakable on the dark surface. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden transition-opacity duration-300 ${
          shimmerActive ? "opacity-100" : "opacity-0"
        }`}
      >
        <span
          className="animate-input-shimmer absolute inset-y-0 left-0 w-1/3"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
          }}
        />
      </span>

      {/* Validation message — error wins over success when both are
          eligible.  Both share the same line height so the field
          row doesn't visibly jump as the message appears/disappears. */}
      {error && (
        <p
          id="newsletter-error"
          role="alert"
          className="mt-2 text-[12px] font-medium text-red-300"
        >
          {error}
        </p>
      )}
      {!error && submitted && (
        <p
          id="newsletter-success"
          role="status"
          className="mt-2 text-[12px] font-medium text-white/70"
        >
          Thanks — you&apos;ll hear from us soon.
        </p>
      )}
    </form>
  );
}

/**
 * Track whether `value` has changed in the last `debounceMs` window.
 * Returns `true` while the user is actively typing, `false` once they
 * stop.  Used to drive the lightning shimmer in `NewsletterForm` and
 * (separately) in the contact form's `Field`.
 */
function useTypingState(value: string, debounceMs = 600) {
  const [typing, setTyping] = useState(false);
  const previous = useRef(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value !== previous.current) {
      previous.current = value;
      setTyping(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setTyping(false), debounceMs);
    }
  }, [value, debounceMs]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return typing;
}

/**
 * Right-side action that takes the user back to the very first slide.
 * Pulled out into its own component because it has to live inside the
 * FpsControls provider tree — Footer itself is rendered inside the
 * scroller, so the hook is safe to call here.
 */
function BackToTopButton() {
  const { goto } = useFpsControls();
  return (
    <button
      type="button"
      onClick={() => goto(0)}
      aria-label="Back to top"
      className="group grid h-10 w-10 flex-none place-items-center rounded-full border border-white/15 bg-white/[0.03] text-white/70 transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white hover:text-black"
    >
      <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
    </button>
  );
}

function ContactColumn() {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
        Contact
      </h4>
      <ul className="mt-4 space-y-3 text-sm text-white/75">
        <li className="flex items-center gap-3">
          <PhoneIcon className="h-4 w-4 flex-none text-white/60" />
          <a href="tel:+1000000000" className="transition hover:text-white">
            +1 000 000000
          </a>
        </li>
        <li className="flex items-center gap-3">
          <MailIcon className="h-4 w-4 flex-none text-white/60" />
          <a
            href="mailto:email@address.here"
            className="transition hover:text-white"
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
      className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white/75 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white hover:text-black"
    >
      {children}
    </Link>
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
      strokeWidth={2.2}
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
