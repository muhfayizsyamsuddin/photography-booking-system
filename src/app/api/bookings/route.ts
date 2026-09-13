import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const bookingSchema = z.object({
  clientName: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  packageId: z.string().min(1),
  bookingDate: z.string().min(1),
  bookingTime: z.string().min(1),
  location: z.string().min(3),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking data",
          errors: result.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const data = result.data;

    const photographyPackage = await prisma.package.findFirst({
      where: {
        id: data.packageId,
        isActive: true,
      },
    });

    if (!photographyPackage) {
      return NextResponse.json(
        {
          success: false,
          message: "Package not found",
        },
        {
          status: 404,
        }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        clientName: data.clientName,
        phone: data.phone,
        email: data.email || null,
        packageId: data.packageId,
        bookingDate: new Date(`${data.bookingDate}T00:00:00`),
        bookingTime: data.bookingTime,
        location: data.location,
        notes: data.notes || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Booking request submitted successfully",
        data: booking,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE_BOOKING_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit booking request",
      },
      {
        status: 500,
      }
    );
  }
}