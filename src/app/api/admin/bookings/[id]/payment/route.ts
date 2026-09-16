import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const paymentSchema = z.object({
  depositAmount: z.number().int().nonnegative(),
  totalPayment: z.number().int().nonnegative(),
  paymentStatus: z.enum([
    "UNPAID",
    "PARTIALLY_PAID",
    "PAID",
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

  try {
    const { id } = await context.params;

    const body = await request.json();

    const result = paymentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment data",
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

    const updatedBooking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        depositAmount: result.data.depositAmount,
        totalPayment: result.data.totalPayment,
        paymentStatus: result.data.paymentStatus,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment information updated",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("UPDATE_PAYMENT_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update payment information",
      },
      {
        status: 500,
      }
    );
  }
}