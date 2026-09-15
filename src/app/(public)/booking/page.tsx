import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import BookingForm from "./booking-form";

export const metadata: Metadata = {
  title: "Book a Session",
  description:
    "Submit a photography booking request for your preferred package and schedule.",
};

type BookingPageProps = {
  searchParams: Promise<{
    package?: string;
  }>;
};

export default async function BookingPage({
  searchParams,
}: BookingPageProps) {
  const { package: selectedPackageId } = await searchParams;

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

  const availabilityBlocks = await prisma.availabilityBlock.findMany({
    select: {
      date: true,
      startTime: true,
      endTime: true,
    },
  });

  const confirmedBookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
    },
    select: {
      bookingDate: true,
      bookingTime: true,
    },
  });

  const serializedAvailabilityBlocks = availabilityBlocks.map((block) => ({
    date: block.date.toISOString().slice(0, 10),
    startTime: block.startTime,
    endTime: block.endTime,
  }));

  const serializedConfirmedBookings = confirmedBookings.map((booking) => ({
    date: booking.bookingDate.toISOString().slice(0, 10),
    time: booking.bookingTime,
  }));

  return (
    <main className="bg-[#f6f3ee]">
      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-28">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8b7866]">
            Book a Session
          </p>

          <h1 className="mt-6 max-w-md font-serif text-5xl leading-[0.95] tracking-[-0.03em] text-[#171717] md:text-6xl">
            Let&apos;s create something worth remembering.
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-7 text-[#6d6963]">
            Tell me a little about your plans and I&apos;ll get back to you to
            confirm availability and session details.
          </p>

          <div className="mt-10 border-t border-[#d8d2ca] pt-6 text-sm leading-6 text-[#6d6963]">
            <p>Based in Makassar.</p>
            <p>Available for graduation, weddings, couples, and family sessions.</p>
          </div>
        </div>

        <div className="lg:border-l lg:border-[#d8d2ca] lg:pl-14">
          <BookingForm
            packages={packages}
            selectedPackageId={selectedPackageId}
            availabilityBlocks={serializedAvailabilityBlocks}
            confirmedBookings={serializedConfirmedBookings}
          />
        </div>
      </section>
    </main>
  );
}