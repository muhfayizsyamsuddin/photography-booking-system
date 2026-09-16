"use client";

import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

type AdminSidebarProps = {
  user: {
    name?: string | null;
    email?: string | null;
  };
};

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
  },
  {
    href: "/admin/bookings",
    label: "Bookings",
  },
  {
    href: "/admin/clients",
    label: "Clients",
  },
  {
    href: "/admin/availability",
    label: "Availability",
  },
  {
    href: "/admin/packages",
    label: "Packages",
  },
  {
    href: "/admin/portfolio",
    label: "Portfolio",
  },
  { href: "/admin/testimonials", 
    label: "Testimonials" 
  }
];

export function AdminSidebar({
  user,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function renderNavigation() {
    return (
      <>
        <div>
          <Link
            href="/admin/dashboard"
            onClick={() => setIsOpen(false)}
            className="block"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#8b7866]">
              Photography
            </p>

            <p className="mt-1 text-lg font-semibold tracking-tight text-[#171717]">
              Admin
            </p>
          </Link>
        </div>

        <nav className="mt-10 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block border-l-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-[#171717] bg-[#f6f3ee] text-[#171717]"
                    : "border-transparent text-[#6d6963] hover:border-[#d8d2ca] hover:bg-[#faf8f5] hover:text-[#171717]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <Link
            href="/"
            target="_blank"
            className="inline-block border-b border-[#171717] pb-1 text-sm font-medium text-[#171717] transition-opacity hover:opacity-60"
          >
            View website ↗
          </Link>

          <div className="mt-5 border-t border-[#d8d2ca] pt-5">
            <p className="text-xs uppercase tracking-[0.14em] text-[#8b7866]">
              Signed in as
            </p>

            <p className="mt-2 text-sm font-medium text-[#171717]">
              {user.name || "Admin"}
            </p>

            <p className="mt-1 break-all text-xs leading-5 text-[#6d6963]">
              {user.email}
            </p>

            <button
              type="button"
              onClick={() =>
                signOut({
                  callbackUrl: "/admin/login",
                })
              }
              className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 border border-[#d8d2ca] px-3 py-2.5 text-sm font-medium text-[#171717] transition-colors hover:bg-[#f6f3ee]"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[#d8d2ca] bg-[#fcfaf7] px-4 py-3.5 lg:hidden">
        <Link
          href="/admin/dashboard"
          className="text-sm font-semibold tracking-tight text-[#171717]"
        >
          Photography Admin
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="border border-[#d8d2ca] p-2 text-[#171717] transition-colors hover:bg-[#f6f3ee]"
          aria-label="Open admin navigation"
        >
          <Menu size={20} />
        </button>
      </div>

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[#d8d2ca] bg-[#fcfaf7] p-6 lg:flex">
        {renderNavigation()}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/35"
            aria-label="Close admin navigation"
          />

          <aside className="relative z-10 flex h-full w-72 flex-col border-r border-[#d8d2ca] bg-[#fcfaf7] p-6 shadow-xl">
            <div className="mb-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="border border-[#d8d2ca] p-2 text-[#171717] transition-colors hover:bg-[#f6f3ee]"
                aria-label="Close admin navigation"
              >
                <X size={20} />
              </button>
            </div>

            {renderNavigation()}
          </aside>
        </div>
      )}
    </>
  );
}