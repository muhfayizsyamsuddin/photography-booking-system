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