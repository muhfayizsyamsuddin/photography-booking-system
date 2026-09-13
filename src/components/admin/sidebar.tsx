"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
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
    href: "/admin/packages",
    label: "Packages",
  },
  {
    href: "/admin/portfolio",
    label: "Portfolio",
  },
];

export function AdminSidebar({
  user,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function renderNavigation() {
    return (
      <>
        <Link
          href="/admin/dashboard"
          onClick={() => setIsOpen(false)}
          className="text-xl font-bold text-gray-900"
        >
          Photography Admin
        </Link>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-gray-200 pt-5">
          <p className="text-sm font-medium text-gray-900">
            {user.name}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {user.email}
          </p>

          <button
            type="button"
            onClick={() =>
              signOut({
                callbackUrl: "/admin/login",
              })
            }
            className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
        <Link
          href="/admin/dashboard"
          className="font-semibold text-gray-900"
        >
          Photography Admin
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-lg border border-gray-300 p-2 text-gray-700"
          aria-label="Open admin navigation"
        >
          <Menu size={20} />
        </button>
      </div>

      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white p-6 lg:flex">
        {renderNavigation()}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40"
            aria-label="Close admin navigation"
          />

          <aside className="relative z-10 flex h-full w-72 flex-col bg-white p-6 shadow-xl">
            <div className="mb-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-gray-300 p-2 text-gray-700"
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