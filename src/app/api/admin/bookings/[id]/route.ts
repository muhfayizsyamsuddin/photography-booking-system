import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({
  status: z.enum([
    "NEW",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
  ]),
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

  const { id } = await context.params;

  const body = await request.json();

  const result = statusSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid status",
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

  if (result.data.status === "CONFIRMED") {
    const availabilityDate = new Date(
      `${booking.bookingDate.toISOString().slice(0, 10)}T00:00:00.000Z`
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
        booking.bookingTime >= block.startTime &&
        booking.bookingTime < block.endTime
      );
    });

    if (isBlocked) {
      return NextResponse.json(
        {
          success: false,
          message: "This booking conflicts with an unavailable schedule.",
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
        bookingDate: booking.bookingDate,
        bookingTime: booking.bookingTime,
        status: "CONFIRMED",
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        {
          success: false,
          message: "This time slot is already confirmed for another booking.",
        },
        {
          status: 409,
        }
      );
    }
  }

  const updatedBooking = await prisma.booking.update({
    where: {
      id,
    },
    data: {
      status: result.data.status,
    },
  });

  return NextResponse.json({
    success: true,
    data: updatedBooking,
  });
}