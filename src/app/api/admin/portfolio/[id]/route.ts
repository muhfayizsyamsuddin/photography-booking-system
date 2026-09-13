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
  location: z.string().optional(),
  photographyType: z.string().optional(),
  displayOrder: z.number().int(),
  isPublished: z.boolean(),
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
        id,
      },
    });

    if (!existingPortfolio) {
      return NextResponse.json(
        {
          success: false,
          message: "Portfolio item not found",
        },
        {
          status: 404,
        }
      );
    }

    const slugOwner = await prisma.portfolio.findFirst({
      where: {
        slug: result.data.slug,
        NOT: {
          id,
        },
      },
    });

    if (slugOwner) {
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

    const updatedPortfolio = await prisma.portfolio.update({
      where: {
        id,
      },
      data: {
        title: result.data.title,
        slug: result.data.slug,
        description: result.data.description || null,
        imageUrl: result.data.imageUrl,
        location: result.data.location || null,
        photographyType: result.data.photographyType || null,
        displayOrder: result.data.displayOrder,
        isPublished: result.data.isPublished,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedPortfolio,
    });
  } catch (error) {
    console.error("UPDATE_PORTFOLIO_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update portfolio item",
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

  const { id } = await context.params;

  try {
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: {
        id,
      },
    });

    if (!existingPortfolio) {
      return NextResponse.json(
        {
          success: false,
          message: "Portfolio item not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.portfolio.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Portfolio item deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE_PORTFOLIO_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete portfolio item",
      },
      {
        status: 500,
      }
    );
  }
}