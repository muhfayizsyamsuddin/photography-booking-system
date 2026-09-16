import Link from "next/link";
import { notFound } from "next/navigation";
import ClientNotesForm from "./client-notes-form";
import { prisma } from "@/lib/prisma";

type ClientDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

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

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: {
      id,
    },
    include: {
      bookings: {
        include: {
          package: true,
        },
        orderBy: {
          bookingDate: "desc",
        },
      },
    },
  });

  if (!client) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <header className="border-b border-[#d8d2ca] pb-8">
        <Link
          href="/admin/clients"
          className="text-sm text-[#6d6963] transition-colors hover:text-[#171717]"
        >
          ← Back to clients
        </Link>

        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8b7866]">
            Client Detail
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#171717]">
            {client.name}
          </h1>

          <p className="mt-2 text-sm text-[#6d6963]">
            {client.bookings.length} booking(s)
          </p>
        </div>
      </header>

      <section className="border border-[#d8d2ca] bg-[#fcfaf7]">
        <div className="border-b border-[#d8d2ca] px-5 py-4 sm:px-6">
          <h2 className="font-semibold text-[#171717]">
            Client Information
          </h2>
        </div>

        <dl className="grid sm:grid-cols-2">
          <div className="border-b border-[#e7e1da] p-5 sm:border-r sm:p-6">
            <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8b7866]">
              Name
            </dt>

            <dd className="mt-2 text-sm text-[#171717]">
              {client.name}
            </dd>
          </div>

          <div className="border-b border-[#e7e1da] p-5 sm:p-6">
            <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8b7866]">
              Phone
            </dt>

            <dd className="mt-2 text-sm text-[#171717]">
              {client.phone}
            </dd>
          </div>

          <div className="p-5 sm:border-r sm:p-6">
            <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8b7866]">
              Email
            </dt>

            <dd className="mt-2 wrap-break-word text-sm text-[#171717]">
              {client.email || "—"}
            </dd>
          </div>

          <div className="border-t border-[#e7e1da] p-5 sm:border-t-0 sm:p-6">
            <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8b7866]">
              Total Bookings
            </dt>

            <dd className="mt-2 text-sm text-[#171717]">
              {client.bookings.length}
            </dd>
          </div>
        </dl>
      </section>

      <section className="border border-[#d8d2ca] bg-[#fcfaf7]">
        <div className="border-b border-[#d8d2ca] px-5 py-4 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b7866]">
            Internal
          </p>

          <h2 className="mt-2 font-semibold text-[#171717]">
            Client Notes
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#6d6963]">
            Private notes for internal reference.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <ClientNotesForm
            clientId={client.id}
            initialNotes={client.notes}
          />
        </div>
      </section>

      <section className="border border-[#d8d2ca] bg-[#fcfaf7]">
        <div className="border-b border-[#d8d2ca] px-5 py-4 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b7866]">
            History
          </p>

          <h2 className="mt-2 font-semibold text-[#171717]">
            Booking History
          </h2>
        </div>

        {client.bookings.length === 0 ? (
          <div className="px-6 py-14">
            <p className="text-sm text-[#6d6963]">
              No booking history found.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#d8d2ca]">
                    <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                      Package
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
                  {client.bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-[#e7e1da] last:border-b-0"
                    >
                      <td className="px-6 py-5 text-sm text-[#6d6963]">
                        {booking.bookingDate.toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-5 text-sm text-[#6d6963]">
                        {booking.package.name}
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
              {client.bookings.map((booking) => (
                <article key={booking.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-[#171717]">
                        {booking.package.name}
                      </p>

                      <p className="mt-1 text-xs text-[#6d6963]">
                        {booking.bookingDate.toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
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