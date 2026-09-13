import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const portfolioSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().url(),
  imagePublicId: z.string().min(1),
  location: z.string().optional(),
  photographyType: z.string().optional(),
  displayOrder: z.number().int(),
  isPublished: z.boolean(),
});

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

    const result = portfolioSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid portfolio data",
          errors: result.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const existingPortfolio = await prisma.portfolio.findUnique({
      where: {
        slug: result.data.slug,
      },
    });

    if (existingPortfolio) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug already exists",
        },
        {
          status: 409,
        }
      );
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        title: result.data.title,
        slug: result.data.slug,
        description: result.data.description || null,
        imageUrl: result.data.imageUrl,
        imagePublicId: result.data.imagePublicId,
        location: result.data.location || null,
        photographyType: result.data.photographyType || null,
        displayOrder: result.data.displayOrder,
        isPublished: result.data.isPublished,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: portfolio,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE_PORTFOLIO_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create portfolio item",
      },
      {
        status: 500,
      }
    );
  }
}