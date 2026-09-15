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

type AdminBookingsPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    packageId?: string;
    date?: string;
    period?: string;
  }>;
};

export default async function AdminBookingsPage({
  searchParams,
}: AdminBookingsPageProps) {
  const {
    search = "",
    status = "",
    packageId = "",
    date = "",
    period = "",
  } = await searchParams;

  const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = date
      ? new Date(`${date}T00:00:00.000Z`)
      : null;

  const packages = await prisma.package.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  const bookings = await prisma.booking.findMany({
    where: {
      ...(search
        ? {
            OR: [
              {
                clientName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                phone: {
                  contains: search,
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),

      ...(status &&
      ["NEW", "CONFIRMED", "COMPLETED", "CANCELLED"].includes(status)
        ? {
            status: status as
              | "NEW"
              | "CONFIRMED"
              | "COMPLETED"
              | "CANCELLED",
          }
        : {}),

      ...(packageId
        ? {
            packageId,
          }
        : {}),

      ...(selectedDate
        ? {
            bookingDate: selectedDate,
          }
        : {}),

      ...(period === "upcoming"
        ? {
            bookingDate: {
              gte: today,
            },
          }
        : {}),

      ...(period === "past"
        ? {
            bookingDate: {
              lt: today,
            },
          }
        : {}),
    },

    include: {
      package: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-10">
      <header className="border-b border-[#d8d2ca] pb-8">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8b7866]">
          Booking Management
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#171717]">
          Bookings
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d6963]">
          Review and manage photography booking requests from clients.
        </p>
      </header>

      <form
        method="GET"
        className="grid gap-4 border border-[#d8d2ca] bg-[#fcfaf7] p-5 md:grid-cols-2 xl:grid-cols-[1.2fr_180px_220px_180px_180px_auto]"
      >
        <div>
          <label
            htmlFor="search"
            className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
          >
            Search
          </label>

          <input
            id="search"
            name="search"
            type="search"
            defaultValue={search}
            placeholder="Name, phone, or email"
            className="mt-2 w-full border border-[#d8d2ca] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors focus:border-[#8b7866]"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            defaultValue={status}
            className="mt-2 w-full border border-[#d8d2ca] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors focus:border-[#8b7866]"
          >
            <option value="">All statuses</option>
            <option value="NEW">New</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="packageId"
            className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
          >
            Package
          </label>

          <select
            id="packageId"
            name="packageId"
            defaultValue={packageId}
            className="mt-2 w-full border border-[#d8d2ca] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors focus:border-[#8b7866]"
          >
            <option value="">All packages</option>

            {packages.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="date"
            className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
          >
            Date
          </label>

          <input
            id="date"
            name="date"
            type="date"
            defaultValue={date}
            className="mt-2 w-full border border-[#d8d2ca] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors focus:border-[#8b7866]"
          />
        </div>

        <div>
          <label
            htmlFor="period"
            className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
          >
            Period
          </label>

          <select
            id="period"
            name="period"
            defaultValue={period}
            className="mt-2 w-full border border-[#d8d2ca] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors focus:border-[#8b7866]"
          >
            <option value="">All periods</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>

        <div className="flex items-end gap-3">
          <button
            type="submit"
            className="cursor-pointer bg-[#171717] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85"
          >
            Apply
          </button>

          {(search || status || packageId || date || period) && (
            <Link
              href="/admin/bookings"
              className="px-2 py-2.5 text-sm font-medium text-[#6d6963] transition-colors hover:text-[#171717]"
            >
              Reset
            </Link>
          )}
        </div>
      </form>

      {bookings.length === 0 ? (
        <div className="border border-[#d8d2ca] bg-[#fcfaf7] px-6 py-14">
          <p className="text-sm text-[#6d6963]">
            No bookings found.
          </p>
        </div>
      ) : (
        <section className="border border-[#d8d2ca] bg-[#fcfaf7]">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#d8d2ca]">
                  <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Client
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Package
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Session Date
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
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
            {bookings.map((booking) => (
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
        </section>
      )}
    </div>
  );
}