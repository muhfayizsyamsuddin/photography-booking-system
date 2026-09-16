import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateTestimonialSchema = z.object({
  clientName: z.string().trim().min(2).max(100).optional(),
  clientContext: z.string().trim().max(150).nullable().optional(),
  quote: z.string().trim().min(5).max(1000).optional(),
  isPublished: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
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

    const existingTestimonial =
      await prisma.testimonial.findUnique({
        where: {
          id,
        },
      });

    if (!existingTestimonial) {
      return NextResponse.json(
        {
          success: false,
          message: "Testimonial not found",
        },
        {
          status: 404,
        }
      );
    }

    const body = await request.json();
    const result = updateTestimonialSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid testimonial data",
          errors: result.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const testimonial = await prisma.testimonial.update({
      where: {
        id,
      },
      data: {
        ...(result.data.clientName !== undefined && {
          clientName: result.data.clientName,
        }),
        ...(result.data.clientContext !== undefined && {
          clientContext: result.data.clientContext || null,
        }),
        ...(result.data.quote !== undefined && {
          quote: result.data.quote,
        }),
        ...(result.data.isPublished !== undefined && {
          isPublished: result.data.isPublished,
        }),
        ...(result.data.displayOrder !== undefined && {
          displayOrder: result.data.displayOrder,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Testimonial updated",
      data: testimonial,
    });
  } catch (error) {
    console.error("UPDATE_TESTIMONIAL_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update testimonial",
      },
      {
        status: 500,
      }
    );
  }
}

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

    const existingTestimonial =
      await prisma.testimonial.findUnique({
        where: {
          id,
        },
      });

    if (!existingTestimonial) {
      return NextResponse.json(
        {
          success: false,
          message: "Testimonial not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.testimonial.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted",
    });
  } catch (error) {
    console.error("DELETE_TESTIMONIAL_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete testimonial",
      },
      {
        status: 500,
      }
    );
  }
}