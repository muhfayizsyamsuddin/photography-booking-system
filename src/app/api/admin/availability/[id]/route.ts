import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  _request: Request,
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

    const existingBlock = await prisma.availabilityBlock.findUnique({
      where: {
        id,
      },
    });

    if (!existingBlock) {
      return NextResponse.json(
        {
          success: false,
          message: "Availability block not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.availabilityBlock.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Availability block deleted",
    });
  } catch (error) {
    console.error("DELETE_AVAILABILITY_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete availability block",
      },
      {
        status: 500,
      }
    );
  }
}