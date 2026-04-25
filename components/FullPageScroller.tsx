"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type Slide =
  | { type: "vertical"; content: React.ReactNode; label?: string }
  | { type: "dock"; content: React.ReactNode; label?: string }
  | {
      type: "horizontal";
      panels: React.ReactNode[];
      labels?: string[];
    };

/**
 * Imperative controls for the mounted FullPageScroller, exposed via context
 * so descendant UI (Intro down-arrow, Footer back-to-top, any future
 * in-page nav) can drive the scroller directly without relying on fragile
 * window-level custom events.
 */
export type FpsControls = {
  goto: (step: number) => void;
  advance: () => void;
  retreat: () => void;
  stepCount: number;
};

const FpsControlsContext = createContext<FpsControls | null>(null);

export function useFpsControls(): FpsControls {
  const ctx = useContext(FpsControlsContext);
  if (!ctx) {
    // Return a no-op shim so components can still render outside of a
    // scroller (e.g. in Storybook / tests) without crashing.
    return {
      goto: () => {},
      advance: () => {},
      retreat: () => {},
      stepCount: 0,
    };
  }
  return ctx;
}

const ANIMATION_MS = 1500;
/** Cooldown applied to step changes. Matched to the visual animation so
 *  manual input is unblocked the moment the slide finishes moving. */
const COOLDOWN_MS = ANIMATION_MS;
const WHEEL_THRESHOLD = 10;
const TOUCH_THRESHOLD = 50;
const SCROLL_EDGE_TOLERANCE = 2;
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
/** Interval (ms) for auto-rotating within an active horizontal slide. */
const HORIZONTAL_AUTOPLAY_MS = 4000;
/** Pause the horizontal autoplay for this long after any manual nav input
 *  (wheel / swipe / key / dot-nav). Stops the autoplay from fighting a
 *  user who is actively trying to move between sections. */
const USER_INTERACTION_PAUSE_MS = 8000;

type StepMeta = { slide: number; sub: number; label: string };

export default function FullPageScroller({
  slides,
  children,
}: {
  slides: Slide[];
  /**
   * Optional UI rendered inside the controls provider, on top of every
   * slide (e.g. a global menu overlay or persistent header). Useful for
   * anything that needs `useFpsControls()` to drive navigation.
   */
  children?: ReactNode;
}) {
  const stepMap = useMemo<StepMeta[]>(() => {
    const map: StepMeta[] = [];
    slides.forEach((s, slideIdx) => {
      if (s.type === "horizontal") {
        s.panels.forEach((_, pIdx) => {
          map.push({
            slide: slideIdx,
            sub: pIdx,
            label: s.labels?.[pIdx] ?? `Section ${slideIdx + 1}.${pIdx + 1}`,
          });
        });
      } else {
        map.push({
          slide: slideIdx,
          sub: 0,
          label: s.label ?? `Section ${slideIdx + 1}`,
        });
      }
    });
    return map;
  }, [slides]);

  const count = stepMap.length;
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const animatingRef = useRef(false);
  const touchStartYRef = useRef(0);
  const lastSubRef = useRef<Record<number, number>>({});
  const scrollableRefs = useRef<(HTMLElement | null)[]>([]);
  const dockRefs = useRef<Record<number, HTMLElement | null>>({});
  // Pause horizontal autoplay while the user is hovering or keyboard-focused
  // inside the active horizontal slide.
  const [horizontalHovered, setHorizontalHovered] = useState(false);
  // Wall-clock timestamp of the last manual nav input. The horizontal
  // autoplay reads this to back off whenever the user is actively driving
  // the page, which keeps the autoplay from claiming the cooldown window
  // the user wanted to use for their next scroll/swipe.
  const lastInteractionRef = useRef(0);

  const [measurements, setMeasurements] = useState<{
    viewportH: number;
    dockHeights: Record<number, number>;
  }>({ viewportH: 0, dockHeights: {} });

  // Guard against `step` falling outside stepMap bounds. This can happen in
  // dev when the slide list shrinks (e.g. removing a service panel) while
  // React Fast Refresh keeps the old `step` state. In prod it's harmless
  // insurance — `step` should always be valid, but if it isn't we fall back
  // to the first entry rather than crashing.
  const current = stepMap[step] ?? stepMap[0];

  // Self-heal: if `step` drifts out of range, snap it back into bounds on
  // the next commit rather than repeatedly rendering with the fallback.
  useEffect(() => {
    if (step >= stepMap.length) {
      setStep(Math.max(0, stepMap.length - 1));
    }
  }, [step, stepMap.length]);

  useEffect(() => {
    stepRef.current = step;
    if (current) lastSubRef.current[current.slide] = current.sub;
  }, [step, current]);

  useEffect(() => {
    const el = scrollableRefs.current[step];
    if (el) el.scrollTop = 0;
  }, [step]);

  // Auto-rotate panels inside an active horizontal slide. Wraps around within
  // the slide (last panel -> first panel) without advancing to the next slide,
  // so vertical progression stays user-driven. Pauses on hover/focus, respects
  // prefers-reduced-motion, skips while another transition is cooling down,
  // and stays out of the way for `USER_INTERACTION_PAUSE_MS` after any
  // manual nav input so the autoplay never steals the user's cooldown window.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const activeSlide = slides[current.slide];
    if (!activeSlide || activeSlide.type !== "horizontal") return;
    if (horizontalHovered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const firstStepOfSlide = stepMap.findIndex((m) => m.slide === current.slide);
    const subCount = activeSlide.panels.length;
    if (firstStepOfSlide < 0 || subCount <= 1) return;

    const id = window.setInterval(() => {
      if (animatingRef.current) return;
      if (typeof document !== "undefined" && document.hidden) return;
      // Yield to the human: if they touched the page recently, hold off so
      // their next scroll/swipe isn't blocked by our cooldown.
      if (Date.now() - lastInteractionRef.current < USER_INTERACTION_PAUSE_MS)
        return;
      const cur = stepMap[stepRef.current];
      if (!cur || cur.slide !== current.slide) return;
      const nextSub = (cur.sub + 1) % subCount;
      const nextStep = firstStepOfSlide + nextSub;
      if (nextStep === stepRef.current) return;
      animatingRef.current = true;
      window.setTimeout(() => {
        animatingRef.current = false;
      }, COOLDOWN_MS);
      setStep(nextStep);
    }, HORIZONTAL_AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [current.slide, current.sub, horizontalHovered, slides, stepMap]);

  useEffect(() => {
    const update = () => {
      // Prefer `visualViewport.height` over `innerHeight` for the
      // *visible* viewport area on mobile. On iOS Safari (and similarly
      // on Android Chrome with the URL bar showing) `innerHeight` returns
      // the LARGEST possible area (URL bar collapsed) which is larger
      // than the area actually visible right now — that's exactly the
      // mismatch that made the previous section bleed in at the top of
      // the next section after every page transition.
      const vv = typeof window !== "undefined" ? window.visualViewport : null;
      const viewportH = vv ? vv.height : window.innerHeight;
      const dockHeights: Record<number, number> = {};
      for (const [key, el] of Object.entries(dockRefs.current)) {
        if (el) dockHeights[Number(key)] = el.offsetHeight;
      }
      setMeasurements({ viewportH, dockHeights });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    // Visual viewport fires its own resize event when the mobile browser
    // shows/hides its URL bar — listen so we re-snap slide heights to
    // the new visible area instead of leaving a stale measurement.
    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    vv?.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      vv?.removeEventListener("resize", update);
    };
  }, [slides]);

  // Core imperative step controls, stable across renders. Exposed via
  // context (see FpsControlsContext) so descendants like the Intro down-arrow
  // and the Footer back-to-top button can drive the scroller directly.
  const goto = useCallback(
    (target: number) => {
      lastInteractionRef.current = Date.now();
      if (animatingRef.current) return;
      const clamped = Math.max(0, Math.min(count - 1, target));
      if (clamped === stepRef.current) return;
      animatingRef.current = true;
      window.setTimeout(() => {
        animatingRef.current = false;
      }, COOLDOWN_MS);
      setStep(clamped);
    },
    [count],
  );

  const go = useCallback(
    (dir: 1 | -1) => {
      lastInteractionRef.current = Date.now();
      // Drop input during the in-flight animation. We deliberately do NOT
      // queue inputs here — wheel ticks and trackpad gestures fire many
      // events per real user action, so queuing would silently overshoot
      // by one section every time. The pause-on-interaction guard above
      // means the autoplay won't claim this cooldown out from under the
      // user, so the next scroll/swipe lands cleanly the moment the
      // current animation settles.
      if (animatingRef.current) return;
      const next = stepRef.current + dir;
      if (next < 0 || next >= count) return;
      animatingRef.current = true;
      window.setTimeout(() => {
        animatingRef.current = false;
      }, COOLDOWN_MS);
      setStep(next);
    },
    [count],
  );

  const advance = useCallback(() => go(1), [go]);
  const retreat = useCallback(() => go(-1), [go]);

  const controls = useMemo<FpsControls>(
    () => ({ goto, advance, retreat, stepCount: count }),
    [goto, advance, retreat, count],
  );

  useEffect(() => {
    const getActiveScrollEl = () => scrollableRefs.current[stepRef.current];

    const canConsumeDirection = (dir: 1 | -1) => {
      const el = getActiveScrollEl();
      if (!el) return false;
      if (el.scrollHeight <= el.clientHeight + SCROLL_EDGE_TOLERANCE) return false;
      if (dir === 1) {
        return (
          el.scrollTop + el.clientHeight <
          el.scrollHeight - SCROLL_EDGE_TOLERANCE
        );
      }
      return el.scrollTop > SCROLL_EDGE_TOLERANCE;
    };

    // True when the event came from inside an element that opted out of
    // section navigation (currently: the global menu overlay). Lets the
    // overlay handle its own scrolling/swiping without us hijacking the
    // gesture and jumping to the next slide.
    const isOverlayEvent = (target: EventTarget | null) => {
      const el = target as Element | null;
      return !!el?.closest?.("[data-menu-overlay]");
    };

    const onWheel = (e: WheelEvent) => {
      if (isOverlayEvent(e.target)) return;
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      if (canConsumeDirection(dir)) return;
      e.preventDefault();
      go(dir);
    };

    const onKey = (e: KeyboardEvent) => {
      if (isOverlayEvent(e.target)) return;
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) {
        if (canConsumeDirection(1)) return;
        e.preventDefault();
        go(1);
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        if (canConsumeDirection(-1)) return;
        e.preventDefault();
        go(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goto(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goto(count - 1);
      }
    };

    // Touch swipes inside the menu must not be interpreted as a section
    // swipe. We latch the "started in overlay" decision at touchstart so a
    // gesture that begins in the menu and ends elsewhere (e.g. user drags
    // out) still gets ignored.
    let touchStartedInOverlay = false;

    const onTouchStart = (e: TouchEvent) => {
      touchStartedInOverlay = isOverlayEvent(e.target);
      touchStartYRef.current = e.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartedInOverlay) {
        touchStartedInOverlay = false;
        return;
      }
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const dy = touchStartYRef.current - endY;
      if (Math.abs(dy) < TOUCH_THRESHOLD) return;
      const dir: 1 | -1 = dy > 0 ? 1 : -1;
      if (canConsumeDirection(dir)) return;
      go(dir);
    };

    // Kept as a safety net so any legacy / external code that dispatches
    // these window events still works alongside the context-based controls.
    const onAdvanceEvt = () => go(1);
    const onRetreatEvt = () => go(-1);
    const onGotoEvt = (e: Event) => {
      const detail = (e as CustomEvent<{ step?: number }>).detail;
      if (!detail || typeof detail.step !== "number") return;
      goto(detail.step);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("fps:advance", onAdvanceEvt);
    window.addEventListener("fps:retreat", onRetreatEvt);
    window.addEventListener("fps:goto", onGotoEvt as EventListener);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("fps:advance", onAdvanceEvt);
      window.removeEventListener("fps:retreat", onRetreatEvt);
      window.removeEventListener("fps:goto", onGotoEvt as EventListener);
    };
  }, [count, go, goto]);

  const columnTransition = `transform ${ANIMATION_MS}ms ${EASE}`;
  const effectsTransition = `transform ${ANIMATION_MS}ms ${EASE}, filter ${ANIMATION_MS}ms ${EASE}, opacity ${ANIMATION_MS}ms ${EASE}`;

  const subIdxFor = (slideIdx: number) =>
    slideIdx === current.slide
      ? current.sub
      : (lastSubRef.current[slideIdx] ?? 0);

  const translateYPx = (() => {
    const { viewportH, dockHeights } = measurements;
    if (!viewportH) return 0;
    let columnY = 0;
    for (let i = 0; i < current.slide; i++) {
      const s = slides[i];
      if (s.type === "dock") columnY += dockHeights[i] ?? 0;
      else columnY += viewportH;
    }
    const active = slides[current.slide];
    if (active.type === "dock") {
      const h = dockHeights[current.slide] ?? 0;
      return -(columnY + h - viewportH);
    }
    return -columnY;
  })();

  // CRITICAL: every slide and the outer column MUST share the same height
  // value as the one used in `translateYPx` above — otherwise on real
  // mobile devices the URL bar's height shows up as a visible band of the
  // previous section bleeding into the top of the current one. We use the
  // measured visible viewport height (in px) once available, and fall back
  // to `100dvh` (dynamic viewport height) for the very first SSR / pre-
  // measurement paint so the layout doesn't pop.
  const slideHeight: string | number =
    measurements.viewportH > 0 ? measurements.viewportH : "100dvh";

  return (
    <FpsControlsContext.Provider value={controls}>
      <div
        className="fixed inset-x-0 top-0 overflow-hidden bg-black"
        style={{ height: slideHeight }}
      >
        <div
          className="w-full"
          style={{
            height: slideHeight,
            transform: `translate3d(0, ${translateYPx}px, 0)`,
            transition: columnTransition,
            willChange: "transform",
          }}
        >
        {slides.map((slide, sIdx) => {
          const active = sIdx === current.slide;

          const visualStyle: React.CSSProperties = {
            transition: effectsTransition,
            transform: active ? "scale(1)" : "scale(0.96)",
            opacity: active ? 1 : 0.45,
            filter: active ? "blur(0)" : "blur(3px)",
          };

          if (slide.type === "vertical") {
            const slotIndex = stepMap.findIndex((m) => m.slide === sIdx);
            return (
              <section
                key={sIdx}
                ref={(el) => {
                  scrollableRefs.current[slotIndex] = el;
                }}
                data-slide-active={active}
                className="fps-slide relative w-full overflow-y-auto overflow-x-hidden"
                style={{ ...visualStyle, height: slideHeight }}
              >
                {slide.content}
              </section>
            );
          }

          if (slide.type === "dock") {
            const slotIndex = stepMap.findIndex((m) => m.slide === sIdx);
            return (
              <section
                key={sIdx}
                ref={(el) => {
                  scrollableRefs.current[slotIndex] = el;
                  dockRefs.current[sIdx] = el;
                }}
                data-slide-active={active}
                className="fps-slide relative w-full overflow-y-auto overflow-x-hidden"
                style={{
                  ...visualStyle,
                  maxHeight: slideHeight,
                }}
              >
                {slide.content}
              </section>
            );
          }

          const subIdx = subIdxFor(sIdx);
          return (
            <section
              key={sIdx}
              className="relative w-full overflow-hidden"
              style={{ ...visualStyle, height: slideHeight }}
              onMouseEnter={active ? () => setHorizontalHovered(true) : undefined}
              onMouseLeave={active ? () => setHorizontalHovered(false) : undefined}
              onFocus={active ? () => setHorizontalHovered(true) : undefined}
              onBlur={
                active
                  ? (e) => {
                      if (
                        !e.currentTarget.contains(
                          e.relatedTarget as Node | null,
                        )
                      ) {
                        setHorizontalHovered(false);
                      }
                    }
                  : undefined
              }
            >
              <div
                className="flex h-full"
                style={{
                  width: `${slide.panels.length * 100}vw`,
                  transform: `translate3d(-${subIdx * 100}vw, 0, 0)`,
                  transition: columnTransition,
                  willChange: "transform",
                }}
              >
                {slide.panels.map((panel, pIdx) => (
                  <div
                    key={pIdx}
                    data-slide-active={active && current.sub === pIdx}
                    className="h-full w-screen flex-none"
                  >
                    {panel}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* dot nav */}
      <nav
        aria-label="Sections"
        className="pointer-events-auto fixed right-6 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-3"
      >
        {stepMap.map((meta, i) => (
          <button
            key={i}
            type="button"
            // Route through `goto` so the cooldown + interaction
            // bookkeeping stays consistent (a raw `setStep` here would let
            // a click slip past the autoplay's animation lock).
            onClick={() => goto(i)}
            aria-label={meta.label}
            aria-current={i === step}
            className={`block rounded-full transition-all duration-500 ${
              i === step
                ? "h-9 w-[3px] bg-white"
                : "h-[3px] w-[3px] bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </nav>

        {/* scroll hint. Lifted on phones so it clears the mobile browser's
            bottom address-bar / system nav; reverts to the original tight
            placement at sm+. */}
        <div
          className={`pointer-events-none fixed bottom-20 left-1/2 z-50 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.35em] text-white/55 transition-opacity duration-500 sm:bottom-6 ${
            step === 0 ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-white/50" /> Scroll
            <span className="h-px w-8 bg-white/50" />
          </span>
        </div>

        {/* Anything passed as children renders on top of every slide and
            inherits the controls context — used for the global menu. */}
        {children}
      </div>
    </FpsControlsContext.Provider>
  );
}
