import Link from "next/link";

import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "View available photography packages and session pricing.",
};

export default async function PackagesPage() {
  const packages = await prisma.package.findMany({
    where: {
      isActive: true,
    },
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
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
            Packages
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900">
            Photography Packages
          </h1>

          <p className="mt-4 max-w-2xl text-gray-600">
            Choose a photography package that fits your session needs.
          </p>
        </div>

        {packages.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
            <p className="text-gray-500">
              No photography packages are currently available.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((item) => (
              <article
                key={item.id}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6"
              >
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {item.name}
                  </h2>

                  <p className="mt-3 text-3xl font-semibold text-gray-900">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>

                  {item.duration && (
                    <p className="mt-2 text-sm text-gray-500">
                      Duration: {item.duration}
                    </p>
                  )}

                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>

                  {item.includedServices && (
                    <div className="mt-5">
                      <p className="text-sm font-medium text-gray-900">
                        Included
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {item.includedServices}
                      </p>
                    </div>
                  )}
                </div>

                <Link
                  href={`/booking?package=${item.id}`}
                  className="mt-6 inline-flex justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Book This Package
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}