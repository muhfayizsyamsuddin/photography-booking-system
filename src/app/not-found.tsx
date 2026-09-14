import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f3ee] px-6">
      <div className="max-w-xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8b7866]">
          404
        </p>

        <h1 className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.03em] text-[#171717] md:text-6xl">
          Page not found.
        </h1>

        <p className="mx-auto mt-6 max-w-md text-[15px] leading-7 text-[#6d6963]">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>

        <div className="mt-8 flex items-center justify-center gap-7">
          <Link
            href="/"
            className="border-b border-[#171717] pb-1 text-sm font-medium text-[#171717]"
          >
            Back to home ↗
          </Link>

          <Link
            href="/portfolio"
            className="text-sm text-[#6d6963] transition hover:text-[#171717]"
          >
            View portfolio
          </Link>
        </div>
      </div>
    </main>
  );
}