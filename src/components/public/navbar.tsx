"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/packages", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-[#d8d2ca] bg-[#f6f3ee]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="text-sm font-semibold uppercase tracking-[0.22em] text-[#171717]"
        >
          Photography
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition ${
                  isActive
                    ? "text-[#171717]"
                    : "text-[#6d6963] hover:text-[#171717]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/booking"
            className="border-b border-[#171717] pb-1 text-sm font-medium text-[#171717]"
          >
            Book a Session ↗
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="md:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full border-b border-[#d8d2ca] bg-[#f6f3ee] px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-lg text-[#171717]"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/booking"
              onClick={() => setIsOpen(false)}
              className="mt-2 border-t border-[#d8d2ca] pt-5 text-lg"
            >
              Book a Session ↗
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}