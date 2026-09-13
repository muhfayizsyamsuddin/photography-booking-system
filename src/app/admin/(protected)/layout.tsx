import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

type ProtectedAdminLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedAdminLayout({
  children,
}: ProtectedAdminLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-white p-6">
          <h2 className="mb-8 text-xl font-bold text-gray-900">
            Photography Admin
          </h2>

          <nav className="space-y-2">
            <Link
              href="/admin/dashboard"
              className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/bookings"
              className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
            >
              Bookings
            </Link>

            <Link
              href="/admin/packages"
              className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
            >
              Packages
            </Link>

            <Link
              href="/admin/portfolio"
              className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
            >
              Portfolio
            </Link>
          </nav>

          <div className="mt-10 border-t pt-4">
            <p className="text-sm font-medium text-gray-900">
              {session.user.name}
            </p>

            <p className="text-xs text-gray-500">
              {session.user.email}
            </p>
          </div>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}