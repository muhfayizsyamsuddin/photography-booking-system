import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const availabilitySchema = z
  .object({
    date: z.string().regex(dateRegex, "Invalid date format"),
    startTime: z.string().regex(timeRegex, "Invalid start time").nullable().optional(),
    endTime: z.string().regex(timeRegex, "Invalid end time").nullable().optional(),
    reason: z.string().trim().max(255).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    const hasStartTime = Boolean(data.startTime);
    const hasEndTime = Boolean(data.endTime);

    if (hasStartTime !== hasEndTime) {
      ctx.addIssue({
        code: "custom",
        message: "Start time and end time must be provided together",
        path: ["startTime"],
      });

      return;
    }

    if (
      data.startTime &&
      data.endTime &&
      data.startTime >= data.endTime
    ) {
      ctx.addIssue({
        code: "custom",
        message: "End time must be later than start time",
        path: ["endTime"],
      });
    }
  });

export async function GET() {
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
    const blocks = await prisma.availabilityBlock.findMany({
      orderBy: [
        {
          date: "asc",
        },
        {
          startTime: "asc",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: blocks,
    });
  } catch (error) {
    console.error("GET_AVAILABILITY_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to get availability blocks",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
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
    const body = await request.json();

    const result = availabilitySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid availability data",
          errors: result.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const { date, startTime, endTime, reason } = result.data;

    const blockDate = new Date(`${date}T00:00:00.000Z`);

    const existingBlocks = await prisma.availabilityBlock.findMany({
      where: {
        date: blockDate,
      },
    });

    const isFullDayBlock = !startTime && !endTime;

    const hasConflict = existingBlocks.some((block) => {
      const existingIsFullDay = !block.startTime && !block.endTime;

      if (isFullDayBlock || existingIsFullDay) {
        return true;
      }

      return (
        block.startTime! < endTime! &&
        block.endTime! > startTime!
      );
    });

    if (hasConflict) {
      return NextResponse.json(
        {
          success: false,
          message: "Availability block conflicts with an existing block",
        },
        {
          status: 409,
        }
      );
    }

    const createdBlock = await prisma.availabilityBlock.create({
      data: {
        date: blockDate,
        startTime: startTime || null,
        endTime: endTime || null,
        reason: reason || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: createdBlock,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE_AVAILABILITY_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create availability block",
      },
      {
        status: 500,
      }
    );
  }
}