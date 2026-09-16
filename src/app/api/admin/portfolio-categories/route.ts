import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const categorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must use lowercase letters, numbers, and hyphens"
    ),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
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
    const categories =
      await prisma.portfolioCategory.findMany({
        orderBy: [
          {
            displayOrder: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
        include: {
          _count: {
            select: {
              portfolios: true,
            },
          },
        },
      });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(
      "GET_PORTFOLIO_CATEGORIES_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load categories",
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
    const result = categorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category data",
          errors: result.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const existingCategory =
      await prisma.portfolioCategory.findUnique({
        where: {
          slug: result.data.slug,
        },
      });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A category with this slug already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const category =
      await prisma.portfolioCategory.create({
        data: {
          name: result.data.name,
          slug: result.data.slug,
          displayOrder:
            result.data.displayOrder ?? 0,
          isActive:
            result.data.isActive ?? true,
        },
      });

    return NextResponse.json(
      {
        success: true,
        message: "Portfolio category created",
        data: category,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CREATE_PORTFOLIO_CATEGORY_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create category",
      },
      {
        status: 500,
      }
    );
  }
}