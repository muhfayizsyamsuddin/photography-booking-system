import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Services",
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
    <main className="bg-[#f6f3ee]">
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-10 lg:pb-24 lg:pt-28">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8b7866]">
          Services
        </p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <h1 className="max-w-3xl font-serif text-5xl leading-[0.95] tracking-[-0.03em] text-[#171717] md:text-6xl lg:text-7xl">
            Thoughtful sessions,
            <br />
            simply arranged.
          </h1>

          <p className="max-w-md text-[15px] leading-7 text-[#6d6963] lg:justify-self-end">
            Choose a session that fits what you&apos;re planning. Every package
            is designed to stay clear, flexible, and focused on the moments that
            matter.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-10 lg:pb-36">
        {packages.length === 0 ? (
          <div className="border-t border-[#d8d2ca] py-16">
            <p className="text-sm text-[#6d6963]">
              No photography packages are currently available.
            </p>
          </div>
        ) : (
          <div className="border-t border-[#d8d2ca]">
            {packages.map((item, index) => (
              <article
                key={item.id}
                className="grid gap-8 border-b border-[#d8d2ca] py-12 lg:grid-cols-[90px_1fr_0.7fr_auto]"
              >
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#8b7866]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div>
                  <h2 className="font-serif text-3xl leading-tight text-[#171717] md:text-4xl">
                    {item.name}
                  </h2>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-[#6d6963]">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-6">
                  {item.duration && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#8b7866]">
                        Duration
                      </p>

                      <p className="mt-2 text-sm text-[#171717]">
                        {item.duration}
                      </p>
                    </div>
                  )}

                  {item.includedServices && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#8b7866]">
                        Includes
                      </p>

                      <p className="mt-2 max-w-md text-sm leading-6 text-[#6d6963]">
                        {item.includedServices}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-end justify-between gap-6 lg:flex-col lg:items-end">
                  <p className="font-serif text-2xl text-[#171717] md:text-3xl">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>

                  <Link
                    href={`/booking?package=${item.id}`}
                    className="border-b border-[#171717] pb-1 text-sm font-medium text-[#171717]"
                  >
                    Book session ↗
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}