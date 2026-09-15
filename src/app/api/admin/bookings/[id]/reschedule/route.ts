import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const rescheduleSchema = z.object({
  bookingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid booking date"),

  bookingTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Invalid booking time"),
});

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const { id } = await context.params;

    const body = await request.json();
    const result = rescheduleSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid reschedule data",
          errors: result.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id,
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found",
        },
        {
          status: 404,
        }
      );
    }

    const { bookingDate, bookingTime } = result.data;

    const selectedDate = new Date(
      `${bookingDate}T00:00:00.000Z`
    );
    const availabilityDate = new Date(
      `${bookingDate}T00:00:00.000Z`
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
        bookingTime >= block.startTime &&
        bookingTime < block.endTime
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
        id: {
          not: booking.id,
        },
        bookingDate: selectedDate,
        bookingTime,
        status: "CONFIRMED",
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The selected time is already booked.",
        },
        {
          status: 409,
        }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        bookingDate: selectedDate,
        bookingTime,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Booking rescheduled successfully",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("RESCHEDULE_BOOKING_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to reschedule booking",
      },
      {
        status: 500,
      }
    );
  }
}