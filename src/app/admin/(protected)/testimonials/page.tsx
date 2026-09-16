import { prisma } from "@/lib/prisma";
import TestimonialManager from "./testimonial-manager";

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
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
    <div className="space-y-10">
      <header className="border-b border-[#d8d2ca] pb-8">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8b7866]">
          Content Management
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#171717]">
          Testimonials
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d6963]">
          Manage client feedback and control which testimonials are visible
          publicly.
        </p>
      </header>

      <TestimonialManager initialTestimonials={testimonials} />
    </div>
  );
}