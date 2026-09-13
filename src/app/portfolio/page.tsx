import { prisma } from "@/lib/prisma";

export default async function PortfolioPage() {
  const portfolios = await prisma.portfolio.findMany({
    where: {
      isPublished: true,
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
            Portfolio
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900">
            Selected Photography Work
          </h1>

          <p className="mt-4 max-w-2xl text-gray-600">
            A collection of selected photography sessions and client work.
          </p>
        </div>

        {portfolios.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
            <p className="text-gray-500">
              Portfolio is currently unavailable.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="aspect-4/3 overflow-hidden bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="p-5">
                  {item.photographyType && (
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      {item.photographyType}
                    </p>
                  )}

                  <h2 className="mt-2 text-lg font-semibold text-gray-900">
                    {item.title}
                  </h2>

                  {item.location && (
                    <p className="mt-1 text-sm text-gray-500">
                      {item.location}
                    </p>
                  )}

                  {item.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                      {item.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}