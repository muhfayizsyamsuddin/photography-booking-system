import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateCategorySchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must use lowercase letters, numbers, and hyphens"
    )
    .optional(),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
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

    const existingCategory =
      await prisma.portfolioCategory.findUnique({
        where: {
          id,
        },
      });

    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        {
          status: 404,
        }
      );
    }

    const body = await request.json();
    const result = updateCategorySchema.safeParse(body);

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

    if (
      result.data.slug &&
      result.data.slug !== existingCategory.slug
    ) {
      const slugExists =
        await prisma.portfolioCategory.findUnique({
          where: {
            slug: result.data.slug,
          },
        });

      if (slugExists) {
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
    }

    const updatedCategory =
      await prisma.portfolioCategory.update({
        where: {
          id,
        },
        data: {
          ...(result.data.name !== undefined && {
            name: result.data.name,
          }),
          ...(result.data.slug !== undefined && {
            slug: result.data.slug,
          }),
          ...(result.data.displayOrder !== undefined && {
            displayOrder: result.data.displayOrder,
          }),
          ...(result.data.isActive !== undefined && {
            isActive: result.data.isActive,
          }),
        },
      });

    return NextResponse.json({
      success: true,
      message: "Portfolio category updated",
      data: updatedCategory,
    });
  } catch (error) {
    console.error(
      "UPDATE_PORTFOLIO_CATEGORY_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update category",
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

    const category =
      await prisma.portfolioCategory.findUnique({
        where: {
          id,
        },
        include: {
          _count: {
            select: {
              portfolios: true,
            },
          },
        },
      });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        {
          status: 404,
        }
      );
    }

    if (category._count.portfolios > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Category cannot be deleted while it is assigned to portfolio items.",
        },
        {
          status: 409,
        }
      );
    }

    await prisma.portfolioCategory.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Portfolio category deleted",
    });
  } catch (error) {
    console.error(
      "DELETE_PORTFOLIO_CATEGORY_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete category",
      },
      {
        status: 500,
      }
    );
  }
}