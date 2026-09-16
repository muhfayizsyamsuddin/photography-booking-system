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

type AdminDashboardPageProps = {
  searchParams: Promise<{
    period?: string;
  }>;
};

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const { period = "month" } = await searchParams;
  const now = new Date();

  const calendarStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  );

  const calendarEnd = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999)
  );

  const periodStart = new Date(now);
  const periodEnd = new Date(now);

  switch (period) {
    case "week":
      periodStart.setDate(now.getDate() - 7);
      break;

    case "year":
      periodStart.setFullYear(now.getFullYear(), 0, 1);
      periodStart.setHours(0, 0, 0, 0);
      break;

    case "month":
    default:
      periodStart.setFullYear(now.getFullYear(), now.getMonth(), 1);
      periodStart.setHours(0, 0, 0, 0);
      break;
  }

  periodEnd.setHours(23, 59, 59, 999);

  const [
    totalBookings,
    newBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    unpaidBookings,
    partiallyPaidBookings,
    paidBookings,
    upcomingBookings,
    activePackages,
    publishedPortfolio,
    recentBookings,
    upcomingSessions,
    attentionBookings,
    periodBookings,
    calendarBookings,
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
        status: "COMPLETED",
      },
    }),

    prisma.booking.count({
      where: {
        status: "CANCELLED",
      },
    }),

    prisma.booking.count({
      where: {
        paymentStatus: "UNPAID",
      },
    }),

    prisma.booking.count({
      where: {
        paymentStatus: "PARTIALLY_PAID",
      },
    }),

    prisma.booking.count({
      where: {
        paymentStatus: "PAID",
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
    prisma.booking.findMany({
      take: 5,
      where: {
        bookingDate: {
          gte: now,
        },
        status: "CONFIRMED",
      },
      orderBy: [
        {
          bookingDate: "asc",
        },
        {
          bookingTime: "asc",
        },
      ],
      include: {
        package: true,
      },
    }),

    prisma.booking.findMany({
      take: 5,
      where: {
        OR: [
          {
            status: "NEW",
          },
          {
            bookingDate: {
              gte: now,
            },
            status: "CONFIRMED",
            paymentStatus: {
              in: ["UNPAID", "PARTIALLY_PAID"],
            },
          },
        ],
      },
      orderBy: {
        bookingDate: "asc",
      },
      include: {
        package: true,
      },
    }),
    prisma.booking.count({
      where: {
        bookingDate: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
    }),
    prisma.booking.findMany({
      where: {
        bookingDate: {
          gte: calendarStart,

        
          lte: calendarEnd,
        },
        status: {
          in: ["NEW", "CONFIRMED"],
        },
      },
      orderBy: [
        {
          bookingDate: "asc",
        },
        {
          bookingTime: "asc",
        },
      ],
      select: {
        id: true,
        clientName: true,
        bookingDate: true,
        bookingTime: true,
        status: true,
      },
    }),
  ]);

  const periodLabels: Record<string, string> = {
    week: "Last 7 Days",
    month: "This Month",
    year: "This Year",
  };

  const selectedPeriodLabel =
    periodLabels[period] ?? periodLabels.month;

  const calendarYear = now.getUTCFullYear();
    const calendarMonth = now.getUTCMonth();

    const firstDayOfMonth = new Date(
      Date.UTC(calendarYear, calendarMonth, 1)
    );

    const daysInMonth = new Date(
      Date.UTC(calendarYear, calendarMonth + 1, 0)
    ).getUTCDate();

    const firstWeekday = firstDayOfMonth.getUTCDay();

    const calendarMonthLabel = firstDayOfMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });

    const bookingsByDay = new Map<
      number,
      typeof calendarBookings
    >();

    for (const booking of calendarBookings) {
      const day = booking.bookingDate.getUTCDate();

      const currentBookings = bookingsByDay.get(day) ?? [];

      currentBookings.push(booking);

      bookingsByDay.set(day, currentBookings);
    }

    const calendarDays = Array.from(
      {
        length: firstWeekday + daysInMonth,
      },
      (_, index) => {
        if (index < firstWeekday) {
          return null;
        }

        return index - firstWeekday + 1;
      }
    );

  const bookingStats = [
    {
      label: "Total",
      value: totalBookings,
      description: "All bookings",
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
      label: "Completed",
      value: completedBookings,
      description: "Finished sessions",
    },
    {
      label: "Cancelled",
      value: cancelledBookings,
      description: "Cancelled bookings",
    },
  ];

  const paymentStats = [
    {
      label: "Unpaid",
      value: unpaidBookings,
      description: "No payment recorded",
    },
    {
      label: "Partially Paid",
      value: partiallyPaidBookings,
      description: "Payment incomplete",
    },
    {
      label: "Paid",
      value: paidBookings,
      description: "Fully paid bookings",
    },
  ];

  const operationalStats = [
    {
      label: "Upcoming",
      value: upcomingBookings,
      description: "Scheduled sessions ahead",
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

      <section className="space-y-6">
        <div>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[#171717]">
              Booking Overview
            </h2>

            <p className="mt-1 text-sm text-[#6d6963]">
              Current booking status distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 border-l border-t border-[#d8d2ca] sm:grid-cols-2 lg:grid-cols-5">
            {bookingStats.map((item) => (
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
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
          <div>
            <div className="mb-4">
              <h2 className="text-base font-semibold text-[#171717]">
                Payment Overview
              </h2>

              <p className="mt-1 text-sm text-[#6d6963]">
                Payment status across all bookings.
              </p>
            </div>

            <div className="grid grid-cols-1 border-l border-t border-[#d8d2ca] sm:grid-cols-3">
              {paymentStats.map((item) => (
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
          </div>

          <div>
            <div className="mb-4">
              <h2 className="text-base font-semibold text-[#171717]">
                Operations
              </h2>

              <p className="mt-1 text-sm text-[#6d6963]">
                Current operational overview.
              </p>
            </div>

            <div className="grid grid-cols-1 border-l border-t border-[#d8d2ca] sm:grid-cols-3 xl:grid-cols-1">
              {operationalStats.map((item) => (
                <div
                  key={item.label}
                  className="border-b border-r border-[#d8d2ca] bg-[#fcfaf7] p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                        {item.label}
                      </p>

                      <p className="mt-2 text-xs text-[#6d6963]">
                        {item.description}
                      </p>
                    </div>

                    <p className="text-3xl font-semibold tracking-tight text-[#171717]">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border border-[#d8d2ca] bg-[#fcfaf7]">
        <div className="flex flex-col gap-5 border-b border-[#d8d2ca] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b7866]">
              Activity
            </p>

            <h2 className="mt-2 text-base font-semibold text-[#171717]">
              Booking Activity
            </h2>

            <p className="mt-1 text-sm text-[#6d6963]">
              Total bookings for the selected period.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { value: "week", label: "7 Days" },
              { value: "month", label: "Month" },
              { value: "year", label: "Year" },
            ].map((item) => (
              <Link
                key={item.value}
                href={`/admin/dashboard?period=${item.value}`}
                className={`border px-3 py-2 text-xs font-medium transition-colors ${
                  period === item.value
                    ? "border-[#171717] bg-[#171717] text-white"
                    : "border-[#d8d2ca] text-[#6d6963] hover:border-[#8b7866] hover:text-[#171717]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b7866]">
            {selectedPeriodLabel}
          </p>

          <p className="mt-3 text-4xl font-semibold tracking-tight text-[#171717]">
            {periodBookings}
          </p>

          <p className="mt-2 text-sm text-[#6d6963]">
            booking{periodBookings === 1 ? "" : "s"}
          </p>
        </div>
      </section>

      <section className="border border-[#d8d2ca] bg-[#fcfaf7]">
        <div className="border-b border-[#d8d2ca] px-5 py-5 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b7866]">
            Calendar
          </p>

          <h2 className="mt-2 text-base font-semibold text-[#171717]">
            {calendarMonthLabel}
          </h2>

          <p className="mt-1 text-sm text-[#6d6963]">
            Booking schedule for the current month.
          </p>
          <p className="mt-1 text-xs text-[#8b7866] md:hidden">
            Monthly agenda
          </p>
        </div>

        {/* Desktop Calendar */}
        <div className="hidden md:block">
          <div className="grid grid-cols-7 border-b border-[#d8d2ca]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day) => (
                <div
                  key={day}
                  className="border-r border-[#e7e1da] px-3 py-3 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-[#8b7866] last:border-r-0"
                >
                  {day}
                </div>
              )
            )}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              if (!day) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-28 border-b border-r border-[#e7e1da] bg-[#f8f5f0]"
                  />
                );
              }

              const dayBookings = bookingsByDay.get(day) ?? [];

              return (
                <div
                  key={day}
                  className="min-h-28 border-b border-r border-[#e7e1da] p-3"
                >
                  <p className="text-xs font-medium text-[#171717]">
                    {day}
                  </p>

                  <div className="mt-2 space-y-1">
                    {dayBookings.slice(0, 3).map((booking) => (
                      <Link
                        key={booking.id}
                        href={`/admin/bookings/${booking.id}`}
                        className="block border-l-2 border-[#8b7866] bg-[#f6f3ee] px-2 py-1.5 transition-opacity hover:opacity-70"
                      >
                        <p className="truncate text-[11px] font-medium text-[#171717]">
                          {booking.clientName}
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#6d6963]">
                          {booking.bookingTime}
                        </p>
                      </Link>
                    ))}

                    {dayBookings.length > 3 && (
                      <p className="pt-1 text-[10px] text-[#6d6963]">
                        +{dayBookings.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Calendar */}
        <div className="divide-y divide-[#e7e1da] md:hidden">
          {calendarBookings.length === 0 ? (
            <div className="p-5">
              <p className="text-sm text-[#6d6963]">
                No bookings scheduled this month.
              </p>
            </div>
          ) : (
            Array.from(bookingsByDay.entries()).map(
              ([day, bookings]) => (
                <div key={day} className="p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    {new Date(
                      Date.UTC(calendarYear, calendarMonth, day)
                    ).toLocaleDateString("en-US", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      timeZone: "UTC",
                    })}
                  </p>

                  <div className="mt-3 space-y-2">
                    {bookings.map((booking) => (
                      <Link
                        key={booking.id}
                        href={`/admin/bookings/${booking.id}`}
                        className="flex items-center justify-between gap-4 border-l-2 border-[#8b7866] bg-[#f6f3ee] px-3 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#171717]">
                            {booking.clientName}
                          </p>

                          <p className="mt-1 text-xs text-[#6d6963]">
                            {booking.status}
                          </p>
                        </div>

                        <p className="shrink-0 text-xs text-[#6d6963]">
                          {booking.bookingTime}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {/* Upcoming Sessions */}
        <div className="border border-[#d8d2ca] bg-[#fcfaf7]">
          <div className="flex items-start justify-between gap-4 border-b border-[#d8d2ca] px-5 py-5 sm:px-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b7866]">
                Schedule
              </p>

              <h2 className="mt-2 text-base font-semibold text-[#171717]">
                Upcoming Sessions
              </h2>

              <p className="mt-1 text-sm text-[#6d6963]">
                Next confirmed photography sessions.
              </p>
            </div>

            <Link
              href="/admin/bookings?period=upcoming"
              className="shrink-0 text-sm font-medium text-[#171717] transition-opacity hover:opacity-60"
            >
              View all →
            </Link>
          </div>

          {upcomingSessions.length === 0 ? (
            <div className="px-6 py-12">
              <p className="text-sm text-[#6d6963]">
                No upcoming confirmed sessions.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#e7e1da]">
              {upcomingSessions.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/admin/bookings/${booking.id}`}
                  className="block p-5 transition-colors hover:bg-[#f6f3ee] sm:px-6"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <p className="font-medium text-[#171717]">
                        {booking.clientName}
                      </p>

                      <p className="mt-1 text-sm text-[#6d6963]">
                        {booking.package.name}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-medium text-[#171717]">
                        {booking.bookingDate.toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>

                      <p className="mt-1 text-xs text-[#6d6963]">
                        {booking.bookingTime}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Requires Attention */}
        <div className="border border-[#d8d2ca] bg-[#fcfaf7]">
          <div className="flex items-start justify-between gap-4 border-b border-[#d8d2ca] px-5 py-5 sm:px-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b7866]">
                Attention
              </p>

              <h2 className="mt-2 text-base font-semibold text-[#171717]">
                Requires Attention
              </h2>

              <p className="mt-1 text-sm text-[#6d6963]">
                New requests or upcoming sessions with pending payment.
              </p>
            </div>

            <Link
              href="/admin/bookings"
              className="shrink-0 text-sm font-medium text-[#171717] transition-opacity hover:opacity-60"
            >
              View all →
            </Link>
          </div>

          {attentionBookings.length === 0 ? (
            <div className="px-6 py-12">
              <p className="text-sm text-[#6d6963]">
                No bookings require attention.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#e7e1da]">
              {attentionBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/admin/bookings/${booking.id}`}
                  className="block p-5 transition-colors hover:bg-[#f6f3ee] sm:px-6"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-[#171717]">
                          {booking.clientName}
                        </p>

                        <span
                          className={`inline-flex border px-2 py-0.5 text-[10px] font-medium ${getStatusClasses(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-[#6d6963]">
                        {booking.package.name}
                      </p>

                      {booking.status === "CONFIRMED" &&
                        booking.paymentStatus !== "PAID" && (
                          <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-[#8b7866]">
                            {booking.paymentStatus === "UNPAID"
                              ? "Payment unpaid"
                              : "Payment partially paid"}
                          </p>
                        )}
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm text-[#171717]">
                        {booking.bookingDate.toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>

                      <p className="mt-1 text-xs text-[#6d6963]">
                        {booking.bookingTime}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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