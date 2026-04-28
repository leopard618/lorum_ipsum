"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";

/**
 * Temporary client-side password gate for the whole site.
 *
 *   • Compares a SHA-256 hash of the typed input against the
 *     hard-coded `PASSWORD_HASH` constant — the cleartext password is
 *     never present in the bundle.
 *   • Unlock state lives in component state ONLY (no localStorage /
 *     sessionStorage / cookie), so any full page reload remounts the
 *     gate and the user has to re-enter the password. Soft client-side
 *     navigations between routes keep the same React tree mounted and
 *     therefore stay unlocked, which is what we want.
 *   • SSR-safe: returns `null` until hydration so the gate doesn't
 *     flash on top of the real page during the first paint.
 *
 * This is a *temporary* gate — it stops casual viewers, not motivated
 * actors with devtools. Remove this file (and the wrapper in
 * `app/layout.tsx`) once the preview window is over.
 */

/** SHA-256 of the agreed-upon preview password. The cleartext password
 *  itself is never shipped to the browser; only this digest is. */
const PASSWORD_HASH =
  "5cce4c5632fd3035013b96ac9ef9739ee6ed998fc5fbeca8749409898a7c7fc4";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function SiteLock({ children }: { children: ReactNode }) {
  // `hydrated` flips after the first client-side effect runs. Until
  // it's true we render nothing, so the lock screen never paints over
  // server-rendered HTML and we don't get a SSR/CSR mismatch warning.
  const [hydrated, setHydrated] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(false);
    try {
      const hash = await sha256Hex(input);
      if (hash === PASSWORD_HASH) {
        setUnlocked(true);
      } else {
        setError(true);
        setInput("");
      }
    } finally {
      setBusy(false);
    }
  };

  if (!hydrated) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div
      role="dialog"
      aria-modal
      aria-label="Restricted preview"
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black px-6 text-white"
    >
      {/* Soft violet aura so the gate feels on-brand. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full bg-violet-600/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-[360px] w-[360px] rounded-full bg-fuchsia-600/20 blur-3xl"
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-[1] flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md sm:p-9"
      >
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-violet-300">
            Restricted preview
          </span>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[1.625rem]">
            Lorum Ipsum
          </h1>
          <p className="text-sm leading-relaxed text-white/60">
            This build is locked while we&rsquo;re iterating. Enter the
            preview password to continue.
          </p>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
            Password
          </span>
          <input
            type="password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(false);
            }}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            className="h-11 rounded-md border border-white/10 bg-black/50 px-3 text-base text-white placeholder-white/30 outline-none transition focus:border-violet-400/60 focus:bg-black/70"
            placeholder="••••••••"
            aria-invalid={error}
          />
        </label>

        {error && (
          <p
            role="alert"
            className="-mt-3 text-xs font-medium text-rose-300"
          >
            Incorrect password. Try again.
          </p>
        )}

        <button
          type="submit"
          disabled={busy || input.length === 0}
          className="group relative flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-white text-[12px] font-semibold uppercase tracking-[0.28em] text-neutral-900 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
          >
            <span
              className="animate-row-shimmer absolute inset-y-0 left-0 w-1/3"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(139,92,246,0.45), transparent)",
              }}
            />
          </span>
          <span className="relative">
            {busy ? "Checking…" : "Unlock"}
          </span>
        </button>

        <p className="text-[11px] leading-relaxed text-white/35">
          Authorised previewers only. Reload the page to re-lock.
        </p>
      </form>
    </div>
  );
}
