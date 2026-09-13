import Link from "next/link";

export function PublicNavbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-semibold text-gray-900"
        >
          Photography
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/portfolio"
            className="text-gray-600 hover:text-gray-900"
          >
            Portfolio
          </Link>

          <Link
            href="/packages"
            className="text-gray-600 hover:text-gray-900"
          >
            Packages
          </Link>

          <Link
            href="/contact"
            className="text-gray-600 hover:text-gray-900"
          >
            Contact
          </Link>

          <Link
            href="/booking"
            className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800"
          >
            Book Session
          </Link>
        </nav>
      </div>
    </header>
  );
}