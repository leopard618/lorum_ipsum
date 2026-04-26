"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import MenuOverlay from "@/components/MenuOverlay";

/**
 * hCaptcha test sitekey — always returns a valid token without showing
 * a challenge, so the form is wired-and-working out of the box. Swap
 * with a real sitekey from https://dashboard.hcaptcha.com/sites for
 * production, ideally via NEXT_PUBLIC_HCAPTCHA_SITEKEY so it can be
 * rotated without a code change.
 */
const HCAPTCHA_SITEKEY =
  process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY ||
  "10000000-ffff-ffff-ffff-000000000001";

// Augment the global window type so we can talk to the hCaptcha widget
// installed by the script tag without TS complaining.
declare global {
  interface Window {
    hcaptcha?: {
      render: (
        container: HTMLElement | string,
        opts: { sitekey: string; theme?: "light" | "dark"; size?: string },
      ) => string;
      reset: (id?: string) => void;
      getResponse: (id?: string) => string;
      remove?: (id?: string) => void;
    };
  }
}

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

const INITIAL_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const captchaWrapperRef = useRef<HTMLDivElement | null>(null);
  const captchaIdRef = useRef<string | null>(null);

  const update =
    <K extends keyof FormState>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((s) => ({ ...s, [key]: e.target.value }));
      // Clear field-specific error as soon as the user starts editing.
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Please enter your full name.";
    if (!form.email.trim()) next.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "That email doesn't look right.";
    if (!form.phone.trim()) next.phone = "Please enter your phone number.";
    if (!form.message.trim()) next.message = "Please share a short message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const fieldsOk = validate();

    // Read the hCaptcha token off the widget. We track the widget id
    // returned by render() so we can interrogate this exact instance
    // even if multiple widgets ever live on the page.
    const captchaToken =
      typeof window !== "undefined" &&
      window.hcaptcha &&
      captchaIdRef.current
        ? window.hcaptcha.getResponse(captchaIdRef.current)
        : "";
    if (!captchaToken) {
      setCaptchaError("Please confirm you're not a robot.");
    } else {
      setCaptchaError(null);
    }

    if (!fieldsOk || !captchaToken) return;

    setStatus("submitting");
    // No backend wired yet — simulate a network round-trip so the
    // success state still feels real. Replace this with your fetch /
    // server action call when the API is ready; the captchaToken should
    // be re-validated on the server via hcaptcha.com/siteverify.
    await new Promise((r) => setTimeout(r, 700));
    setStatus("success");
    setForm(INITIAL_FORM);
    setErrors({});
    if (
      typeof window !== "undefined" &&
      window.hcaptcha &&
      captchaIdRef.current
    ) {
      window.hcaptcha.reset(captchaIdRef.current);
    }
  };

  // Reveal the page contents on mount — same idiom as the data-reveal
  // hook used elsewhere in the project, but driven imperatively because
  // there's no FullPageScroller to mark the slide active.
  useEffect(() => {
    const root = document.querySelector("[data-contact-root]");
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      el.classList.add("is-revealed");
    });
  }, []);

  // Mount the hCaptcha widget explicitly. Auto-rendering via the
  // `class="h-captcha"` shortcut is unreliable across Next.js soft
  // navigations: when the user lands on /contact via a client-side
  // route change the runtime is already loaded, so the auto-render
  // pass never re-fires for the new mount and the widget shows up
  // empty. Polling for `window.hcaptcha` until it's ready and then
  // calling `.render()` ourselves gives us a single, predictable code
  // path for both fresh page loads and soft navigations.
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const mount = () => {
      if (cancelled) return;
      const el = captchaWrapperRef.current;
      if (!el) return;
      const h = window.hcaptcha;
      if (!h) {
        timer = setTimeout(mount, 120);
        return;
      }
      if (el.dataset.hcaptchaRendered === "true") return;
      try {
        const id = h.render(el, {
          sitekey: HCAPTCHA_SITEKEY,
          theme: "light",
        });
        captchaIdRef.current = id;
        el.dataset.hcaptchaRendered = "true";
      } catch {
        // hCaptcha throws if the container is already rendered (e.g.
        // strict-mode double-mount in dev). Safe to ignore — the first
        // render owns the widget.
      }
    };

    mount();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <main
      data-contact-root
      className="relative min-h-screen overflow-x-hidden bg-white text-neutral-900"
    >
      {/* Load the hCaptcha runtime once at page level. async + defer
          keeps it off the critical path; the widget mounts as soon as
          the bundle is ready. */}
      <Script
        src="https://js.hcaptcha.com/1/api.js"
        strategy="afterInteractive"
        async
        defer
      />

      {/* Subtle background grid — gives the white page some texture
          without pulling focus from the form. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top brand row */}
      <header className="relative z-[1] mx-auto flex w-full max-w-7xl items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8 lg:px-16 lg:pt-10">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.28em] text-neutral-900 hover:text-violet-600"
        >
          LORUM IPSUM
        </Link>
        {/* The hamburger lives top-right via fixed positioning inside
            MenuOverlay, so we just have to mount it. theme="light" gives
            a dark trigger that reads against the white background. */}
      </header>

      <MenuOverlay theme="light" />

      <section className="relative z-[1] mx-auto w-full max-w-7xl px-6 pb-24 pt-12 sm:px-10 sm:pt-16 lg:px-16 lg:pb-32 lg:pt-20">
        {/* Eyebrow — three grey bars in stepped tones, matching the
            reference. We deliberately avoid any chromatic accent here:
            the page sticks to a strict black/white/grey palette. */}
        <div
          data-reveal
          className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-neutral-700"
        >
          <span className="flex items-center gap-1" aria-hidden>
            <span className="block h-2.5 w-5 bg-neutral-300" />
            <span className="block h-2.5 w-5 bg-neutral-500" />
            <span className="block h-2.5 w-5 bg-neutral-700" />
          </span>
          Contact
        </div>

        {/* Heading + description */}
        <div className="mt-6 grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-10">
          <h1
            data-reveal
            style={{ transitionDelay: "80ms" }}
            className="lg:col-span-8 text-[clamp(3rem,9vw,7.5rem)] font-bold leading-[0.95] tracking-tight text-neutral-900"
          >
            Contact Us.
          </h1>
          <p
            data-reveal
            style={{ transitionDelay: "180ms" }}
            className="lg:col-span-4 text-base leading-relaxed text-neutral-600"
          >
            Tell us about the product, the timeline, the constraints — and
            anything else that matters. We read every message and reply
            within one business day.
          </p>
        </div>

        {/* Two-column body — office details + form */}
        <div className="mt-14 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <aside
            data-reveal
            style={{ transitionDelay: "260ms" }}
            className="lg:col-span-4"
          >
            <InfoBlock
              title="Office Location"
              lines={["12273 Dream Avenue, London,", "123456 United Kingdom"]}
            />
            <InfoBlock
              title="Office Time"
              lines={["Monday – Sunday", "11am – 7pm"]}
            />
            <InfoBlock
              title="Support"
              lines={["hello@example.com", "+1 000 000 0000"]}
            />
          </aside>

          <form
            data-reveal
            style={{ transitionDelay: "340ms" }}
            onSubmit={handleSubmit}
            noValidate
            className="lg:col-span-8"
          >
            <div className="grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
              <Field
                label="Full Name"
                required
                value={form.fullName}
                onChange={update("fullName")}
                error={errors.fullName}
                autoComplete="name"
                placeholder="Jane Doe"
              />
              <Field
                label="Email Address"
                required
                type="email"
                value={form.email}
                onChange={update("email")}
                error={errors.email}
                autoComplete="email"
                placeholder="you@company.com"
              />
              <Field
                label="Phone Number"
                required
                type="tel"
                value={form.phone}
                onChange={update("phone")}
                error={errors.phone}
                autoComplete="tel"
                placeholder="+1 555 0100"
              />
              <Field
                label="Company Name"
                value={form.company}
                onChange={update("company")}
                error={errors.company}
                autoComplete="organization"
                placeholder="Optional"
              />
              <div className="sm:col-span-2">
                <FieldLabel required>Message</FieldLabel>
                <textarea
                  value={form.message}
                  onChange={update("message")}
                  rows={4}
                  placeholder="Tell us a bit about your project…"
                  className={`mt-1 w-full resize-none border-b bg-transparent py-3 text-base text-neutral-900 placeholder-neutral-400 outline-none transition ${
                    errors.message
                      ? "border-violet-500 focus:border-violet-600"
                      : "border-neutral-300 focus:border-neutral-900"
                  }`}
                />
                {errors.message && <FieldError>{errors.message}</FieldError>}
              </div>
            </div>

            {/* Captcha + submit row. On wide screens they sit side by
                side; on phones the captcha stacks above the button. */}
            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div ref={captchaWrapperRef} />
                {captchaError && <FieldError>{captchaError}</FieldError>}
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-neutral-900 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  {status === "submitting"
                    ? "Sending…"
                    : status === "success"
                      ? "Sent"
                      : "Send message"}
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Inline status message under the action row — appears
                only in the success state so we don't introduce CLS. */}
            {status === "success" && (
              <p
                className="mt-6 inline-flex items-center gap-2 text-sm text-neutral-700"
                role="status"
              >
                <span
                  aria-hidden
                  className="grid h-5 w-5 place-items-center rounded-full bg-neutral-900 text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                  >
                    <path d="M5 12l5 5 9-11" />
                  </svg>
                </span>
                Thanks — we&apos;ve received your message and will get back to
                you within one business day.
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------ subcomponents ----------------------------- */

function InfoBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="mb-8 last:mb-0">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-900">
        {title}
      </h3>
      <div className="mt-2 space-y-0.5 text-sm leading-relaxed text-neutral-600">
        {lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-[13px] font-medium uppercase tracking-[0.14em] text-neutral-600">
      {children}
      {/* Required marker uses the project's violet accent — the only
          chromatic colour we allow on this page. */}
      {required && <span className="ml-1 text-violet-500">*</span>}
    </label>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 text-xs font-medium text-violet-600" role="alert">
      {children}
    </p>
  );
}

function Field({
  label,
  required,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={`mt-1 w-full border-b bg-transparent py-3 text-base text-neutral-900 placeholder-neutral-400 outline-none transition ${
          error
            ? "border-violet-500 focus:border-violet-600"
            : "border-neutral-300 focus:border-neutral-900"
        }`}
      />
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

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
