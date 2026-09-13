import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/admin/sidebar";
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
      <div className="lg:flex lg:min-h-screen">
        <AdminSidebar user={session.user} />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}