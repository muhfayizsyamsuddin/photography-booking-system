import { prisma } from "@/lib/prisma";

import AvailabilityForm from "./availability-form";

export default async function AdminAvailabilityPage() {
  const blocks = await prisma.availabilityBlock.findMany({
    orderBy: [
      {
        date: "asc",
      },
      {
        startTime: "asc",
      },
    ],
  });

  const serializedBlocks = blocks.map((block) => ({
    ...block,
    date: block.date.toISOString(),
  }));

  return (
    <div className="space-y-10">
      <header className="border-b border-[#d8d2ca] pb-8">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8b7866]">
          Schedule Management
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#171717]">
          Availability
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d6963]">
          Block unavailable dates or specific time ranges from receiving booking
          requests.
        </p>
      </header>

      <AvailabilityForm blocks={serializedBlocks} />
    </div>
  );
}