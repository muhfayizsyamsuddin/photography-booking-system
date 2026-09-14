import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import BookingStatusForm from "./status-form";

type BookingDetailPageProps = {
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

export default async function BookingDetailPage({
  params,
}: BookingDetailPageProps) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: {
      id,
    },
    include: {
      package: true,
    },
  });

  if (!booking) {
    notFound();
  }

  const rawPhone = booking.phone.replace(/\D/g, "");

  const whatsappNumber = rawPhone.startsWith("0")
    ? `62${rawPhone.slice(1)}`
    : rawPhone;

  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  const emailUrl = booking.email
    ? `mailto:${booking.email}`
    : null;

  return (
    <div className="space-y-10">
      <header className="border-b border-[#d8d2ca] pb-8">
        <Link
          href="/admin/bookings"
          className="text-sm text-[#6d6963] transition-colors hover:text-[#171717]"
        >
          ← Back to bookings
        </Link>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8b7866]">
              Booking Detail
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#171717]">
              {booking.clientName}
            </h1>

            <p className="mt-2 text-sm text-[#6d6963]">
              {booking.package.name}
            </p>
          </div>

          <span
            className={`self-start border px-3 py-1.5 text-xs font-medium sm:self-auto ${getStatusClasses(
              booking.status
            )}`}
          >
            {booking.status}
          </span>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section className="border border-[#d8d2ca] bg-[#fcfaf7]">
            <div className="border-b border-[#d8d2ca] px-5 py-4 sm:px-6">
              <h2 className="font-semibold text-[#171717]">
                Client Information
              </h2>
            </div>

            <dl className="grid gap-0 sm:grid-cols-2">
              <div className="border-b border-[#e7e1da] p-5 sm:border-r sm:p-6">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8b7866]">
                  Name
                </dt>

                <dd className="mt-2 text-sm text-[#171717]">
                  {booking.clientName}
                </dd>
              </div>

              <div className="border-b border-[#e7e1da] p-5 sm:p-6">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8b7866]">
                  Phone
                </dt>

                <dd className="mt-2 text-sm text-[#171717]">
                  {booking.phone}
                </dd>
              </div>

              <div className="border-b border-[#e7e1da] p-5 sm:border-r sm:p-6">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8b7866]">
                  Email
                </dt>

                <dd className="mt-2 wrap-break-word text-sm text-[#171717]">
                  {booking.email || "—"}
                </dd>
              </div>

              <div className="border-b border-[#e7e1da] p-5 sm:p-6">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8b7866]">
                  Location
                </dt>

                <dd className="mt-2 text-sm leading-6 text-[#171717]">
                  {booking.location}
                </dd>
              </div>

              <div className="p-5 sm:col-span-2 sm:p-6">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8b7866]">
                  Notes
                </dt>

                <dd className="mt-2 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-[#6d6963]">
                  {booking.notes || "No additional notes."}
                </dd>
              </div>
            </dl>
          </section>

          <section className="border border-[#d8d2ca] bg-[#fcfaf7]">
            <div className="border-b border-[#d8d2ca] px-5 py-4 sm:px-6">
              <h2 className="font-semibold text-[#171717]">
                Session Information
              </h2>
            </div>

            <dl className="grid sm:grid-cols-2">
              <div className="border-b border-[#e7e1da] p-5 sm:border-r sm:p-6">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8b7866]">
                  Package
                </dt>

                <dd className="mt-2 text-sm font-medium text-[#171717]">
                  {booking.package.name}
                </dd>
              </div>

              <div className="border-b border-[#e7e1da] p-5 sm:p-6">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8b7866]">
                  Date
                </dt>

                <dd className="mt-2 text-sm text-[#171717]">
                  {booking.bookingDate.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </div>

              <div className="p-5 sm:border-r sm:p-6">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8b7866]">
                  Time
                </dt>

                <dd className="mt-2 text-sm text-[#171717]">
                  {booking.bookingTime}
                </dd>
              </div>

              <div className="border-t border-[#e7e1da] p-5 sm:border-t-0 sm:p-6">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8b7866]">
                  Current Status
                </dt>

                <dd className="mt-2">
                  <span
                    className={`inline-flex border px-2.5 py-1 text-[11px] font-medium ${getStatusClasses(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="border border-[#d8d2ca] bg-[#fcfaf7]">
            <div className="border-b border-[#d8d2ca] px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b7866]">
                Client Contact
              </p>

              <h2 className="mt-2 font-semibold text-[#171717]">
                Contact Client
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#6d6963]">
                Reach out to the client regarding this booking request.
              </p>
            </div>

            <div className="space-y-3 p-5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#171717] px-4 py-2.5 text-center text-sm font-medium text-white transition-opacity hover:opacity-85"
              >
                Contact via WhatsApp ↗
              </a>

              {emailUrl && (
                <a
                  href={emailUrl}
                  className="block w-full border border-[#d8d2ca] px-4 py-2.5 text-center text-sm font-medium text-[#171717] transition-colors hover:bg-[#f6f3ee]"
                >
                  Send Email ↗
                </a>
              )}
            </div>
          </div>

          <div className="border border-[#d8d2ca] bg-[#fcfaf7] lg:sticky lg:top-8">
            <div className="border-b border-[#d8d2ca] px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b7866]">
                Management
              </p>

              <h2 className="mt-2 font-semibold text-[#171717]">
                Update Status
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#6d6963]">
                Change the booking state as the session progresses.
              </p>
            </div>

            <div className="p-5">
              <BookingStatusForm
                bookingId={booking.id}
                currentStatus={booking.status}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}