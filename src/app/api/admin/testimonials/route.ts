import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const testimonialSchema = z.object({
  clientName: z.string().trim().min(2).max(100),
  clientContext: z.string().trim().max(150).nullable().optional(),
  quote: z.string().trim().min(5).max(1000),
  isPublished: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
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

    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error("GET_TESTIMONIALS_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load testimonials",
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
    const result = testimonialSchema.safeParse(body);

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

    const testimonial = await prisma.testimonial.create({
      data: {
        clientName: result.data.clientName,
        clientContext: result.data.clientContext || null,
        quote: result.data.quote,
        isPublished: result.data.isPublished ?? true,
        displayOrder: result.data.displayOrder ?? 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Testimonial created",
        data: testimonial,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE_TESTIMONIAL_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create testimonial",
      },
      {
        status: 500,
      }
    );
  }
}