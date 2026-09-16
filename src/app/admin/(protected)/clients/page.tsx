import Link from "next/link";

import { prisma } from "@/lib/prisma";

type AdminClientsPageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function AdminClientsPage({
  searchParams,
}: AdminClientsPageProps) {
  const { search = "" } = await searchParams;

  const clients = await prisma.client.findMany({
    where: search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              phone: {
                contains: search,
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,

    include: {
      _count: {
        select: {
          bookings: true,
        },
      },
    },

    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="space-y-10">
      <header className="border-b border-[#d8d2ca] pb-8">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8b7866]">
          Client Management
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#171717]">
          Clients
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d6963]">
          View client contact information and booking history.
        </p>
      </header>

      <form
        method="GET"
        className="flex flex-col gap-3 border border-[#d8d2ca] bg-[#fcfaf7] p-5 sm:flex-row"
      >
        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Search name, phone, or email"
          className="w-full border border-[#d8d2ca] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors focus:border-[#8b7866]"
        />

        <button
          type="submit"
          className="cursor-pointer bg-[#171717] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85"
        >
          Search
        </button>

        {search && (
          <Link
            href="/admin/clients"
            className="px-3 py-2.5 text-center text-sm font-medium text-[#6d6963] transition-colors hover:text-[#171717]"
          >
            Reset
          </Link>
        )}
      </form>

      {clients.length === 0 ? (
        <div className="border border-[#d8d2ca] bg-[#fcfaf7] px-6 py-14">
          <p className="text-sm text-[#6d6963]">
            No clients found.
          </p>
        </div>
      ) : (
        <section className="border border-[#d8d2ca] bg-[#fcfaf7]">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#d8d2ca]">
                  <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Client
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                    Email
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
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-[#e7e1da] last:border-b-0"
                  >
                    <td className="px-6 py-5 text-sm font-medium text-[#171717]">
                      {client.name}
                    </td>

                    <td className="px-6 py-5 text-sm text-[#6d6963]">
                      {client.phone}
                    </td>

                    <td className="px-6 py-5 text-sm text-[#6d6963]">
                      {client.email || "—"}
                    </td>

                    <td className="px-6 py-5 text-sm text-[#6d6963]">
                      {client._count.bookings}
                    </td>

                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/admin/clients/${client.id}`}
                        className="text-sm font-medium text-[#171717] transition-opacity hover:opacity-60"
                      >
                        View ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-[#d8d2ca] md:hidden">
            {clients.map((client) => (
              <article key={client.id} className="p-5">
                <div>
                  <p className="font-medium text-[#171717]">
                    {client.name}
                  </p>

                  <p className="mt-1 text-sm text-[#6d6963]">
                    {client.phone}
                  </p>

                  <p className="mt-1 text-xs text-[#6d6963]">
                    {client.email || "—"}
                  </p>
                </div>

                <div className="mt-4 border-t border-[#e7e1da] pt-4">
                  <p className="text-xs text-[#6d6963]">
                    {client._count.bookings} booking(s)
                  </p>

                  <Link
                    href={`/admin/clients/${client.id}`}
                    className="mt-4 inline-block border-b border-[#171717] pb-1 text-sm font-medium text-[#171717]"
                  >
                    View client ↗
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}