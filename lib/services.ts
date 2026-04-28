/**
 * Services catalogue — single source of truth for the /services route.
 *
 * Order matters: the index in this array drives both the per-service
 * slide order on the page and the diagonal-arrow "jump to section"
 * links inside the index accordion.  Slide 0 of the page is the
 * index/master view; slide N (1-indexed) is the detail panel for
 * `SERVICES[N-1]`.
 */
export type Service = {
  /** Stable identifier — used for React keys and for hash anchors so
   *  external links can deep-link to a specific service slide. */
  slug: string;
  /** Headline name as shown in the accordion + detail title. */
  title: string;
  /** Short tagline shown beneath the title in the detail card and in
   *  the expanded accordion row.  Think of it as the elevator pitch. */
  tagline: string;
  /** 1–2 sentence description for both the accordion expand state and
   *  the service detail card. */
  description: string;
  /** 3–4 short feature bullets shown as inline pill-chips on the
   *  detail card.  Keeps each card scannable at a glance. */
  features: string[];
  /** Hex string for the per-service accent.  Used for the eyebrow dot
   *  on the detail card and for the active thumbnail border in the
   *  "other services" rail at the bottom of every detail slide. */
  accent: string;
  /** Full-bleed hero photograph for the detail slide AND the
   *  thumbnail card image used elsewhere on the page.  Hosted on
   *  Unsplash (whitelisted in `next.config.ts`); served via the IMG()
   *  helper below to standardise size + quality params. */
  image: string;
  /** Alt text for the hero image. */
  imageAlt: string;
};

/** Compose a sensible Unsplash CDN URL for a given photo ID.  Mirrors
 *  the helper the blog uses (see `lib/blogPosts.ts`) so the two
 *  routes share the same image-format / quality contract.  Width is
 *  bumped to 2000 because these photos sit behind full-bleed hero
 *  layouts where banding artefacts on small JPEGs would be obvious. */
const IMG = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2000&q=80`;

export const SERVICES: Service[] = [
  {
    slug: "blockchain",
    title: "Blockchain",
    tagline: "Smart contracts & decentralized apps",
    description:
      "Future-proof systems built on next-generation blockchain architecture. We design scalable, audit-ready ecosystems for finance, identity, and asset tokenization.",
    features: ["Smart contracts", "Custom dApps", "Token economies", "L2 scaling"],
    accent: "#4f46e5",
    image: IMG("1639762681485-074b7f938ba0"),
    imageAlt:
      "Macro shot of golden cryptocurrency tokens stacked together — a visual metaphor for blockchain economies.",
  },
  {
    slug: "ai-automations",
    title: "AI Automations",
    tagline: "Intelligent workflows that pay back fast",
    description:
      "We embed machine learning into your daily operations — automating routing, classification, and decision-making with measurable ROI from week one.",
    features: ["LLM agents", "Workflow automation", "Predictive analytics", "Vision pipelines"],
    accent: "#7c3aed",
    image: IMG("1677442136019-21780ecad995"),
    imageAlt:
      "Glowing neural-network visualisation evoking large-language-model reasoning.",
  },
  {
    slug: "iot",
    title: "IoT",
    tagline: "Connected device networks",
    description:
      "From sensor design to cloud telemetry. We build secure IoT fleets that turn physical-world signals into real-time, actionable streaming data.",
    features: ["Device firmware", "Edge gateways", "MQTT pipelines", "Remote OTA"],
    accent: "#0891b2",
    image: IMG("1558346490-a72e53ae2d4f"),
    imageAlt:
      "Smart-home control panel with connected device sensors arranged in a stylised grid.",
  },
  {
    slug: "cloud-computing",
    title: "Cloud Computing",
    tagline: "Scalable cloud infrastructure",
    description:
      "Production-grade AWS / GCP / Azure architecture, IaC, observability, and cost guardrails for teams who need to ship fast and stay calm at 3 AM.",
    features: ["Multi-cloud IaC", "Kubernetes", "Observability", "FinOps"],
    accent: "#0ea5e9",
    image: IMG("1544197150-b99a580bb7a8"),
    imageAlt:
      "Long row of glowing server racks photographed from a low angle — the physical reality of cloud computing.",
  },
  {
    slug: "app-development",
    title: "App Development",
    tagline: "Native & cross-platform apps",
    description:
      "Premium iOS, Android, and React Native apps with crisp animation, offline-first architecture, and CI pipelines that ship to the stores weekly.",
    features: ["Swift / Kotlin", "React Native", "Offline-first", "Push & in-app"],
    accent: "#ec4899",
    image: IMG("1512941937669-90a1b58e7e9c"),
    imageAlt:
      "Hands holding a smartphone with a stylish app interface lit up on the screen.",
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    tagline: "Growth-driven campaigns",
    description:
      "Performance marketing built on data — SEO, paid media, lifecycle, and brand orchestrated by the same team and measured against the same dashboard.",
    features: ["SEO", "Paid social", "Lifecycle", "Analytics"],
    accent: "#f59e0b",
    image: IMG("1460925895917-afdab827c52f"),
    imageAlt:
      "Hands at a laptop reviewing analytics dashboards with rising charts.",
  },
  {
    slug: "saas",
    title: "SaaS",
    tagline: "Subscription products, end-to-end",
    description:
      "We design and engineer multi-tenant SaaS platforms with billing, identity, and analytics built in from day one — launch in month one, scale by month six.",
    features: ["Multi-tenant", "Stripe billing", "SSO", "Usage analytics"],
    accent: "#10b981",
    image: IMG("1551434678-e076c223a692"),
    imageAlt:
      "Editor full of source code on a glowing dark screen — the engine room of every SaaS product.",
  },
  {
    slug: "web-development",
    title: "Web Development",
    tagline: "High-performance websites",
    description:
      "From marketing sites to commerce stacks, we ship fast, accessible, animation-rich web experiences on Next.js, Astro, and headless CMS.",
    features: ["Next.js", "Headless CMS", "Edge-first", "A11y by default"],
    accent: "#6366f1",
    image: IMG("1517694712202-14dd9538aa97"),
    imageAlt:
      "Source code displayed in a dark code editor — the daily canvas of web development.",
  },
  {
    slug: "game-development",
    title: "Game Development",
    tagline: "Real-time interactive experiences",
    description:
      "From mobile casuals to PC and console titles, we craft Unity & Unreal games with bespoke shaders, multiplayer netcode, and live-ops pipelines.",
    features: ["Unity / Unreal", "Multiplayer", "Shaders", "Live-ops"],
    accent: "#ef4444",
    image: IMG("1542751371-adc38448a05e"),
    imageAlt:
      "Modern game controller lit by dramatic neon studio lighting — a visual cue for interactive entertainment.",
  },
];
