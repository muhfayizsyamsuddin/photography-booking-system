import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [packages, portfolios] = await Promise.all([
    prisma.package.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
      take: 3,
    }),

    prisma.portfolio.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
      take: 6,
    }),
  ]);

  return (
    <main>
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
              Photography Services
            </p>

            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-gray-900">
              Capture moments worth remembering.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Professional photography for graduation, weddings,
              couples, families, and special events.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/booking"
                className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                Book a Session
              </Link>

              <Link
                href="/portfolio"
                className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
              Packages
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-gray-900">
              Photography packages
            </h2>
          </div>

          <Link
            href="/packages"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            View all →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {packages.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {item.name}
              </h3>

              <p className="mt-3 text-2xl font-semibold text-gray-900">
                Rp {item.price.toLocaleString("id-ID")}
              </p>

              <p className="mt-4 text-sm leading-6 text-gray-600">
                {item.description}
              </p>

              <Link
                href={`/booking?package=${item.id}`}
                className="mt-6 inline-flex text-sm font-medium text-gray-900 hover:underline"
              >
                Book this package →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
                Portfolio
              </p>

              <h2 className="mt-3 text-3xl font-semibold text-gray-900">
                Recent work
              </h2>
            </div>

            <Link
              href="/portfolio"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              View all →
            </Link>
          </div>

          {portfolios.length === 0 ? (
            <p className="text-gray-500">
              Portfolio is currently unavailable.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  <div className="aspect-4/3 overflow-hidden bg-gray-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      {item.photographyType ?? "Photography"}
                    </p>

                    <h3 className="mt-2 font-semibold text-gray-900">
                      {item.title}
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}