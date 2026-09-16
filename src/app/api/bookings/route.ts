import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const bookingSchema = z.object({
  clientName: z.string().trim().min(2, "Name is too short"),

  phone: z
    .string()
    .trim()
    .min(8, "Phone number is too short")
    .max(20, "Phone number is too long")
    .regex(
      /^[0-9+\s()-]+$/,
      "Phone number contains invalid characters"
    )
    .refine(
      (value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length >= 8 && digits.length <= 15;
      },
      {
        message: "Invalid phone number",
      }
    ),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),

  packageId: z.string().min(1),

  bookingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid booking date"),

  bookingTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Invalid booking time"),

  location: z.string().trim().min(3),

  notes: z.string().trim().optional(),
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
    const normalizedPhone = data.phone.trim();
    const selectedDate = new Date(
      `${data.bookingDate}T00:00:00.000Z`
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate < today
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking date cannot be in the past.",
        },
        {
          status: 400,
        }
      );
    }

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

    const availabilityDate = new Date(
      `${data.bookingDate}T00:00:00.000Z`
    );

    const availabilityBlocks =
      await prisma.availabilityBlock.findMany({
        where: {
          date: availabilityDate,
        },
      });

    const isBlocked = availabilityBlocks.some((block) => {
      const isFullDay = !block.startTime && !block.endTime;

      if (isFullDay) {
        return true;
      }

      if (!block.startTime || !block.endTime) {
        return false;
      }

      return (
        data.bookingTime >= block.startTime &&
        data.bookingTime < block.endTime
      );
    });

    if (isBlocked) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The selected date or time is not available.",
        },
        {
          status: 409,
        }
      );
    }

    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        bookingDate: selectedDate,
        bookingTime: data.bookingTime,
        status: "CONFIRMED",
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        {
          success: false,
          message: "The selected time is already booked.",
        },
        {
          status: 409,
        }
      );
    }

    const client = await prisma.client.upsert({
      where: {
        phone: normalizedPhone,
      },
      update: {
        name: data.clientName,
        email: data.email || undefined,
      },
      create: {
        name: data.clientName,
        phone: normalizedPhone,
        email: data.email || null,
      },
    });

    const booking = await prisma.booking.create({
      data: {
        clientName: data.clientName,
        phone: normalizedPhone,
        email: data.email || null,
        packageId: data.packageId,
        bookingDate: selectedDate,
        bookingTime: data.bookingTime,
        location: data.location,
        notes: data.notes || null,
        clientId: client.id,
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