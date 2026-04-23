import Link from "next/link";

export default function Blog() {
  return (
    <section className="pt-12">
      <div className="w-full overflow-hidden">
        <div
          className="relative aspect-[16/9] w-full bg-cover bg-center sm:aspect-[16/8]"
          style={{ backgroundImage: "url('/blog.png')" }}
        >
          <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 lg:p-16">
            <Link
              href="#"
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-sm transition hover:bg-neutral-100"
            >
              Read More
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            <h2 className="mt-5 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
              Blog Title
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
