import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore selected photography sessions and client work.",
};

function getImageAspect(orientation: string) {
  switch (orientation) {
    case "LANDSCAPE":
      return "aspect-4/3";

    case "SQUARE":
      return "aspect-square";

    case "PORTRAIT":
    default:
      return "aspect-3/4";
  }
}

function getImagePosition(position: string) {
  switch (position) {
    case "TOP":
      return "object-top";

    case "BOTTOM":
      return "object-bottom";

    case "CENTER":
    default:
      return "object-center";
  }
}

type PortfolioPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function PortfolioPage({
  searchParams,
}: PortfolioPageProps) {
  const { category } = await searchParams;

  const [categories, portfolios] = await Promise.all([
    prisma.portfolioCategory.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        {
          displayOrder: "asc",
        },
        {
          name: "asc",
        },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),

    prisma.portfolio.findMany({
      where: {
        isPublished: true,
        ...(category && {
          category: {
            slug: category,
            isActive: true,
          },
        }),
      },
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
    }),
  ]);

  return (
    <main className="bg-[#f6f3ee]">
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-10 lg:pb-24 lg:pt-28">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8b7866]">
          Portfolio
        </p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <h1 className="max-w-3xl font-serif text-5xl leading-[0.95] tracking-[-0.03em] text-[#171717] md:text-6xl lg:text-7xl">
            Selected stories,
            <br />
            quietly preserved.
          </h1>

          <p className="max-w-md text-[15px] leading-7 text-[#6d6963] lg:justify-self-end">
            A collection of graduation sessions, portraits, celebrations,
            and moments documented with a simple and timeless approach.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14 lg:px-10 lg:pb-20">
        <div className="flex flex-wrap gap-x-6 gap-y-3 border-y border-[#d8d2ca] py-5">
          <Link
            href="/portfolio"
            className={`text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
              !category
                ? "text-[#171717]"
                : "text-[#8b7866] hover:text-[#171717]"
            }`}
          >
            All
          </Link>

          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/portfolio?category=${item.slug}`}
              className={`text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
                category === item.slug
                  ? "text-[#171717]"
                  : "text-[#8b7866] hover:text-[#171717]"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-10 lg:pb-36">
        {portfolios.length === 0 ? (
          <div className="border-t border-[#d8d2ca] py-16">
            <p className="text-sm text-[#6d6963]">
              {category
                ? "No portfolio items found in this category."
                : "Portfolio is currently unavailable."}
            </p>
          </div>
        ) : (
          <div className="space-y-24 lg:space-y-32">
            {portfolios.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <article
                  key={item.id}
                  className={`grid gap-8 lg:grid-cols-12 ${
                    isEven ? "" : "lg:[&>*:first-child]:order-2"
                  }`}
                >
                  <div
                    className={
                      isEven
                        ? "lg:col-span-8"
                        : "lg:col-span-7 lg:col-start-6"
                    }
                  >
                    <div
                      className={`relative overflow-hidden ${getImageAspect(
                        item.imageOrientation
                      )}`}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 65vw"
                        className={`object-cover ${getImagePosition(
                          item.imagePosition
                        )}`}
                      />
                    </div>
                  </div>

                  <div
                    className={`flex flex-col justify-end ${
                      isEven
                        ? "lg:col-span-4 lg:pl-6"
                        : "lg:col-span-5 lg:pr-10"
                    }`}
                  >
                    <div className="border-t border-[#d8d2ca] pt-5">
                      <div className="flex items-center justify-between gap-6">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#8b7866]">
                          {item.category?.name ?? "Photography"}
                        </p>

                        <span className="text-xs text-[#8b7866]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h2 className="mt-4 font-serif text-3xl leading-tight text-[#171717]">
                        {item.title}
                      </h2>

                      {item.location && (
                        <p className="mt-3 text-sm text-[#6d6963]">
                          {item.location}
                        </p>
                      )}

                      {item.description && (
                        <p className="mt-5 max-w-md text-sm leading-7 text-[#6d6963]">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}