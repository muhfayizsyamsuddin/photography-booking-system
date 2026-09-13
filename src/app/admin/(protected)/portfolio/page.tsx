import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function AdminPortfolioPage() {
  const portfolios = await prisma.portfolio.findMany({
    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Portfolio
          </h1>

          <p className="mt-2 text-gray-600">
            Manage photography portfolio content.
          </p>
        </div>

        <Link
          href="/admin/portfolio/new"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Add Portfolio
        </Link>
      </div>

      {portfolios.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8">
          <p className="text-sm text-gray-500">
            No portfolio items found.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Title
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Type
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Location
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Order
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {portfolios.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">
                      {item.title}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.slug}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.photographyType || "-"}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.location || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {item.isPublished ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        Draft
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.displayOrder}
                  </td>

                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/portfolio/${item.id}/edit`}
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