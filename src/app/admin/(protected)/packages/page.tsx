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
    <div className="space-y-10">
      <header className="flex flex-col gap-5 border-b border-[#d8d2ca] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8b7866]">
            Service Management
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#171717]">
            Packages
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d6963]">
            Manage photography packages, pricing, availability, and booking usage.
          </p>
        </div>

        <Link
          href="/admin/packages/new"
          className="self-start bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 sm:self-auto"
        >
          Add Package
        </Link>
      </header>

      {packages.length === 0 ? (
        <div className="border border-[#d8d2ca] bg-[#fcfaf7] px-6 py-14">
          <p className="text-sm text-[#6d6963]">
            No packages found.
          </p>
        </div>
      ) : (
        <section className="border border-[#d8d2ca] bg-[#fcfaf7]">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#d8d2ca]">
                  <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Package
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Bookings
                  </th>

                  <th className="px-6 py-4 text-right text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {packages.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#e7e1da] last:border-b-0"
                  >
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-[#171717]">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-[#6d6963]">
                        {item.slug}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-[#6d6963]">
                      Rp {item.price.toLocaleString("id-ID")}
                    </td>

                    <td className="px-6 py-5">
                      {item.isActive ? (
                        <span className="inline-flex border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex border border-[#d8d2ca] bg-[#f6f3ee] px-2.5 py-1 text-[11px] font-medium text-[#6d6963]">
                          INACTIVE
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5 text-sm text-[#6d6963]">
                      {item._count.bookings}
                    </td>

                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/admin/packages/${item.id}/edit`}
                        className="text-sm font-medium text-[#171717] transition-opacity hover:opacity-60"
                      >
                        Edit ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-[#d8d2ca] md:hidden">
            {packages.map((item) => (
              <article key={item.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#171717]">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-[#6d6963]">
                      {item.slug}
                    </p>
                  </div>

                  {item.isActive ? (
                    <span className="inline-flex border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="inline-flex border border-[#d8d2ca] bg-[#f6f3ee] px-2.5 py-1 text-[10px] font-medium text-[#6d6963]">
                      INACTIVE
                    </span>
                  )}
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-[#e7e1da] pt-4">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-[#8b7866]">
                      Price
                    </dt>

                    <dd className="mt-1 text-sm text-[#171717]">
                      Rp {item.price.toLocaleString("id-ID")}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-[#8b7866]">
                      Bookings
                    </dt>

                    <dd className="mt-1 text-sm text-[#171717]">
                      {item._count.bookings}
                    </dd>
                  </div>
                </dl>

                <Link
                  href={`/admin/packages/${item.id}/edit`}
                  className="mt-5 inline-block border-b border-[#171717] pb-1 text-sm font-medium text-[#171717]"
                >
                  Edit package ↗
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}