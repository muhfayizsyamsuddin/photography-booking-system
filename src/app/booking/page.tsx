import { prisma } from "@/lib/prisma";
import BookingForm from "./booking-form";

export default async function BookingPage() {
  const packages = await prisma.package.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
    select: {
      id: true,
      name: true,
      price: true,
    },
  });

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900">
          Book a Photography Session
        </h1>

        <p className="mt-2 text-gray-600">
          Submit your booking request and we will contact you for confirmation.
        </p>

        <div className="mt-8 rounded-xl bg-white p-8 shadow-sm">
          <BookingForm packages={packages} />
        </div>
      </div>
    </main>
  );
}