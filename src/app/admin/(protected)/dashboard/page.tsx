import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      <p className="mt-4">
        Welcome, {session?.user.name}
      </p>

      <p className="text-sm text-gray-500">
        {session?.user.email} · {session?.user.role}
      </p>
    </main>
  );
}