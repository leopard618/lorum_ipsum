type Trace = {
  d: string;
  /** delay in seconds, staggers pulses so they don't all fire at once */
  delay?: number;
  /** duration override in seconds */
  duration?: number;
};

type EndpointDot = {
  cx: number;
  cy: number;
  delay?: number;
};

const leftTraces: Trace[] = [
  { d: "M 110 115 L 70 115 L 70 92 L 22 92", delay: 0 },
  { d: "M 110 145 L 86 145 L 86 128 L 30 128", delay: 0.25 },
  { d: "M 110 175 L 42 175", delay: 0.5 },
  { d: "M 110 205 L 76 205 L 76 226 L 22 226", delay: 0.75 },
  { d: "M 110 235 L 42 235", delay: 1.0 },
  { d: "M 110 265 L 86 265 L 86 292 L 30 292", delay: 1.25 },
];

const rightTraces: Trace[] = [
  { d: "M 310 115 L 350 115 L 350 92 L 398 92", delay: 0.1 },
  { d: "M 310 145 L 344 145 L 344 128 L 394 128", delay: 0.35 },
  { d: "M 310 175 L 378 175", delay: 0.6 },
  { d: "M 310 205 L 358 205 L 358 226 L 398 226", delay: 0.85 },
  { d: "M 310 235 L 378 235", delay: 1.1 },
  { d: "M 310 265 L 344 265 L 344 292 L 394 292", delay: 1.35 },
];

const topTraces: Trace[] = [
  { d: "M 170 90 L 170 44", delay: 0.15 },
  { d: "M 210 90 L 210 28", delay: 0.4 },
  { d: "M 250 90 L 250 54", delay: 0.65 },
];

const bottomTraces: Trace[] = [
  { d: "M 135 290 L 135 342 L 120 358 L 120 392", delay: 0.2 },
  { d: "M 160 290 L 160 362", delay: 0.45 },
  { d: "M 185 290 L 185 352 L 200 368 L 200 396", delay: 0.7 },
  { d: "M 215 290 L 215 372", delay: 0.95 },
  { d: "M 240 290 L 240 358 L 230 374 L 230 396", delay: 1.2 },
  { d: "M 265 290 L 265 352", delay: 1.45 },
  { d: "M 290 290 L 290 348 L 305 364 L 305 394", delay: 1.7 },
];

const allTraces: Trace[] = [
  ...leftTraces,
  ...rightTraces,
  ...topTraces,
  ...bottomTraces,
];

const endpoints: EndpointDot[] = [
  { cx: 22, cy: 92, delay: 0 },
  { cx: 30, cy: 128, delay: 0.2 },
  { cx: 42, cy: 175, delay: 0.4 },
  { cx: 22, cy: 226, delay: 0.6 },
  { cx: 42, cy: 235, delay: 0.8 },
  { cx: 30, cy: 292, delay: 1.0 },
  { cx: 398, cy: 92, delay: 0.1 },
  { cx: 394, cy: 128, delay: 0.3 },
  { cx: 378, cy: 175, delay: 0.5 },
  { cx: 398, cy: 226, delay: 0.7 },
  { cx: 378, cy: 235, delay: 0.9 },
  { cx: 394, cy: 292, delay: 1.1 },
  { cx: 170, cy: 44, delay: 0.15 },
  { cx: 210, cy: 28, delay: 0.35 },
  { cx: 250, cy: 54, delay: 0.55 },
  { cx: 120, cy: 392, delay: 0.2 },
  { cx: 160, cy: 362, delay: 0.4 },
  { cx: 200, cy: 396, delay: 0.6 },
  { cx: 215, cy: 372, delay: 0.8 },
  { cx: 230, cy: 396, delay: 1.0 },
  { cx: 265, cy: 352, delay: 1.2 },
  { cx: 305, cy: 394, delay: 1.4 },
];

const dotGrid = (() => {
  const dots: Array<{ cx: number; cy: number }> = [];
  for (let x = 136; x <= 284; x += 12) {
    for (let y = 116; y <= 264; y += 12) {
      dots.push({ cx: x, cy: y });
    }
  }
  return dots;
})();

const cornerScrews: Array<{ cx: number; cy: number; delay: number }> = [
  { cx: 142, cy: 122, delay: 0 },
  { cx: 278, cy: 122, delay: 0.7 },
  { cx: 278, cy: 258, delay: 1.4 },
  { cx: 142, cy: 258, delay: 2.1 },
];

const radarRings: Array<{ delay: number }> = [
  { delay: 0 },
  { delay: 1.1 },
  { delay: 2.2 },
];

export default function AIChipAnimated({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 420 420"
      xmlns="http://www.w3.org/2000/svg"
      className={`h-full w-full ${className}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        {/* Palette anchored on #8B5CF6 (violet-500).
            Sibling stops use violet-400/600/700/900 for a cohesive family. */}
        <linearGradient id="aiChipBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="45%" stopColor="#3B1275" />
          <stop offset="100%" stopColor="#0C0318" />
        </linearGradient>
        <linearGradient id="aiChipInner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="55%" stopColor="#4C1D95" />
          <stop offset="100%" stopColor="#1A0A30" />
        </linearGradient>
        <linearGradient id="aiChipBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(237,233,254,0.95)" />
          <stop offset="50%" stopColor="rgba(196,181,253,0.55)" />
          <stop offset="100%" stopColor="rgba(237,233,254,0.95)" />
        </linearGradient>
        <radialGradient id="aiChipAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(139,92,246,0.55)" />
          <stop offset="55%" stopColor="rgba(124,58,237,0.22)" />
          <stop offset="100%" stopColor="rgba(124,58,237,0)" />
        </radialGradient>
        <linearGradient id="aiConnectorGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(221,214,254,0)" />
          <stop offset="50%" stopColor="rgba(245,243,255,1)" />
          <stop offset="100%" stopColor="rgba(221,214,254,0)" />
        </linearGradient>

        <clipPath id="aiInnerClip">
          <rect x="128" y="108" width="164" height="164" rx="8" />
        </clipPath>
      </defs>

      {/* Outer breathing aura — soft violet bloom behind the chip */}
      <rect
        x="60"
        y="40"
        width="300"
        height="300"
        rx="36"
        fill="url(#aiChipAura)"
        className="ai-aura-breathe"
        style={{ filter: "blur(18px)" }}
      />

      {/* Static dim trace base */}
      <g
        fill="none"
        stroke="rgba(196,181,253,0.28)"
        strokeWidth="1.2"
        strokeLinecap="round"
      >
        {allTraces.map((t, i) => (
          <path key={`base-${i}`} d={t.d} />
        ))}
      </g>

      {/* Animated bright trace overlay — dual spark packets */}
      <g
        fill="none"
        stroke="#F5F3FF"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 3px rgba(139,92,246,0.95))" }}
      >
        {allTraces.map((t, i) => (
          <path
            key={`pulse-${i}`}
            d={t.d}
            pathLength={100}
            className="ai-trace-pulse"
            style={{
              animationDelay: `${t.delay ?? 0}s`,
              animationDuration: `${t.duration ?? 2.0}s`,
            }}
          />
        ))}
      </g>

      {/* Endpoint dots with ripple rings */}
      <g>
        {endpoints.map((e, i) => (
          <g key={i}>
            <circle
              cx={e.cx}
              cy={e.cy}
              r="3.6"
              fill="none"
              stroke="rgba(196,181,253,0.75)"
              strokeWidth="0.9"
              className="ai-node-ripple"
              style={{
                animationDelay: `${e.delay ?? 0}s`,
                transformOrigin: `${e.cx}px ${e.cy}px`,
              }}
            />
            <circle
              cx={e.cx}
              cy={e.cy}
              r="2.2"
              fill="#F5F3FF"
              style={{
                filter: "drop-shadow(0 0 4px rgba(139,92,246,0.95))",
              }}
            />
          </g>
        ))}
      </g>

      {/* Depth shadow just outside the chip body */}
      <rect
        x="108"
        y="88"
        width="204"
        height="204"
        rx="18"
        fill="rgba(12,3,24,0.6)"
        style={{ filter: "blur(4px)" }}
      />

      {/* Chip body */}
      <rect
        x="110"
        y="90"
        width="200"
        height="200"
        rx="16"
        fill="url(#aiChipBody)"
        stroke="url(#aiChipBorder)"
        strokeWidth="1.6"
      />

      {/* Inner illuminated panel */}
      <rect
        x="128"
        y="108"
        width="164"
        height="164"
        rx="8"
        fill="url(#aiChipInner)"
        stroke="rgba(221,214,254,0.35)"
        strokeWidth="1"
      />

      {/* Inner dot grid */}
      <g fill="rgba(221,214,254,0.4)" clipPath="url(#aiInnerClip)">
        {dotGrid.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r="1" />
        ))}
      </g>

      {/* Radar pulse rings — data emanating from the core */}
      <g clipPath="url(#aiInnerClip)">
        {radarRings.map((r, i) => (
          <circle
            key={i}
            cx={210}
            cy={190}
            r={22}
            fill="none"
            stroke="rgba(167,139,250,0.7)"
            strokeWidth="1.1"
            className="ai-radar-pulse"
            style={{
              animationDelay: `${r.delay}s`,
              transformOrigin: "210px 190px",
            }}
          />
        ))}
      </g>

      {/* Horizontal scanline sweeping the inner panel */}
      <g clipPath="url(#aiInnerClip)">
        <rect
          x="128"
          y="106"
          width="164"
          height="2"
          fill="rgba(237,233,254,0.9)"
          className="ai-scanline"
          style={{
            filter: "drop-shadow(0 0 6px rgba(139,92,246,0.9))",
          }}
        />
      </g>

      {/* Corner screws (solid dots) */}
      <g stroke="rgba(221,214,254,0.9)" strokeWidth="1.2">
        {cornerScrews.map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r="4" fill="#150530" />
        ))}
      </g>

      {/* Corner screw pulse rings — sequenced around the chip */}
      <g fill="none" stroke="rgba(167,139,250,0.8)" strokeWidth="0.9">
        {cornerScrews.map((s, i) => (
          <circle
            key={`screw-ring-${i}`}
            cx={s.cx}
            cy={s.cy}
            r="5"
            className="ai-screw-ring"
            style={{
              animationDelay: `${s.delay}s`,
              transformOrigin: `${s.cx}px ${s.cy}px`,
            }}
          />
        ))}
      </g>

      {/* AI text — pulsing glow + occasional glitch */}
      <g className="ai-text-pulse">
        <text
          x="210"
          y="190"
          textAnchor="middle"
          dominantBaseline="central"
          fontWeight={400}
          fontSize={58}
          letterSpacing={4}
          fill="#ffffff"
          className="ai-text-glitch"
          style={{
            fontFamily:
              "var(--font-pixel), 'Press Start 2P', 'VT323', 'Courier New', ui-monospace, monospace",
            filter:
              "drop-shadow(0 0 10px rgba(237,233,254,0.95)) drop-shadow(0 0 22px rgba(139,92,246,0.75))",
          }}
        >
          AI
        </text>
      </g>

      {/* Bright border beam traveling around the chip */}
      <rect
        x="110"
        y="90"
        width="200"
        height="200"
        rx="16"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
        pathLength={100}
        className="ai-border-beam"
        style={{ filter: "drop-shadow(0 0 6px rgba(167,139,250,0.95))" }}
      />

      {/* Secondary dim beam running in reverse */}
      <rect
        x="110"
        y="90"
        width="200"
        height="200"
        rx="16"
        fill="none"
        stroke="#C4B5FD"
        strokeWidth="1.4"
        strokeLinecap="round"
        pathLength={100}
        className="ai-border-beam-reverse"
        opacity="0.55"
      />

      {/* Chip connector base */}
      <rect
        x="168"
        y="289"
        width="84"
        height="9"
        rx="1.8"
        fill="#1A0A30"
        stroke="rgba(221,214,254,0.55)"
        strokeWidth="0.9"
      />
      <rect
        x="168"
        y="297"
        width="84"
        height="2"
        fill="url(#aiConnectorGlow)"
        className="ai-connector-glow"
      />
    </svg>
  );
}
