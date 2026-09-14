import Link from "next/link";

import { prisma } from "@/lib/prisma";

function getStatusClasses(status: string) {
  switch (status) {
    case "NEW":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "CONFIRMED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "COMPLETED":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "CANCELLED":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-[#d8d2ca] bg-[#f6f3ee] text-[#6d6963]";
  }
}

export default async function AdminDashboardPage() {
  const now = new Date();

  const [
    totalBookings,
    newBookings,
    confirmedBookings,
    upcomingBookings,
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

    prisma.booking.count({
      where: {
        bookingDate: {
          gte: now,
        },
        status: {
          in: ["NEW", "CONFIRMED"],
        },
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
      description: "All booking requests",
    },
    {
      label: "New",
      value: newBookings,
      description: "Waiting for review",
    },
    {
      label: "Confirmed",
      value: confirmedBookings,
      description: "Approved sessions",
    },
    {
      label: "Active Packages",
      value: activePackages,
      description: "Available services",
    },
    {
      label: "Published Work",
      value: publishedPortfolio,
      description: "Visible portfolio items",
    },
    {
      label: "Upcoming Bookings",
      value: upcomingBookings,
      description: "Scheduled sessions ahead",
    },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-5 border-b border-[#d8d2ca] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8b7866]">
            Overview
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#171717]">
            Dashboard
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d6963]">
            Monitor booking activity, available services, and published
            portfolio content.
          </p>
        </div>

        <Link
          href="/admin/bookings"
          className="self-start border-b border-[#171717] pb-1 text-sm font-medium text-[#171717] transition-opacity hover:opacity-60 sm:self-auto"
        >
          Manage bookings ↗
        </Link>
      </header>

      <section>
        <div className="grid grid-cols-2 border-l border-t border-[#d8d2ca] xl:grid-cols-6">
          {stats.map((item) => (
            <div
              key={item.label}
              className="min-h-32 border-b border-r border-[#d8d2ca] bg-[#fcfaf7] p-5"
            >
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                {item.label}
              </p>

              <p className="mt-5 text-4xl font-semibold tracking-tight text-[#171717]">
                {item.value}
              </p>

              <p className="mt-2 text-xs leading-5 text-[#6d6963]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-[#d8d2ca] bg-[#fcfaf7]">
        <div className="flex flex-col gap-4 border-b border-[#d8d2ca] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-base font-semibold text-[#171717]">
              Recent Bookings
            </h2>

            <p className="mt-1 text-sm text-[#6d6963]">
              Latest booking requests submitted by clients.
            </p>
          </div>

          <Link
            href="/admin/bookings"
            className="self-start text-sm font-medium text-[#171717] transition-opacity hover:opacity-60 sm:self-auto"
          >
            View all →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="px-6 py-14">
            <p className="text-sm text-[#6d6963]">
              No bookings found.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#d8d2ca]">
                    <th className="px-6 py-3 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                      Client
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                      Package
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                      Session Date
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                      Status
                    </th>

                    <th className="px-6 py-3 text-right text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-[#e7e1da] last:border-b-0"
                    >
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-[#171717]">
                          {booking.clientName}
                        </p>

                        <p className="mt-1 text-xs text-[#6d6963]">
                          {booking.phone}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-[#6d6963]">
                        {booking.package.name}
                      </td>

                      <td className="px-6 py-5 text-sm text-[#6d6963]">
                        {booking.bookingDate.toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex border px-2.5 py-1 text-[11px] font-medium ${getStatusClasses(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/admin/bookings/${booking.id}`}
                          className="text-sm font-medium text-[#171717] transition-opacity hover:opacity-60"
                        >
                          View ↗
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#d8d2ca] md:hidden">
              {recentBookings.map((booking) => (
                <article key={booking.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-[#171717]">
                        {booking.clientName}
                      </p>

                      <p className="mt-1 text-xs text-[#6d6963]">
                        {booking.phone}
                      </p>
                    </div>

                    <span
                      className={`inline-flex border px-2.5 py-1 text-[10px] font-medium ${getStatusClasses(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-[#e7e1da] pt-4">
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.14em] text-[#8b7866]">
                        Package
                      </dt>

                      <dd className="mt-1 text-sm text-[#6d6963]">
                        {booking.package.name}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.14em] text-[#8b7866]">
                        Date
                      </dt>

                      <dd className="mt-1 text-sm text-[#6d6963]">
                        {booking.bookingDate.toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </dd>
                    </div>
                  </dl>

                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="mt-5 inline-block border-b border-[#171717] pb-1 text-sm font-medium text-[#171717]"
                  >
                    View booking ↗
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}