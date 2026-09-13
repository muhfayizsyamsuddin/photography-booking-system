"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    href: "/portfolio",
    label: "Portfolio",
  },
  {
    href: "/packages",
    label: "Packages",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-semibold text-gray-900"
          onClick={() => setIsOpen(false)}
        >
          Photography
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive
                    ? "font-medium text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/booking"
            className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800"
          >
            Book Session
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="rounded-lg border border-gray-300 p-2 text-gray-700 md:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-t border-gray-200 bg-white px-6 py-4 shadow-lg md:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/booking"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-lg bg-gray-900 px-4 py-2 text-center text-sm font-medium text-white"
            >
              Book Session
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}