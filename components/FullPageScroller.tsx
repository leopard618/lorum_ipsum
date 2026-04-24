"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type Slide =
  | { type: "vertical"; content: React.ReactNode; label?: string }
  | { type: "dock"; content: React.ReactNode; label?: string }
  | {
      type: "horizontal";
      panels: React.ReactNode[];
      labels?: string[];
    };

const ANIMATION_MS = 1500;
const COOLDOWN_MS = 1600;
const WHEEL_THRESHOLD = 10;
const TOUCH_THRESHOLD = 50;
const SCROLL_EDGE_TOLERANCE = 2;
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

type StepMeta = { slide: number; sub: number; label: string };

export default function FullPageScroller({ slides }: { slides: Slide[] }) {
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

  const [measurements, setMeasurements] = useState<{
    viewportH: number;
    dockHeights: Record<number, number>;
  }>({ viewportH: 0, dockHeights: {} });

  const current = stepMap[step];

  useEffect(() => {
    stepRef.current = step;
    lastSubRef.current[current.slide] = current.sub;
  }, [step, current.slide, current.sub]);

  useEffect(() => {
    const el = scrollableRefs.current[step];
    if (el) el.scrollTop = 0;
  }, [step]);

  useEffect(() => {
    const update = () => {
      const viewportH = window.innerHeight;
      const dockHeights: Record<number, number> = {};
      for (const [key, el] of Object.entries(dockRefs.current)) {
        if (el) dockHeights[Number(key)] = el.offsetHeight;
      }
      setMeasurements({ viewportH, dockHeights });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [slides]);

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

    const go = (dir: 1 | -1) => {
      if (animatingRef.current) return;
      setStep((s) => {
        const next = s + dir;
        if (next < 0 || next >= count) return s;
        animatingRef.current = true;
        window.setTimeout(() => {
          animatingRef.current = false;
        }, COOLDOWN_MS);
        return next;
      });
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      if (canConsumeDirection(dir)) return;
      e.preventDefault();
      go(dir);
    };

    const onKey = (e: KeyboardEvent) => {
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
        setStep(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setStep(count - 1);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const dy = touchStartYRef.current - endY;
      if (Math.abs(dy) < TOUCH_THRESHOLD) return;
      const dir: 1 | -1 = dy > 0 ? 1 : -1;
      if (canConsumeDirection(dir)) return;
      go(dir);
    };

    const onAdvance = () => go(1);
    const onRetreat = () => go(-1);

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("fps:advance", onAdvance);
    window.addEventListener("fps:retreat", onRetreat);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("fps:advance", onAdvance);
      window.removeEventListener("fps:retreat", onRetreat);
    };
  }, [count]);

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

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <div
        className="h-full w-full"
        style={{
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
                className="fps-slide relative h-screen w-full overflow-y-auto overflow-x-hidden"
                style={visualStyle}
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
                  maxHeight: "100vh",
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
              className="relative h-screen w-full overflow-hidden"
              style={visualStyle}
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
            onClick={() => setStep(i)}
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

      {/* scroll hint */}
      <div
        className={`pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.35em] text-white/55 transition-opacity duration-500 ${
          step === 0 ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="inline-flex items-center gap-3">
          <span className="h-px w-8 bg-white/50" /> Scroll
          <span className="h-px w-8 bg-white/50" />
        </span>
      </div>
    </div>
  );
}
