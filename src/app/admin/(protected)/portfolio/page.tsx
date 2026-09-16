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
    include: {
      category: true,
    },
  });

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-5 border-b border-[#d8d2ca] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8b7866]">
            Portfolio Management
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#171717]">
            Portfolio
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d6963]">
            Manage published photography work, categories, locations, and
            display order.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 sm:justify-end">
          <Link
            href="/admin/portfolio/categories"
            className="border border-[#8b7866] bg-[#fcfaf7] px-4 py-2.5 text-sm font-medium text-[#171717] transition-colors hover:bg-[#f0ece6]"
          >
            Manage Categories
          </Link>

          <Link
            href="/admin/portfolio/new"
            className="bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85"
          >
            Add Portfolio
          </Link>
        </div>
      </header>

      {portfolios.length === 0 ? (
        <div className="border border-[#d8d2ca] bg-[#fcfaf7] px-6 py-14">
          <p className="text-sm text-[#6d6963]">
            No portfolio items found.
          </p>
        </div>
      ) : (
        <section className="border border-[#d8d2ca] bg-[#fcfaf7]">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#d8d2ca]">
                  <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Title
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Location
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Order
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Image
                  </th>

                  <th className="px-6 py-4 text-right text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {portfolios.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#e7e1da] last:border-b-0"
                  >
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-[#171717]">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs text-[#6d6963]">
                        {item.slug}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-[#6d6963]">
                      {item.category?.name || "—"}
                    </td>

                    <td className="px-6 py-5 text-sm text-[#6d6963]">
                      {item.location || "—"}
                    </td>

                    <td className="px-6 py-5">
                      {item.isPublished ? (
                        <span className="inline-flex border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                          PUBLISHED
                        </span>
                      ) : (
                        <span className="inline-flex border border-[#d8d2ca] bg-[#f6f3ee] px-2.5 py-1 text-[11px] font-medium text-[#6d6963]">
                          DRAFT
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5 text-sm text-[#6d6963]">
                      {item.displayOrder}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        <span className="border border-[#d8d2ca] bg-[#f6f3ee] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6d6963]">
                          {item.imageOrientation}
                        </span>

                        <span className="border border-[#d8d2ca] bg-[#f6f3ee] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6d6963]">
                          {item.imagePosition}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/admin/portfolio/${item.id}/edit`}
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
            {portfolios.map((item) => (
              <article key={item.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#171717]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-[#6d6963]">
                      {item.slug}
                    </p>
                  </div>

                  {item.isPublished ? (
                    <span className="inline-flex border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
                      PUBLISHED
                    </span>
                  ) : (
                    <span className="inline-flex border border-[#d8d2ca] bg-[#f6f3ee] px-2.5 py-1 text-[10px] font-medium text-[#6d6963]">
                      DRAFT
                    </span>
                  )}
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-[#e7e1da] pt-4">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-[#8b7866]">
                      Category
                    </dt>

                    <dd className="mt-1 text-sm text-[#6d6963]">
                      {item.category?.name || "—"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-[#8b7866]">
                      Order
                    </dt>

                    <dd className="mt-1 text-sm text-[#171717]">
                      {item.displayOrder}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-[#8b7866]">
                      Orientation
                    </dt>

                    <dd className="mt-1 text-sm text-[#171717]">
                      {item.imageOrientation}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-[#8b7866]">
                      Position
                    </dt>

                    <dd className="mt-1 text-sm text-[#171717]">
                      {item.imagePosition}
                    </dd>
                  </div>

                  <div className="col-span-2">
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-[#8b7866]">
                      Location
                    </dt>

                    <dd className="mt-1 text-sm text-[#6d6963]">
                      {item.location || "—"}
                    </dd>
                  </div>
                </dl>

                <Link
                  href={`/admin/portfolio/${item.id}/edit`}
                  className="mt-5 inline-block border-b border-[#171717] pb-1 text-sm font-medium text-[#171717]"
                >
                  Edit portfolio ↗
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}