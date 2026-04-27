/**
 * Single source of truth for blog content. Three surfaces consume this
 * list: the home page's editorial Blog slide (`components/Blog.tsx`),
 * the /blog index (`app/blog/page.tsx`), and the per-post detail route
 * (`app/blog/[slug]/page.tsx`). Adding a post here makes it appear in
 * all three places automatically.
 */

export type ArtVariant =
  | "machine"
  | "post-screen"
  | "code"
  | "edge"
  | "slow"
  | "ambient";

/**
 * Body blocks render as a small-but-expressive editorial DSL on the
 * detail page. Stick to these block types — the renderer in
 * `app/blog/[slug]/page.tsx` only knows how to handle these.
 */
export type BodyBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] };

export type BlogPost = {
  slug: string;
  category: string;
  /** Single-line title used by cards and the detail page. */
  title: string;
  /**
   * Optional two-line split used only by the home-page editorial
   * poster — keeps `<br>` breakpoints intentional rather than letting
   * the title reflow per viewport.
   */
  poster?: { lineOne: string; lineTwo: string };
  excerpt: string;
  author: string;
  /** Tagline that appears under the author on the detail page. */
  authorRole?: string;
  date: string;
  readTime: string;
  /**
   * Cover photo URL used by the /blog index (featured hero + grid
   * cards) and the /blog/[slug] detail hero. We host these on
   * Unsplash; remote loading is enabled in next.config.ts.
   */
  image: string;
  /** Alt text describing the cover photo for screen readers / no-JS. */
  imageAlt: string;
  /**
   * Legacy SVG art variant — kept for backward compatibility with the
   * older PostArt-based renderer. New posts should set `image` and can
   * leave `art` as any valid variant; nothing actively reads it.
   */
  art: ArtVariant;
  featured?: boolean;
  body: BodyBlock[];
};

/**
 * Unsplash query string applied to every cover photo. Picks a sensible
 * width, JPEG-XL/AVIF auto-format, 80% quality, and `fit=crop` so the
 * crop is consistent across landscape (hero) and portrait (grid card)
 * usages — Next/Image handles the actual size variants from there.
 */
const IMG = (id: string): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

export const posts: BlogPost[] = [
  {
    slug: "tuning-into-the-machine",
    category: "Featured · Culture × Tech",
    title: "Tuning Into the Machine",
    poster: { lineOne: "Tuning Into", lineTwo: "The Machine" },
    excerpt:
      "Headphones are the new heads-up display. We dig into how ambient AI, voice, and spatial audio are quietly rewriting the grammar of product design — and what it means for the interfaces we ship next.",
    author: "Lorum Ipsum Studio",
    authorRole: "Editorial",
    date: "Apr 2026",
    readTime: "8 min read",
    image: IMG("1505740420928-5e560c06d30e"),
    imageAlt:
      "A pair of premium black over-ear headphones photographed on a clean studio background.",
    art: "machine",
    featured: true,
    body: [
      {
        type: "p",
        text: "For two decades, the screen was the centre of gravity. Every interface decision answered to a rectangle. Now, slowly, the rectangle is sliding off-axis. The most interesting product surfaces of 2026 don't show you anything — they speak, listen, hum, vibrate, or simply notice. The shift isn't loud. It's a tuning, not a revolution.",
      },
      {
        type: "p",
        text: "Headphones are the most concrete example. Once a music accessory, they've become an always-on audio shell — voice assistants on the left ear, translation on the right, spatial cues for navigation overhead. The interface is invisible because the device sits a millimetre from the eardrum and assumes you'd rather hear it than look at it.",
      },
      { type: "h2", text: "What changes when the screen disappears" },
      {
        type: "p",
        text: "When the rectangle goes away, three things happen. First, latency stops being negotiable: a voice that takes 800ms to respond is broken in a way no spinner can fix. Second, the failure modes get weird — silent dead air, hallucinated answers, audio that competes with real-world sound. Third, the brand starts living in tone of voice and timing, not typography.",
      },
      {
        type: "quote",
        text: "The next decade of product design isn't about making screens better. It's about deciding when not to use one.",
      },
      {
        type: "p",
        text: "We've spent the last six months prototyping with teams who have shipped audio-first features at scale. A few patterns are starting to crystalise — and a few myths are starting to die.",
      },
      { type: "h2", text: "Three patterns we keep coming back to" },
      {
        type: "list",
        items: [
          "Confirmation by texture: a short, distinct earcon that tells the user the system heard them, before any model has even started thinking.",
          "Spatial scaffolding: rendering ambient cues in 3D so users can locate the system in the room rather than on their head.",
          "Graceful muting: every audio surface needs a one-gesture path back to silence. Without it, the interface feels like a roommate who never reads the room.",
        ],
      },
      {
        type: "p",
        text: "None of this is new science. But the gap between teams who treat audio as a polish layer and teams who treat it as the primary medium is widening fast — and the latter group is shipping features that feel quietly impossible to imitate.",
      },
    ],
  },
  {
    slug: "designing-for-the-post-screen-era",
    category: "Essay · Product",
    title: "Designing for the Post-Screen Era",
    poster: { lineOne: "Designing For", lineTwo: "The Post-Screen Era" },
    excerpt:
      "Voice, gesture, and ambient interfaces are quietly rewiring how people meet software. A short field guide for designers shipping into a world where the screen is no longer the surface.",
    author: "Mira Akhand",
    authorRole: "Design Lead",
    date: "Mar 2026",
    readTime: "6 min read",
    image: IMG("1620712943543-bcc4688e7485"),
    imageAlt:
      "An atmospheric, softly-lit abstract scene suggesting an interface beyond the screen.",
    art: "post-screen",
    featured: true,
    body: [
      {
        type: "p",
        text: "It is increasingly possible to spend a productive hour with a piece of modern software and never look at it. You speak, it answers. You point, it confirms. You step away, it pauses. The screen is still there — but it's a witness, not the stage.",
      },
      { type: "h2", text: "The new primitives" },
      {
        type: "p",
        text: "When we strip away the rectangle, we're left with a smaller, stranger toolkit: voice, gesture, location, gaze, breath, presence. Each has its own grammar. Voice rewards brevity; gesture rewards directness; gaze rewards stillness. Mixing them is where the real design work begins.",
      },
      {
        type: "quote",
        text: "Designing without a screen feels less like UI and more like writing dialogue for a quiet, observant friend.",
        cite: "From a working session with a Fortune-50 retail team",
      },
      {
        type: "p",
        text: "If you take only one habit from this essay, take this one: prototype with your eyes closed. Tell a teammate what the system should say back to you, in plain English, and listen. If the words sound like a robot reading a screen aloud, you haven't designed for this medium yet.",
      },
      { type: "h2", text: "Where it falls apart" },
      {
        type: "list",
        items: [
          "Onboarding. Without a screen there's nowhere to land tooltips. Designs that lean on visual scaffolding break in 30 seconds.",
          "Disagreement. When the user and the system want different things, voice escalates fast. Design the de-escalation path first.",
          "Privacy. Audio surfaces hear other people in the room. The product needs an opinion about that.",
        ],
      },
      {
        type: "p",
        text: "We're early. The patterns will harden. But the teams making the most progress today are the ones who treat the absence of a screen as a feature, not a constraint.",
      },
    ],
  },
  {
    slug: "when-code-starts-composing",
    category: "Engineering · AI",
    title: "When Code Starts Composing",
    poster: { lineOne: "When Code", lineTwo: "Starts Composing" },
    excerpt:
      "Generative models have moved from autocomplete to authorship. We share what changed in our workflow, our tooling, and our taste once AI became a real collaborator on the team.",
    author: "Theo Park",
    authorRole: "Principal Engineer",
    date: "Mar 2026",
    readTime: "10 min read",
    image: IMG("1555066931-4365d14bab8c"),
    imageAlt:
      "Source code displayed on a dark editor with vivid syntax highlighting.",
    art: "code",
    body: [
      {
        type: "p",
        text: "Sometime in the last eighteen months, the model in our editor stopped suggesting and started proposing. The difference sounds small. It is enormous. A suggestion is a guess about the next token; a proposal is a commitment to a direction. Reviewing proposals all day is closer to editing a junior engineer than typing.",
      },
      { type: "h2", text: "What broke first" },
      {
        type: "p",
        text: "Our review process. Code review was tuned for human throughput — three to five well-considered patches per engineer per day. The model can produce that volume in fifteen minutes. We had to invent an entirely new layer of review: triage, before review even begins.",
      },
      {
        type: "list",
        items: [
          "Reject by signal: tests, types, and lint fail before any human sees the diff.",
          "Reject by shape: structural rules — file sizes, dependency direction, public API changes — kill the obvious mismatches.",
          "Triage by intent: the human reviewer reads the proposal's natural-language summary first, and only opens the diff if the summary is honest.",
        ],
      },
      {
        type: "quote",
        text: "We're not writing less code. We're reading more of it. The job moved upstream.",
      },
      { type: "h2", text: "What got better" },
      {
        type: "p",
        text: "Refactors that used to live in the backlog forever now ship on Tuesdays. Documentation that nobody wanted to write writes itself, badly, and then gets edited into shape. Production incidents trigger postmortems that are draft-ready by the time the on-call engineer sits down. The compounding effect is real — and it isn't about typing speed at all.",
      },
      {
        type: "p",
        text: "If you're starting this transition, our advice is small and unsexy. Invest in your test suite. Invest in your style guide. Invest in the parts of your codebase that document intent. The model is only as good as the runway you give it; a clean codebase is a long, well-lit one.",
      },
    ],
  },
  {
    slug: "the-quiet-revolution-of-edge-ai",
    category: "Field Notes · Edge",
    title: "The Quiet Revolution of Edge AI",
    poster: { lineOne: "The Quiet", lineTwo: "Revolution Of Edge AI" },
    excerpt:
      "Smaller models, on-device inference, and the slow death of round-trips. How edge intelligence is reshaping latency, privacy, and the products we will buy next year.",
    author: "Lina Vasquez",
    authorRole: "ML Strategist",
    date: "Feb 2026",
    readTime: "7 min read",
    image: IMG("1518770660439-4636190af475"),
    imageAlt:
      "A close-up of a circuit board with intricate copper traces and components.",
    art: "edge",
    body: [
      {
        type: "p",
        text: "The frontier model gets the headlines. The on-device model is quietly winning the product war. By the time you read this, a phone in your pocket is running a 3B-parameter model that would have sat behind a paywall two years ago, and it's running fast enough that you don't notice it's there at all.",
      },
      { type: "h2", text: "Why the round-trip is dying" },
      {
        type: "p",
        text: "Three reasons. Latency: a 200ms round-trip is a forever in a conversational interface. Privacy: the simplest way to keep data on-device is to never let it leave. Cost: at scale, a cloud inference call is a tax on every interaction; a local one is free after the first download.",
      },
      {
        type: "list",
        items: [
          "Caption generation in messaging apps — running locally, even offline.",
          "On-device document understanding for passports, receipts, and medical forms.",
          "Live translation that no longer needs a connection to be useful.",
        ],
      },
      {
        type: "quote",
        text: "The interesting question is no longer 'can we run this on-device?' It's 'why are we still calling the cloud for this?'",
      },
      {
        type: "p",
        text: "There's a quieter consequence we don't talk about enough: products designed for edge inference look different from products designed for the cloud. They're calmer. They don't chase every interaction with a spinner. They behave consistently in elevators and on planes. Once you've used a few of them, the cloud-shaped products start to feel a little needy.",
      },
    ],
  },
  {
    slug: "slow-software-for-fast-teams",
    category: "Opinion · Work",
    title: "Slow Software for Fast Teams",
    poster: { lineOne: "Slow Software", lineTwo: "For Fast Teams" },
    excerpt:
      "Speed of shipping is not the same as speed of thought. Why the tools that respect deep work will outlast the ones optimised for notifications and dashboards.",
    author: "Kenji Ito",
    authorRole: "Staff Product Manager",
    date: "Feb 2026",
    readTime: "5 min read",
    image: IMG("1517336714731-489689fd1ca8"),
    imageAlt:
      "A minimalist workspace with a single computer on a clean desk, soft daylight.",
    art: "slow",
    body: [
      {
        type: "p",
        text: "There is a category of software that rewards you for using it more, and another that rewards you for using it well. The first kind is loud — it pings you, scores you, ranks you, surfaces things. The second kind is quiet. It lets you forget it exists for a while.",
      },
      { type: "h2", text: "The hidden cost of the loud category" },
      {
        type: "p",
        text: "Every notification is a tax on attention. Most teams never count the bill. We did, for a quarter, and the result was bracing: a typical engineer was being interrupted forty-three times a day by tools that were ostensibly there to help them work.",
      },
      {
        type: "quote",
        text: "Fast teams aren't fast because their tools are loud. They're fast because their tools know when to be quiet.",
      },
      {
        type: "p",
        text: "Slow software isn't about being literally slow. It's about choosing what to interrupt for. The best examples we've seen share a few traits: they default to no notification, they batch instead of stream, and they treat the user's focus as the most expensive thing in the room.",
      },
    ],
  },
  {
    slug: "the-shape-of-ambient-intelligence",
    category: "Research · AI",
    title: "The Shape of Ambient Intelligence",
    poster: { lineOne: "The Shape Of", lineTwo: "Ambient Intelligence" },
    excerpt:
      "When the model is everywhere, the interface is nowhere. We map four product patterns we expect to see explode the moment ambient AI moves from demo to default.",
    author: "Sara Lin",
    authorRole: "Research Director",
    date: "Jan 2026",
    readTime: "9 min read",
    image: IMG("1581090700227-1e37b190418e"),
    imageAlt:
      "An abstract architectural form in soft light suggesting ambient, ever-present technology.",
    art: "ambient",
    featured: true,
    body: [
      {
        type: "p",
        text: "Ambient intelligence is a phrase that has been around for a long time without ever quite meaning anything specific. The standard definition — \u201cAI that fades into the background\u201d — is true and useless. What does fading look like, in a product? What does it cost? What does it feel like when it works, and when it doesn't?",
      },
      { type: "h2", text: "Four patterns that are actually shipping" },
      {
        type: "list",
        items: [
          "Soft notifications: the model decides what to surface, the user decides when to engage. Friction lives in noticing, not acting.",
          "Memory without prompting: the system remembers what mattered last week and threads it back in this week, without being asked.",
          "Proactive but cancellable: every action the system takes is reversible by a single gesture, and the gesture is taught early.",
          "Quiet defaults: doing nothing is always a valid mode. The model never feels obligated to fill silence.",
        ],
      },
      {
        type: "quote",
        text: "Ambient is the difference between a tool you carry and a tool that carries you.",
      },
      {
        type: "p",
        text: "We expect each of these patterns to feel obvious in a year and unremarkable in three. The teams that internalise them now will look like they've been doing this for a decade. The teams that don't will keep shipping features that ping for attention they haven't earned.",
      },
    ],
  },
  {
    slug: "the-reasoning-bottleneck",
    category: "Engineering · AI",
    title: "The Reasoning Bottleneck",
    poster: { lineOne: "The Reasoning", lineTwo: "Bottleneck" },
    excerpt:
      "Bigger models do not always think harder. We unpack the structural limits of frontier reasoning, and the small product moves that punch above their token budget.",
    author: "Marcus Reed",
    authorRole: "Staff ML Engineer",
    date: "Apr 2026",
    readTime: "7 min read",
    image: IMG("1555066931-4365d14bab8c"),
    imageAlt:
      "Editor displaying source code with vivid syntax highlighting on a dark background.",
    art: "code",
    body: [
      {
        type: "p",
        text: "There is a quiet truth inside every frontier model launch: the reasoning curve has shape. Doubling parameters once gave us double the magic. It does not anymore. The juice is somewhere else, and the teams who notice it first will ship the next decade of useful AI.",
      },
      { type: "h2", text: "Where the wall actually sits" },
      {
        type: "p",
        text: "It sits in working memory. A model can read a million tokens but only really hold a few thousand of them in active focus while it composes a response. Beyond that, the conversation gets thinner; the references get fuzzier; the answer gets confidently wrong.",
      },
      {
        type: "quote",
        text: "We are not training reasoning. We are training the appearance of reasoning, and shipping the difference.",
      },
      {
        type: "p",
        text: "The product move that beats this is unsexy: shrink the prompt. Aggressively. Strip context until the system is reasoning over the smallest possible scaffold that still answers the question. The teams who do this consistently ship features that feel sharper on every model upgrade, instead of bloating with each release.",
      },
    ],
  },
  {
    slug: "refactor-with-confidence",
    category: "Engineering · Tooling",
    title: "Refactor With Confidence",
    poster: { lineOne: "Refactor With", lineTwo: "Confidence" },
    excerpt:
      "Large refactors are still scary, even with an AI pair on your shoulder. A small kit of habits we use to ship structural change without inheriting a week of regressions.",
    author: "Theo Park",
    authorRole: "Principal Engineer",
    date: "Apr 2026",
    readTime: "6 min read",
    image: IMG("1518770660439-4636190af475"),
    imageAlt:
      "A close-up of a circuit board with intricate copper traces and components.",
    art: "edge",
    body: [
      {
        type: "p",
        text: "We refactor every Tuesday. Not because we love it — because the alternative is the slow, irrecoverable kind of decay where suddenly you cannot ship a button without rewriting four modules. The trick is making the refactor cheap, not making it brave.",
      },
      { type: "h2", text: "Three habits that bought us our Tuesdays" },
      {
        type: "list",
        items: [
          "Name the seam before you cut it. If you cannot describe the boundary in one sentence, the refactor is not ready.",
          "Land in two PRs, never one. The first introduces the new shape next to the old; the second deletes the old. Reviewers can actually reason about both.",
          "Hold the contract sacred. Tests at the seam are the only thing standing between you and a long Wednesday.",
        ],
      },
      {
        type: "p",
        text: "AI assistants have made this faster, not safer. They will gladly produce a thousand lines of structurally consistent code that quietly violates an invariant only a senior engineer has internalised. The habits do not change. The volume does.",
      },
    ],
  },
  {
    slug: "the-slow-click",
    category: "Product · UX",
    title: "The Slow Click",
    poster: { lineOne: "The Slow", lineTwo: "Click" },
    excerpt:
      "Some interactions are worth slowing down. We argue for a small, stubborn category of UI that asks the user to mean it — and the trust that compounds when you do.",
    author: "Priya Singh",
    authorRole: "Product Lead",
    date: "Mar 2026",
    readTime: "5 min read",
    image: IMG("1517336714731-489689fd1ca8"),
    imageAlt:
      "A minimalist workspace with a single computer on a clean desk, soft daylight.",
    art: "slow",
    body: [
      {
        type: "p",
        text: "Speed is the default brief in product. Faster checkout, faster onboarding, faster everything. The brief is mostly right. But there is a small, stubborn category of decisions where speed is the bug, not the feature — and getting those few right is worth more than shaving 80ms off the rest.",
      },
      { type: "h2", text: "When to slow the click" },
      {
        type: "p",
        text: "Slow the click whenever the action is destructive, irreversible, financial, or social. Add a half-second of friction. Add a confirmation. Add a sentence that explains what is about to happen, in plain English, in the present tense. The cost is invisible. The save rate, when something goes wrong, is enormous.",
      },
      {
        type: "quote",
        text: "Trust compounds at the speed of the slow click. Always has.",
      },
      {
        type: "p",
        text: "Users do not punish you for the deliberate moments. They remember them. They trust the surface a little more after each one. The product feels less like a slot machine and more like a tool — and tools are what people pay for.",
      },
    ],
  },
  {
    slug: "field-notes-from-the-edge",
    category: "Field Notes · AI",
    title: "Field Notes From the Edge",
    poster: { lineOne: "Field Notes", lineTwo: "From the Edge" },
    excerpt:
      "Six months of shipping on-device inference, summarised by the engineers who broke things. Battery, latency, model swaps — what worked, what didn't, and what we'd do differently.",
    author: "Lina Vasquez",
    authorRole: "ML Strategist",
    date: "Mar 2026",
    readTime: "8 min read",
    image: IMG("1581090700227-1e37b190418e"),
    imageAlt:
      "An abstract architectural form in soft light suggesting ambient, ever-present technology.",
    art: "ambient",
    body: [
      {
        type: "p",
        text: "We spent the last two quarters putting models on phones. Real models, in production, in the hands of users who do not care about parameter counts. These are the field notes — the unglamorous middle of the work, between the demo and the launch.",
      },
      { type: "h2", text: "What surprised us" },
      {
        type: "list",
        items: [
          "Battery was a non-issue. Thermals were the killer. Sustained inference for more than 90 seconds heated the device enough that the OS throttled us before the user noticed anything else.",
          "Model swaps shipped fine. Tokenizer swaps did not. A quietly-changed tokenizer broke a year of cached prompts in production before the rollout monitor caught it.",
          "Users did not ask for offline. They noticed it once, on a plane, and then expected it forever.",
        ],
      },
      {
        type: "p",
        text: "If we did this again, we would invest first in eval rigs that run on the actual device, not on a server pretending to be one. Half of our incidents traced back to differences a desktop simulator silently smoothed over.",
      },
    ],
  },
  {
    slug: "against-productivity-theater",
    category: "Opinion · Work",
    title: "Against Productivity Theater",
    poster: { lineOne: "Against", lineTwo: "Productivity Theater" },
    excerpt:
      "Dashboards that measure motion are not the same as dashboards that measure work. A blunt take on the metrics we keep shipping for managers who do not actually want to know.",
    author: "Kenji Ito",
    authorRole: "Staff Product Manager",
    date: "Feb 2026",
    readTime: "4 min read",
    image: IMG("1505740420928-5e560c06d30e"),
    imageAlt:
      "A pair of premium black over-ear headphones photographed on a clean studio background.",
    art: "machine",
    body: [
      {
        type: "p",
        text: "There is a category of internal tool whose only purpose is to make managers feel less alone on Sunday night. It is dressed up as analytics. It is, mostly, theater. And it is choking the teams it pretends to support.",
      },
      { type: "h2", text: "What productivity theater looks like" },
      {
        type: "p",
        text: "Lines of code per engineer. Tickets closed per week. Slack messages sent in business hours. Each of these metrics is, individually, defensible. Stacked into a dashboard, they create a fiction: that motion is the same as progress, that volume is the same as value, that the loudest team member is the most useful one.",
      },
      {
        type: "quote",
        text: "If the dashboard is mostly green, the dashboard is mostly lying.",
      },
      {
        type: "p",
        text: "The cure is not better metrics. It is fewer of them — and a willingness to read the actual work. A senior leader who can name three real things their team shipped this month does not need a productivity dashboard. The leaders who cannot are the ones the dashboard cannot save.",
      },
    ],
  },
  {
    slug: "memory-as-interface",
    category: "Research · AI",
    title: "Memory as Interface",
    poster: { lineOne: "Memory as", lineTwo: "Interface" },
    excerpt:
      "When the system remembers, the interface gets smaller. Notes from a research sprint on what users will accept, what they reject, and how design changes when the assistant does not forget.",
    author: "Lukas Becker",
    authorRole: "Senior Researcher",
    date: "Feb 2026",
    readTime: "7 min read",
    image: IMG("1620712943543-bcc4688e7485"),
    imageAlt:
      "An atmospheric, softly-lit abstract scene suggesting an interface beyond the screen.",
    art: "post-screen",
    body: [
      {
        type: "p",
        text: "We spent a research sprint asking the same question in twenty different ways: when an AI assistant remembers something about you, what do you want it to do with that memory, and what do you absolutely not want it to do? The answers were sharper than we expected.",
      },
      { type: "h2", text: "What users will accept" },
      {
        type: "list",
        items: [
          "Recall on demand. \u201cYou told me last week …\u201d is welcome, even charming, when the user pulled the thread.",
          "Style memory. The assistant matching tone, format, brevity — every participant approved, even the privacy-anxious ones.",
          "Project memory. Continuity across sessions on a defined task is a strict upgrade. Nobody asked for the alternative.",
        ],
      },
      { type: "h2", text: "What they reject, hard" },
      {
        type: "p",
        text: "Surprise recall. Memory that arrives unbidden, especially in a public or shared context, breaks the illusion that the assistant is on the user's side. The fix is small but absolute: never volunteer memory the user has not invited into the conversation.",
      },
      {
        type: "quote",
        text: "Memory you cannot inspect is surveillance with extra steps.",
      },
      {
        type: "p",
        text: "The design implication is simple. Build the inspector before you build the recall. If the user cannot see what the system remembers — and edit it, in plain text, in under five seconds — the feature should not ship.",
      },
    ],
  },
];

/** Lookup helper used by the dynamic detail route. */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

/**
 * Returns the previous and next post (with wraparound) so the detail
 * page can render a Prev/Next pager that mirrors the home Blog slide's
 * cycle.
 */
export function getAdjacent(slug: string): {
  prev: BlogPost;
  next: BlogPost;
} | null {
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return null;
  const total = posts.length;
  return {
    prev: posts[(idx - 1 + total) % total],
    next: posts[(idx + 1) % total],
  };
}
