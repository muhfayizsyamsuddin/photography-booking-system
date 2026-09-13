import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [
    totalBookings,
    newBookings,
    confirmedBookings,
    activePackages,
    publishedPortfolio,
    recentBookings,
  ] = await Promise.all([
    prisma.booking.count(),

    prisma.booking.count({
      where: {
        status: "NEW",
      },
    }),

    prisma.booking.count({
      where: {
        status: "CONFIRMED",
      },
    }),

    prisma.package.count({
      where: {
        isActive: true,
      },
    }),

    prisma.portfolio.count({
      where: {
        isPublished: true,
      },
    }),

    prisma.booking.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        package: true,
      },
    }),
  ]);

  const stats = [
    {
      label: "Total Bookings",
      value: totalBookings,
    },
    {
      label: "New Bookings",
      value: newBookings,
    },
    {
      label: "Confirmed",
      value: confirmedBookings,
    },
    {
      label: "Active Packages",
      value: activePackages,
    },
    {
      label: "Published Portfolio",
      value: publishedPortfolio,
    },
  ];

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Overview of photography bookings and content.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <p className="text-sm text-gray-500">
              {item.label}
            </p>

            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              Recent Bookings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest booking requests from clients.
            </p>
          </div>

          <Link
            href="/admin/bookings"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            View all →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-6">
            <p className="text-sm text-gray-500">
              No bookings found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Client
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Package
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {booking.clientName}
                      </p>

                      <p className="text-sm text-gray-500">
                        {booking.phone}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {booking.package.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {booking.bookingDate.toLocaleDateString("id-ID")}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="text-sm font-medium text-gray-900 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}