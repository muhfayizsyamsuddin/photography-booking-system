import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import BookingStatusForm from "./status-form";

type BookingDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

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

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/bookings"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to bookings
        </Link>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Booking Detail
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">
              Client Information
            </h2>

            <div className="space-y-3 text-sm">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {booking.clientName}
              </p>

              <p>
                <span className="font-medium">Phone:</span>{" "}
                {booking.phone}
              </p>

              <p>
                <span className="font-medium">Email:</span>{" "}
                {booking.email || "-"}
              </p>

              <p>
                <span className="font-medium">Location:</span>{" "}
                {booking.location}
              </p>

              <p>
                <span className="font-medium">Notes:</span>{" "}
                {booking.notes || "-"}
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">
              Booking Information
            </h2>

            <div className="space-y-3 text-sm">
              <p>
                <span className="font-medium">Package:</span>{" "}
                {booking.package.name}
              </p>

              <p>
                <span className="font-medium">Date:</span>{" "}
                {booking.bookingDate.toLocaleDateString("id-ID")}
              </p>

              <p>
                <span className="font-medium">Time:</span>{" "}
                {booking.bookingTime}
              </p>

              <p>
                <span className="font-medium">Status:</span>{" "}
                {booking.status}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">
              Update Status
            </h2>

            <BookingStatusForm
              bookingId={booking.id}
              currentStatus={booking.status}
            />
          </div>
        </div>
      </div>
    </div>
  );
}