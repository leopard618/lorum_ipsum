import type { ArtVariant } from "@/lib/blogPosts";

/**
 * Themed SVG illustrations used as card / hero art on the blog. Each
 * variant is a self-contained scene drawn over the same dotted base
 * so the set reads as a coherent series. Keeping them inline (rather
 * than as PNGs) means they stay crisp at any size and travel with the
 * post data without us shipping six bespoke images.
 *
 * `defs` ids are deduplicated per render with a `uid` prop so multiple
 * cards on the same page don't collide on `url(#violetGlow)` etc.
 */

/**
 * Round a computed coordinate so server-rendered HTML and the client's
 * React tree serialize the *exact same string*. Without this, raw
 * floats like `120 + Math.sin(...) * 70` come back as
 * `59.378221735089305` on the server and `59.37822173508931` on the
 * client — same number to 14dp, but different strings — and React
 * throws a hydration mismatch on every <line> we render.
 */
const round = (n: number): number => Math.round(n * 1000) / 1000;
export default function PostArt({
  variant,
  uid = "default",
  className = "",
}: {
  variant: ArtVariant;
  /** Stable suffix appended to gradient/pattern ids — pass each post's slug. */
  uid?: string;
  className?: string;
}) {
  const dotId = `dotgrid-${uid}`;
  const glowId = `violetGlow-${uid}`;
  const lineId = `violetLine-${uid}`;

  return (
    <div className={`relative bg-neutral-900 ${className}`} aria-hidden>
      <svg
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <radialGradient id={glowId} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#6D28D9" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={lineId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.85" />
          </linearGradient>
          <pattern
            id={dotId}
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.08)" />
          </pattern>
        </defs>

        <rect width="400" height="240" fill="#0a0a0a" />
        <rect width="400" height="240" fill={`url(#${dotId})`} />

        {variant === "machine" && (
          <g>
            <circle cx="200" cy="120" r="120" fill={`url(#${glowId})`} />
            {[40, 70, 100, 130].map((r) => (
              <circle
                key={r}
                cx="200"
                cy="120"
                r={r}
                fill="none"
                stroke="rgba(167,139,250,0.35)"
                strokeWidth="1"
              />
            ))}
            <circle cx="200" cy="120" r="14" fill="#A78BFA" />
            <circle
              cx="200"
              cy="120"
              r="22"
              fill="none"
              stroke="#fff"
              strokeOpacity="0.55"
              strokeWidth="1.5"
            />
            <line
              x1="60"
              y1="120"
              x2="340"
              y2="120"
              stroke={`url(#${lineId})`}
              strokeWidth="1.5"
              opacity="0.6"
            />
          </g>
        )}

        {variant === "post-screen" && (
          <g>
            <circle cx="120" cy="120" r="160" fill={`url(#${glowId})`} />
            {Array.from({ length: 12 }).map((_, i) => {
              const t = i / 12;
              const x = round(40 + t * 320);
              const y = round(60 + Math.sin(t * Math.PI * 2) * 60);
              const h = round(20 + Math.cos(t * 6) * 18);
              return (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width="2"
                  height={h}
                  fill="rgba(167,139,250,0.85)"
                />
              );
            })}
            <path
              d="M 30 200 C 100 140, 180 220, 260 160 S 380 180, 380 180"
              fill="none"
              stroke={`url(#${lineId})`}
              strokeWidth="2"
              opacity="0.75"
            />
          </g>
        )}

        {variant === "code" && (
          <g>
            <circle cx="280" cy="80" r="140" fill={`url(#${glowId})`} />
            {[60, 90, 120, 150, 180].map((y, i) => (
              <g key={y} opacity={1 - i * 0.12}>
                <rect
                  x="40"
                  y={y}
                  width={i % 2 === 0 ? 220 : 180}
                  height="2"
                  fill="rgba(255,255,255,0.65)"
                />
                <rect
                  x={i % 2 === 0 ? 270 : 230}
                  y={y}
                  width={i % 2 === 0 ? 60 : 90}
                  height="2"
                  fill="rgba(167,139,250,0.85)"
                />
              </g>
            ))}
            <path
              d="M 320 50 L 360 90 L 320 130"
              fill="none"
              stroke="#A78BFA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 80 50 L 40 90 L 80 130"
              fill="none"
              stroke="#A78BFA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
          </g>
        )}

        {variant === "edge" && (
          <g>
            <circle cx="200" cy="120" r="160" fill={`url(#${glowId})`} />
            {[
              [80, 80],
              [320, 80],
              [80, 180],
              [320, 180],
            ].map(([x, y], i) => (
              <g key={i}>
                <line
                  x1="200"
                  y1="120"
                  x2={x}
                  y2={y}
                  stroke="rgba(167,139,250,0.55)"
                  strokeWidth="1.2"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="9"
                  fill="#1a1130"
                  stroke="#A78BFA"
                  strokeWidth="1.5"
                />
              </g>
            ))}
            <circle cx="200" cy="120" r="18" fill="#A78BFA" />
            <circle
              cx="200"
              cy="120"
              r="28"
              fill="none"
              stroke="#fff"
              strokeOpacity="0.4"
              strokeWidth="1"
            />
          </g>
        )}

        {variant === "slow" && (
          <g>
            <circle cx="200" cy="120" r="180" fill={`url(#${glowId})`} />
            <circle
              cx="200"
              cy="120"
              r="60"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />
            <line
              x1="200"
              y1="120"
              x2="200"
              y2="68"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="200"
              y1="120"
              x2="232"
              y2="120"
              stroke="#A78BFA"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="200" cy="120" r="3" fill="#fff" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              const x1 = round(200 + Math.cos(a) * 70);
              const y1 = round(120 + Math.sin(a) * 70);
              const x2 = round(200 + Math.cos(a) * 78);
              const y2 = round(120 + Math.sin(a) * 78);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="1"
                />
              );
            })}
          </g>
        )}

        {variant === "ambient" && (
          <g>
            <circle cx="200" cy="120" r="180" fill={`url(#${glowId})`} />
            {[30, 55, 80, 105].map((r, i) => (
              <ellipse
                key={r}
                cx="200"
                cy="120"
                rx={r * 1.6}
                ry={r}
                fill="none"
                stroke="rgba(167,139,250,0.5)"
                strokeWidth="1"
                opacity={1 - i * 0.18}
              />
            ))}
            <circle cx="200" cy="120" r="10" fill="#A78BFA" />
          </g>
        )}
      </svg>
    </div>
  );
}
