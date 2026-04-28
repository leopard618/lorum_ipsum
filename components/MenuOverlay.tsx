"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useFpsControls } from "./FullPageScroller";

export type MenuItem = {
  /** Display label for the nav row. */
  label: string;
  /** Tiny subtitle shown beneath the label inside the panel. */
  hint?: string;
  /**
   * Step index in the FullPageScroller to jump to when clicked. Either
   * `step` or `href` must be provided; entries with `href` route to a
   * standalone Next.js page (e.g. /contact) instead of jumping inside
   * the scroller.
   */
  step?: number;
  /** Route to navigate to instead of triggering an in-page jump. */
  href?: string;
};

/**
 * Default site nav. Step indices match the slide order defined in
 * `app/page.tsx`. If the slide list changes, update these numbers (or pass
 * an explicit `items` prop from the page).
 */
export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { label: "Home", step: 0, hint: "Welcome" },
  { label: "Services", href: "/services", hint: "What we do" },
  { label: "Industries", step: 4, hint: "Where we work" },
  { label: "Blog", href: "/blog", hint: "Field notes & essays" },
  { label: "Contact", href: "/contact", hint: "Get in touch" },
];

/** Visual variant for the floating hamburger trigger. */
export type MenuTheme = "dark" | "light";

/**
 * Site-wide menu. Renders a fixed hamburger trigger that morphs into an X
 * when the slide-in panel is open. Navigation items drive the
 * FullPageScroller via `useFpsControls().goto(step)`, so wherever the user
 * is in the page they can jump to any section.
 *
 * Must be rendered inside `FullPageScroller` (which provides the controls
 * context) — see `app/page.tsx`.
 */
export default function MenuOverlay({
  items = DEFAULT_MENU_ITEMS,
  theme = "dark",
}: {
  items?: MenuItem[];
  /**
   * `dark` (default) is the on-black trigger used across the
   * FullPageScroller. `light` swaps it to a dark-on-white pill so the
   * hamburger stays visible on white pages like /contact. The slide-in
   * panel itself stays dark in both themes.
   */
  theme?: MenuTheme;
}) {
  const [open, setOpen] = useState(false);
  // Opens the Schedule-call dialog (separate small modal layered on
  // top of the menu).  We keep the menu panel mounted underneath so
  // the dialog feels like a child of it, not a route change.
  const [scheduleOpen, setScheduleOpen] = useState(false);
  // useFpsControls() returns a safe no-op shim when used outside the
  // FullPageScroller provider (see its definition), so this is fine on
  // standalone routes like /contact where the menu still needs to mount.
  const { goto } = useFpsControls();
  // We need the current route to decide how to handle "step" items:
  // when the menu lives inside the FullPageScroller (home page) we can
  // call goto() directly; from any standalone route (e.g. /contact) we
  // instead push to `/#step-N` so the home page can pick the step up
  // and animate to it after route change.
  const pathname = usePathname();
  const isOnHome = pathname === "/";

  // Esc closes; lock body scroll while open (defense-in-depth — the
  // FullPageScroller already prevents page scroll, but native body scroll
  // can still escape via long pages on some browsers).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleStepNav = (step: number) => {
    setOpen(false);
    // Fire goto on the same tick — the panel's slide-out and the
    // scroller's section transition animate concurrently, which feels
    // snappier than waiting for the panel to fully close first.
    goto(step);
  };

  // When the menu is open, the trigger sits over the dark panel, so we
  // always want it to read as bright/inverted at that moment. When it
  // is *closed*, the trigger floats over whatever is behind it — that's
  // where the `theme` prop matters: dark trigger on light pages and
  // vice-versa.
  const closedTriggerClass =
    theme === "light"
      ? "border-black/15 bg-white/70 text-black hover:border-black/50 hover:bg-black hover:text-white"
      : "border-white/30 bg-black/40 text-white hover:border-white/70 hover:bg-white hover:text-black";
  const openTriggerClass =
    "border-white/40 bg-white/10 text-white hover:border-white/70 hover:bg-white hover:text-black";

  return (
    <>
      {/* Trigger — hamburger that morphs into an X when open. Highest z
          so it stays clickable on top of the panel (acts as the close X). */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="site-menu-panel"
        data-menu-overlay
        className={`fixed right-4 top-4 z-[70] grid h-11 w-11 place-items-center rounded-full border backdrop-blur-md transition-colors duration-200 sm:right-6 sm:top-6 sm:h-12 sm:w-12 ${
          open ? openTriggerClass : closedTriggerClass
        }`}
      >
        <span className="relative h-3 w-5">
          <span
            aria-hidden
            className={`absolute left-0 right-0 h-px bg-current transition-all duration-300 ${
              open
                ? "top-1/2 -translate-y-1/2 rotate-45"
                : "top-0"
            }`}
          />
          <span
            aria-hidden
            className={`absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-current transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            aria-hidden
            className={`absolute left-0 right-0 h-px bg-current transition-all duration-300 ${
              open
                ? "top-1/2 -translate-y-1/2 -rotate-45"
                : "bottom-0"
            }`}
          />
        </span>
      </button>

      {/* Backdrop — clicking it closes the menu. Plain dark overlay (no
          backdrop-blur) so the open animation stays at 60fps even on
          modest GPUs; the slide-in panel itself provides the focus shift. */}
      <div
        aria-hidden
        data-menu-overlay
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[55] bg-black/80 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Slide-in panel. data-menu-overlay lets FullPageScroller detect
          scrolls / swipes that originate inside the menu and skip its
          section-change handling, so dragging the menu's content doesn't
          accidentally jump to the next page section. */}
      <aside
        id="site-menu-panel"
        data-menu-overlay
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!open}
        style={{ willChange: "transform" }}
        className={`fixed right-0 top-0 z-[60] flex h-full w-full max-w-md transform-gpu flex-col overflow-y-auto overscroll-contain bg-gradient-to-br from-neutral-950 via-neutral-950 to-[#1A0A30] shadow-[-12px_0_30px_rgba(0,0,0,0.35)] transition-transform duration-[420ms] ease-out sm:max-w-lg ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Subtle inner accent line on the left edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-violet-400/40 to-transparent"
        />

        <div className="flex h-full flex-col p-8 pt-20 sm:p-12 sm:pt-24">
          {/* Brand */}
          <div className="text-base font-semibold tracking-[0.25em] text-white sm:text-lg">
            LORUM IPSUM
          </div>

          {/* Nav list */}
          <nav className="mt-12 flex-1 sm:mt-16">
            <ul className="space-y-1">
              {items.map((item, i) => {
                // Common visual content for both the in-page <button>
                // and the route-style <Link> branches below — kept as
                // an inline render to avoid drift between the two.
                const rowInner = (
                  <>
                    <span className="tabular-nums text-[10px] font-medium uppercase tracking-[0.3em] text-white/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span className="block text-3xl font-light leading-tight tracking-tight text-white/85 transition-colors duration-300 group-hover:text-white sm:text-4xl">
                        {item.label}
                      </span>
                      {item.hint && (
                        <span className="mt-1 block text-[11px] uppercase tracking-[0.25em] text-white/40">
                          {item.hint}
                        </span>
                      )}
                    </span>
                    <span
                      aria-hidden
                      className="translate-x-0 text-white/40 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white group-hover:opacity-100"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </>
                );
                const rowClass =
                  "group flex w-full items-baseline gap-5 border-b border-white/[0.08] py-4 text-left transition-colors duration-300 hover:border-white/30 sm:py-5";

                return (
                  <li
                    key={item.label}
                    style={{
                      // Shorter duration + tighter stagger keeps the open feel
                      // snappy. willChange + translate3d push each row onto its
                      // own compositor layer so the browser doesn't repaint the
                      // panel for every frame of the cascade.
                      transition:
                        "opacity 320ms ease-out, transform 320ms ease-out",
                      transitionDelay: open ? `${80 + i * 45}ms` : "0ms",
                      opacity: open ? 1 : 0,
                      transform: open
                        ? "translate3d(0,0,0)"
                        : "translate3d(20px,0,0)",
                      willChange: "transform, opacity",
                    }}
                  >
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={rowClass}
                      >
                        {rowInner}
                      </Link>
                    ) : isOnHome ? (
                      <button
                        type="button"
                        onClick={() => handleStepNav(item.step ?? 0)}
                        className={rowClass}
                      >
                        {rowInner}
                      </button>
                    ) : (
                      <Link
                        href={`/#step-${item.step ?? 0}`}
                        onClick={() => setOpen(false)}
                        className={rowClass}
                      >
                        {rowInner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer of the menu — Schedule call CTA + small print */}
          <div
            className="mt-8 space-y-6"
            style={{
              transition:
                "opacity 320ms ease-out, transform 320ms ease-out",
              transitionDelay: open
                ? `${80 + items.length * 45 + 60}ms`
                : "0ms",
              opacity: open ? 1 : 0,
              transform: open
                ? "translate3d(0,0,0)"
                : "translate3d(0,12px,0)",
              willChange: "transform, opacity",
            }}
          >
            <button
              type="button"
              onClick={() => setScheduleOpen(true)}
              className="group inline-flex w-fit items-center gap-3 overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_8px_24px_rgba(255,255,255,0.18)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(255,255,255,0.28)]"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span>Schedule call</span>
            </button>

            <p className="text-[11px] uppercase tracking-[0.25em] text-white/35">
              © {new Date().getFullYear()} Lorum Ipsum
            </p>
          </div>
        </div>
      </aside>

      {/* Schedule-call dialog — small modal for a quick callback
          request (phone + date).  Lives outside the menu panel so it
          can layer on top with its own backdrop. */}
      <ScheduleCallDialog
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
      />
    </>
  );
}

/* =============================================================================
 *   Schedule-call dialog
 *
 *   Modal that lets a visitor request a quick callback.  Captures
 *   name + phone + date + time, with two niceties:
 *
 *     • Timezone is *inferred* from the phone's country dial-in code
 *       (no separate timezone picker — fewer fields, less friction).
 *
 *     • The time grid checks a deterministic "busy slot" set per
 *       date so the visitor can't book a slot we already have on the
 *       calendar.  Today this is a hash-based stand-in; swap with a
 *       real calendar-availability call when the backend is wired.
 *
 *   No backend exists yet — `handleSubmit` flashes the dialog into a
 *   success state and auto-dismisses after ~1.8s.
 * ========================================================================== */

/**
 * Bookable times during a typical business day.  Stored as 24-hour
 * strings (`HH:MM`) so the busy-slot hash and pretty-print logic can
 * both use the same canonical key.
 */
const TIME_SLOTS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
];

/**
 * Country dial-in code → human-readable timezone label.  Sorted by
 * prefix length descending so longer matches (`+852`, `+971`) win
 * over shorter ones (`+8`, `+9`) when we scan the phone string.
 *
 * This is intentionally a small curated table — we'd rather show no
 * timezone hint than the wrong one.  Unknown country codes simply
 * leave the hint blank.
 */
const PHONE_TIMEZONE_TABLE: ReadonlyArray<{ prefix: string; tz: string }> = [
  { prefix: "+852", tz: "HKT (UTC+8)" },
  { prefix: "+971", tz: "GST (UTC+4)" },
  { prefix: "+1", tz: "ET (UTC−5 / −4)" },
  { prefix: "+33", tz: "CET (UTC+1)" },
  { prefix: "+44", tz: "GMT (UTC+0 / +1)" },
  { prefix: "+49", tz: "CET (UTC+1)" },
  { prefix: "+61", tz: "AEST (UTC+10)" },
  { prefix: "+65", tz: "SGT (UTC+8)" },
  { prefix: "+81", tz: "JST (UTC+9)" },
  { prefix: "+82", tz: "KST (UTC+9)" },
  { prefix: "+86", tz: "CST (UTC+8)" },
  { prefix: "+91", tz: "IST (UTC+5:30)" },
];

const SORTED_PHONE_TZ = [...PHONE_TIMEZONE_TABLE].sort(
  (a, b) => b.prefix.length - a.prefix.length,
);

function inferTimezone(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed.startsWith("+")) return null;
  for (const { prefix, tz } of SORTED_PHONE_TZ) {
    if (trimmed.startsWith(prefix)) return tz;
  }
  return null;
}

/**
 * Stand-in for a real Google-Calendar busy lookup.  Hashes the date
 * string and deterministically marks two slots as taken — so if a
 * visitor picks the same date twice they see the same busy slots,
 * which feels real instead of random.  Replace with `fetch(...)`
 * against your calendar API once available.
 */
function getBusySlots(date: string): Set<number> {
  const busy = new Set<number>();
  if (!date) return busy;
  let h = 0;
  for (let i = 0; i < date.length; i++) {
    h = (h * 31 + date.charCodeAt(i)) >>> 0;
  }
  busy.add(h % TIME_SLOTS.length);
  busy.add((Math.floor(h / 7) + 3) % TIME_SLOTS.length);
  return busy;
}

/**
 * Returns `true` while the user is actively typing in `value` and
 * resets to `false` `debounceMs` after the last keystroke.  Drives
 * the lightning shimmer under each editable field — same pattern the
 * contact form and the footer's newsletter input use.
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
 * Lightning shimmer rendered on top of an input's bottom rule.
 * Visible only while `active` is true (the user is mid-typing); the
 * static line itself is painted by the caller so this only animates
 * the moving white sliver.
 */
function ScheduleFieldShimmer({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden transition-opacity duration-300 ${
        active ? "opacity-100" : "opacity-0"
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
  );
}

function ScheduleCallDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  type Status = "idle" | "submitting" | "success";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const nameRef = useRef<HTMLInputElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Per-field typing state, drives the lightning shimmer overlays.
  const nameTyping = useTypingState(name);
  const phoneTyping = useTypingState(phone);
  const dateTyping = useTypingState(date);

  // Today (YYYY-MM-DD) — used as the `min` attribute on the date
  // picker so users can't accidentally pick yesterday.
  const today = new Date().toISOString().slice(0, 10);

  // Derived: timezone label inferred from the phone number, plus
  // the busy slot set computed from the chosen date.  Recomputed on
  // every render — both are pure & cheap.
  const inferredTz = inferTimezone(phone);
  const busySlots = getBusySlots(date);

  // Reset state every time the dialog *re*-opens.
  useEffect(() => {
    if (!open) return;
    setName("");
    setPhone("");
    setDate("");
    setTime("");
    setNameError(null);
    setPhoneError(null);
    setDateError(null);
    setTimeError(null);
    setStatus("idle");
    const t = window.setTimeout(() => nameRef.current?.focus(), 120);
    return () => window.clearTimeout(t);
  }, [open]);

  // If the user changes the date, drop a previously-chosen time iff
  // it's now in the busy set for the new date — keeps the form
  // honest without yanking a still-valid pick.
  useEffect(() => {
    if (!time) return;
    const idx = TIME_SLOTS.findIndex((s) => s.value === time);
    if (idx >= 0 && busySlots.has(idx)) {
      setTime("");
      setTimeError(
        "That slot is now busy on the new date — pick another.",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // Esc closes the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const validate = (): boolean => {
    let ok = true;

    // Name — at least two non-whitespace characters.
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Please enter your name.");
      ok = false;
    } else if (trimmedName.length < 2) {
      setNameError("That name looks too short.");
      ok = false;
    } else {
      setNameError(null);
    }

    // Phone — same rules as the contact form (E.164-ish bounds).
    const trimmedPhone = phone.trim();
    const phoneDigits = trimmedPhone.replace(/\D/g, "");
    if (!trimmedPhone) {
      setPhoneError("Please enter your phone number.");
      ok = false;
    } else if (!/^[+]?[\d\s().\-]+$/.test(trimmedPhone)) {
      setPhoneError("Please enter a valid phone number.");
      ok = false;
    } else if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      setPhoneError("That phone number length looks off.");
      ok = false;
    } else {
      setPhoneError(null);
    }

    // Date — required + today-or-later.
    if (!date) {
      setDateError("Pick a date for the call.");
      ok = false;
    } else if (date < today) {
      setDateError("Pick today or a future date.");
      ok = false;
    } else {
      setDateError(null);
    }

    // Time — required + must not be in the busy set.
    if (!time) {
      setTimeError("Pick a time slot.");
      ok = false;
    } else {
      const idx = TIME_SLOTS.findIndex((s) => s.value === time);
      if (idx < 0 || busySlots.has(idx)) {
        setTimeError("That slot is busy — pick another.");
        ok = false;
      } else {
        setTimeError(null);
      }
    }

    return ok;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    if (!validate()) return;
    setStatus("submitting");
    window.setTimeout(() => {
      setStatus("success");
      closeTimer.current = window.setTimeout(onClose, 2200);
    }, 350);
  };

  const timeLabel = TIME_SLOTS.find((s) => s.value === time)?.label ?? time;

  return (
    <>
      {/* Backdrop — sits above the menu panel (z-65), under the
          dialog (z-75).  Clicking it dismisses. */}
      <div
        aria-hidden
        data-menu-overlay
        onClick={onClose}
        className={`fixed inset-0 z-[65] bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-call-title"
        aria-hidden={!open}
        data-menu-overlay
        className={`fixed left-1/2 top-1/2 z-[75] flex max-h-[92vh] w-[min(92vw,30rem)] -translate-x-1/2 -translate-y-1/2 transform-gpu flex-col overflow-hidden rounded-2xl bg-white text-neutral-900 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] transition-[opacity,transform] duration-300 ease-out ${
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {/* Close button (top-right) — sits inside the scroll container
            so it stays visible while the form scrolls under it. */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close schedule dialog"
          className="absolute right-3 top-3 z-[1] grid h-8 w-8 place-items-center rounded-full bg-white/90 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        {/* Scrollable inner — gives short viewports a clean fallback
            without forcing the whole modal to grow off-screen. */}
        <div className="overflow-y-auto p-6 sm:p-7">
          {status !== "success" ? (
            <>
              {/* Eyebrow + title */}
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
                Schedule a Call
              </p>
              <h2
                id="schedule-call-title"
                className="mt-1.5 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-[1.7rem]"
              >
                Quick callback
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">
                Pick a free slot below and we&apos;ll ring you back. Your phone
                number tells us your timezone — busy slots on the day you pick
                are greyed out.
              </p>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-6 space-y-4"
              >
                {/* Name */}
                <div>
                  <label
                    htmlFor="schedule-name"
                    className="block text-[10.5px] font-semibold uppercase tracking-[0.22em] text-neutral-700"
                  >
                    Name<span className="ml-1 text-neutral-900">*</span>
                  </label>
                  <div className="group relative mt-2">
                    <input
                      id="schedule-name"
                      ref={nameRef}
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError(null);
                      }}
                      placeholder="Jane Doe"
                      aria-invalid={!!nameError}
                      aria-describedby={
                        nameError ? "schedule-name-error" : undefined
                      }
                      className="block w-full bg-transparent pb-1.5 text-[15px] text-neutral-900 placeholder-neutral-400 outline-none"
                    />
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute inset-x-0 bottom-0 h-px transition-colors ${
                        nameError
                          ? "bg-red-500"
                          : "bg-neutral-300 group-focus-within:bg-neutral-900"
                      }`}
                    />
                    <ScheduleFieldShimmer active={nameTyping} />
                  </div>
                  {nameError && (
                    <p
                      id="schedule-name-error"
                      role="alert"
                      className="mt-1.5 text-[11px] font-medium text-red-600"
                    >
                      {nameError}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="schedule-phone"
                    className="flex items-end justify-between gap-3 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-neutral-700"
                  >
                    <span>
                      Phone Number<span className="ml-1 text-neutral-900">*</span>
                    </span>
                    {/* Inferred timezone hint — only renders when we
                        recognised the country dial-in code, otherwise
                        we'd rather say nothing than guess. */}
                    {inferredTz && (
                      <span className="text-[10px] font-medium tracking-[0.18em] text-neutral-500">
                        TZ&nbsp;·&nbsp;{inferredTz}
                      </span>
                    )}
                  </label>
                  <div className="group relative mt-2">
                    <input
                      id="schedule-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (phoneError) setPhoneError(null);
                      }}
                      placeholder="+1 555 0100"
                      aria-invalid={!!phoneError}
                      aria-describedby={
                        phoneError ? "schedule-phone-error" : undefined
                      }
                      className="block w-full bg-transparent pb-1.5 text-[15px] text-neutral-900 placeholder-neutral-400 outline-none"
                    />
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute inset-x-0 bottom-0 h-px transition-colors ${
                        phoneError
                          ? "bg-red-500"
                          : "bg-neutral-300 group-focus-within:bg-neutral-900"
                      }`}
                    />
                    <ScheduleFieldShimmer active={phoneTyping} />
                  </div>
                  {phoneError && (
                    <p
                      id="schedule-phone-error"
                      role="alert"
                      className="mt-1.5 text-[11px] font-medium text-red-600"
                    >
                      {phoneError}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label
                    htmlFor="schedule-date"
                    className="block text-[10.5px] font-semibold uppercase tracking-[0.22em] text-neutral-700"
                  >
                    Date<span className="ml-1 text-neutral-900">*</span>
                  </label>
                  <div className="group relative mt-2">
                    <input
                      id="schedule-date"
                      type="date"
                      min={today}
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        if (dateError) setDateError(null);
                      }}
                      aria-invalid={!!dateError}
                      aria-describedby={
                        dateError ? "schedule-date-error" : undefined
                      }
                      className="block w-full bg-transparent pb-1.5 text-[15px] text-neutral-900 outline-none"
                    />
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute inset-x-0 bottom-0 h-px transition-colors ${
                        dateError
                          ? "bg-red-500"
                          : "bg-neutral-300 group-focus-within:bg-neutral-900"
                      }`}
                    />
                    <ScheduleFieldShimmer active={dateTyping} />
                  </div>
                  {dateError && (
                    <p
                      id="schedule-date-error"
                      role="alert"
                      className="mt-1.5 text-[11px] font-medium text-red-600"
                    >
                      {dateError}
                    </p>
                  )}
                </div>

                {/* Time slot grid */}
                <div>
                  <label
                    className="flex items-end justify-between gap-3 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-neutral-700"
                  >
                    <span>
                      Time<span className="ml-1 text-neutral-900">*</span>
                    </span>
                    {date && (
                      <span className="text-[10px] font-medium tracking-[0.18em] text-neutral-500">
                        Greyed = busy
                      </span>
                    )}
                  </label>
                  <div
                    className="mt-2 grid grid-cols-3 gap-2"
                    role="radiogroup"
                    aria-label="Pick a time slot"
                    aria-describedby={
                      timeError ? "schedule-time-error" : undefined
                    }
                  >
                    {TIME_SLOTS.map((slot, idx) => {
                      const isBusy = busySlots.has(idx);
                      const isSelected = time === slot.value;
                      return (
                        <button
                          key={slot.value}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          disabled={isBusy}
                          onClick={() => {
                            setTime(slot.value);
                            if (timeError) setTimeError(null);
                          }}
                          className={`rounded-full border px-2 py-1.5 text-[11.5px] font-medium tabular-nums tracking-tight transition ${
                            isBusy
                              ? "cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-400 line-through"
                              : isSelected
                                ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                                : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
                          }`}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                  {timeError && (
                    <p
                      id="schedule-time-error"
                      role="alert"
                      className="mt-2 text-[11px] font-medium text-red-600"
                    >
                      {timeError}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-neutral-900 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {/* Continuous lightning sheen — gives the primary
                        action a subtle "alive" feel without overpowering
                        the otherwise quiet white card. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
                    >
                      <span
                        className="animate-row-shimmer absolute inset-y-0 left-0 w-1/3"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
                        }}
                      />
                    </span>
                    <span className="relative">
                      {status === "submitting" ? "Booking…" : "Book a call"}
                    </span>
                    <ArrowRight className="relative h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            // Success state — replaces the form for ~2.2s before the
            // dialog auto-dismisses.
            <div className="py-6 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100">
                <CheckIcon className="h-5 w-5 text-emerald-700" />
              </div>
              <h2
                id="schedule-call-title"
                className="mt-4 text-xl font-semibold tracking-tight text-neutral-900"
              >
                You&apos;re booked, {name.trim().split(/\s+/)[0]}.
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">
                We&apos;ll call{" "}
                <span className="font-medium text-neutral-900">{phone}</span>{" "}
                on{" "}
                <span className="font-medium text-neutral-900">
                  {formatPrettyDate(date)}
                </span>{" "}
                at{" "}
                <span className="font-medium text-neutral-900">
                  {timeLabel}
                </span>
                {inferredTz && (
                  <>
                    {" "}
                    <span className="text-neutral-500">({inferredTz})</span>
                  </>
                )}
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/** Pretty-prints YYYY-MM-DD as "Mon, May 5". */
function formatPrettyDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function CloseIcon({ className = "" }: { className?: string }) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
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
