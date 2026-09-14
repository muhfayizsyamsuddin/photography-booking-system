import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

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

export default async function HomePage() {
  const [packages, portfolios] = await Promise.all([
    prisma.package.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      take: 3,
    }),

    prisma.portfolio.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
      take: 7,
    }),
  ]);

  const heroPortfolio = portfolios[0];
  const selectedPortfolios = portfolios.slice(1, 7);

  return (
    <main>
      <section className="bg-[#f6f3ee]">
        <div className="mx-auto grid min-h-[calc(100vh-65px)] max-w-7xl lg:grid-cols-[0.7fr_1.3fr]">
          <div className="flex items-center px-6 py-16 lg:px-10 lg:py-20">
            <div className="max-w-xl">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8b7866]">
                Photographer · Makassar
              </p>

              <h1 className="mt-7 font-serif text-[3.8rem] leading-[0.88] tracking-[-0.04em] text-[#171717] sm:text-7xl lg:text-[6.4rem]">
                Stories worth
                <br />
                remembering.
              </h1>

              <p className="mt-8 max-w-md text-[15px] leading-7 text-[#6d6963]">
                Honest, timeless photography for graduations, weddings,
                couples, families, and meaningful celebrations.
              </p>

              <div className="mt-10 flex items-center gap-7">
                <Link
                  href="/booking"
                  className="border-b border-[#171717] pb-1 text-sm font-medium"
                >
                  Book a session ↗
                </Link>

                <Link
                  href="/portfolio"
                  className="text-sm text-[#6d6963] transition hover:text-[#171717]"
                >
                  View portfolio
                </Link>
              </div>
              <div className="mt-16 flex items-center gap-5 text-[10px] uppercase tracking-[0.18em] text-[#8b7866]">
                <span>Makassar</span>
                <span className="h-px w-8 bg-[#bfb7ae]" />
                <span>Graduation · Wedding · Portrait</span>
              </div>
            </div>
          </div>

          <div className="relative px-0 lg:py-6 lg:pr-6">
            {/* <div className="absolute inset-y-10 right-0 hidden w-px bg-[#d8d2ca] lg:block" /> */}

            <div className="relative">
              <div className="absolute -bottom-4 -right-4 hidden h-full w-full border border-[#d8d2ca] lg:block" />

              <div className="relative min-h-130 overflow-hidden border border-[#d8d2ca] lg:min-h-[calc(90vh-124px)]">
                {heroPortfolio ? (
                  <Image
                    src={heroPortfolio.imageUrl}
                    alt={heroPortfolio.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className={`object-cover ${getImagePosition(
                      heroPortfolio.imagePosition
                    )}`}
                  />
                ) : (
                  <div className="h-full bg-[#ded8d0]" />
                )}
              </div>
              <p className="mt-3 text-right text-[10px] uppercase tracking-[0.18em] text-[#8b7866]">
                Selected Portrait · Makassar
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#d8d2ca] bg-[#fcfaf7]">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 lg:px-10 lg:pb-32 lg:pt-20">
          <div className="mb-14 grid gap-8 border-b border-[#d8d2ca] pb-10 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8b7866]">
                Selected Work
              </p>

              <h2 className="mt-5 max-w-2xl font-serif text-5xl leading-[0.95] tracking-[-0.03em] text-[#171717] md:text-6xl">
                A few stories,
                <br />
                carefully preserved.
              </h2>
            </div>

            <Link
              href="/portfolio"
              className="self-start border-b border-[#171717] pb-1 text-sm font-medium md:self-end"
            >
              View all work ↗
            </Link>
          </div>

          {selectedPortfolios.length === 0 ? (
            <p className="text-sm text-[#6d6963]">
              Portfolio is currently unavailable.
            </p>
          ) : (
            <div className="grid gap-10 md:grid-cols-12">
              {selectedPortfolios.map((item, index) => {
                const isLarge = index % 3 === 0;
                return (
                  <article
                    key={item.id}
                    className={
                      isLarge
                        ? "md:col-span-7"
                        : "md:col-span-5 md:pt-20"
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
                        sizes={
                          isLarge
                            ? "(max-width: 768px) 100vw, 58vw"
                            : "(max-width: 768px) 100vw, 42vw"
                        }
                        className={`object-cover ${getImagePosition(
                          item.imagePosition
                        )}`}
                      />
                    </div>

                    <div className="mt-5 flex items-start justify-between gap-6 border-t border-[#d8d2ca] pt-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[#8b7866]">
                          {item.photographyType ?? "Photography"}
                        </p>

                        <h3 className="mt-2 font-serif text-2xl text-[#171717]">
                          {item.title}
                        </h3>

                        {item.location && (
                          <p className="mt-2 text-sm text-[#6d6963]">
                            {item.location}
                          </p>
                        )}
                      </div>

                      <span className="text-xs text-[#8b7866]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-[#d8d2ca] bg-[#f6f3ee]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8b7866]">
                Services
              </p>

              <h2 className="mt-5 max-w-sm font-serif text-5xl leading-[0.95] tracking-[-0.03em] text-[#171717]">
                Photography for the moments that matter.
              </h2>

              <p className="mt-6 max-w-sm text-[15px] leading-7 text-[#6d6963]">
                Simple packages designed for meaningful sessions, from graduation
                portraits to intimate celebrations.
              </p>

              <Link
                href="/packages"
                className="mt-8 inline-block border-b border-[#171717] pb-1 text-sm font-medium"
              >
                Explore all services ↗
              </Link>
            </div>

            <div className="border-t border-[#d8d2ca]">
              {packages.map((item, index) => (
                <article
                  key={item.id}
                  className="grid gap-5 border-b border-[#d8d2ca] py-8 md:grid-cols-[80px_1fr_auto]"
                >
                  <div className="text-xs tracking-[0.2em] text-[#8b7866]">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div>
                    <h3 className="font-serif text-3xl text-[#171717]">
                      {item.name}
                    </h3>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-[#6d6963]">
                      {item.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.12em] text-[#8b7866]">
                      {item.duration && (
                        <span>{item.duration}</span>
                      )}

                      {item.includedServices && (
                        <p className="mt-4 max-w-xl text-xs uppercase tracking-[0.12em] text-[#8b7866] line-clamp-2">
                          {item.includedServices}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-6 md:flex-col md:items-end">
                    <p className="font-serif text-2xl text-[#171717]">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>

                    <Link
                      href={`/booking?package=${item.id}`}
                      className="border-b border-[#171717] pb-1 text-sm font-medium"
                    >
                      Book ↗
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#d8d2ca] bg-[#fcfaf7]">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-10 lg:py-32">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8b7866]">
            Let&apos;s Create
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl font-serif text-5xl leading-[0.95] tracking-[-0.03em] text-[#171717] md:text-6xl">
            Something memorable,
            <br />
            made together.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-7 text-[#6d6963]">
            Planning a graduation, wedding, couple session, or family shoot?
            Tell me what you have in mind.
          </p>

          <div className="mt-8 flex items-center justify-center gap-7">
            <Link
              href="/booking"
              className="border-b border-[#171717] pb-1 text-sm font-medium"
            >
              Book your session ↗
            </Link>

            <Link
              href="/contact"
              className="text-sm text-[#6d6963] transition hover:text-[#171717]"
            >
              Contact me
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}