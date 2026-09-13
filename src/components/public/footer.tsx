import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-[#d8d2ca] bg-[#171717] text-[#f6f3ee]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-2 lg:px-10">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[#b7afa6]">
            Photography
          </p>

          <p className="mt-4 max-w-md font-serif text-3xl leading-tight">
            Stories, people, and moments worth remembering.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/packages">Services</Link>
          <Link href="/booking">Book a Session</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-[#9f988f] lg:px-10">
          © {new Date().getFullYear()} Photography.
        </div>
      </div>
    </footer>
  );
}