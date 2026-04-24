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
        <linearGradient id="aiChipBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f4aa6" />
          <stop offset="55%" stopColor="#13317a" />
          <stop offset="100%" stopColor="#06194a" />
        </linearGradient>
        <linearGradient id="aiChipInner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a62c8" />
          <stop offset="100%" stopColor="#0c1f5e" />
        </linearGradient>
        <radialGradient id="aiBottomGlow" cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor="rgba(175,215,255,0.95)" />
          <stop offset="55%" stopColor="rgba(85,150,235,0.35)" />
          <stop offset="100%" stopColor="rgba(85,150,235,0)" />
        </radialGradient>
        <linearGradient id="aiConnectorGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(200,225,255,0)" />
          <stop offset="50%" stopColor="rgba(235,245,255,1)" />
          <stop offset="100%" stopColor="rgba(200,225,255,0)" />
        </linearGradient>

        <clipPath id="aiInnerClip">
          <rect x="128" y="108" width="164" height="164" rx="8" />
        </clipPath>
      </defs>

      <ellipse
        cx="210"
        cy="384"
        rx="190"
        ry="66"
        fill="url(#aiBottomGlow)"
        opacity="0.9"
      />

      <g
        fill="none"
        stroke="rgba(175,215,255,0.28)"
        strokeWidth="1.2"
        strokeLinecap="round"
      >
        {allTraces.map((t, i) => (
          <path key={`base-${i}`} d={t.d} />
        ))}
      </g>

      <g
        fill="none"
        stroke="#e1efff"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 3px rgba(140,195,255,0.95))" }}
      >
        {allTraces.map((t, i) => (
          <path
            key={`pulse-${i}`}
            d={t.d}
            pathLength={100}
            className="ai-trace-pulse"
            style={{
              animationDelay: `${t.delay ?? 0}s`,
              animationDuration: `${t.duration ?? 2.4}s`,
            }}
          />
        ))}
      </g>

      <g>
        {endpoints.map((e, i) => (
          <g key={i}>
            <circle
              cx={e.cx}
              cy={e.cy}
              r="3.6"
              fill="none"
              stroke="rgba(175,215,255,0.75)"
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
              fill="#e1efff"
              style={{
                filter: "drop-shadow(0 0 4px rgba(140,195,255,0.95))",
              }}
            />
          </g>
        ))}
      </g>

      <rect
        x="108"
        y="88"
        width="204"
        height="204"
        rx="18"
        fill="rgba(5,15,40,0.45)"
        style={{ filter: "blur(4px)" }}
      />

      <rect
        x="110"
        y="90"
        width="200"
        height="200"
        rx="16"
        fill="url(#aiChipBody)"
        stroke="rgba(200,225,255,0.9)"
        strokeWidth="1.6"
      />

      <rect
        x="128"
        y="108"
        width="164"
        height="164"
        rx="8"
        fill="url(#aiChipInner)"
        stroke="rgba(200,225,255,0.35)"
        strokeWidth="1"
      />

      <g fill="rgba(210,230,255,0.35)" clipPath="url(#aiInnerClip)">
        {dotGrid.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r="1" />
        ))}
      </g>

      <g clipPath="url(#aiInnerClip)">
        <rect
          x="128"
          y="106"
          width="164"
          height="2"
          fill="rgba(225,240,255,0.9)"
          className="ai-scanline"
          style={{
            filter: "drop-shadow(0 0 6px rgba(140,195,255,0.9))",
          }}
        />
      </g>

      <g stroke="rgba(210,230,255,0.9)" strokeWidth="1.2">
        <circle cx="142" cy="122" r="4" fill="#07174a" />
        <circle cx="278" cy="122" r="4" fill="#07174a" />
        <circle cx="142" cy="258" r="4" fill="#07174a" />
        <circle cx="278" cy="258" r="4" fill="#07174a" />
      </g>

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
          style={{
            fontFamily:
              "var(--font-pixel), 'Press Start 2P', 'VT323', 'Courier New', ui-monospace, monospace",
            filter:
              "drop-shadow(0 0 10px rgba(210,230,255,0.9)) drop-shadow(0 0 22px rgba(95,155,235,0.55))",
          }}
        >
          AI
        </text>
      </g>

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
        style={{ filter: "drop-shadow(0 0 6px rgba(155,200,255,0.95))" }}
      />

      <rect
        x="110"
        y="90"
        width="200"
        height="200"
        rx="16"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.4"
        strokeLinecap="round"
        pathLength={100}
        className="ai-border-beam-reverse"
        opacity="0.55"
      />

      <rect
        x="168"
        y="289"
        width="84"
        height="9"
        rx="1.8"
        fill="#061840"
        stroke="rgba(210,230,255,0.5)"
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
