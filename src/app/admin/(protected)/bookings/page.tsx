import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      package: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Bookings
        </h1>

        <p className="mt-2 text-gray-600">
          Manage photography booking requests.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-lg border bg-white p-6">
          <p className="text-gray-500">
            No bookings found.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Package
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b last:border-b-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">
                      {booking.clientName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {booking.phone}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {booking.package.name}
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {booking.bookingDate.toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
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
  );
}