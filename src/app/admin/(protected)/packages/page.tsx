import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function AdminPackagesPage() {
  const packages = await prisma.package.findMany({
    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    include: {
      _count: {
        select: {
          bookings: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Packages
          </h1>

          <p className="mt-2 text-gray-600">
            Manage photography packages.
          </p>
        </div>

        <Link
          href="/admin/packages/new"
          className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white"
        >
          Add Package
        </Link>
      </div>

      {packages.length === 0 ? (
        <div className="rounded-lg border bg-white p-6">
          <p className="text-gray-500">
            No packages found.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Package
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Price
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Bookings
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {packages.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-b-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.slug}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    Rp {item.price.toLocaleString("id-ID")}
                  </td>

                  <td className="px-4 py-3">
                    {item.isActive ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {item._count.bookings}
                  </td>

                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/packages/${item.id}/edit`}
                      className="text-sm font-medium text-gray-900 hover:underline"
                    >
                      Edit
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