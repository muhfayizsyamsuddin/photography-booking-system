import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const packageSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(3),
  price: z.number().int().nonnegative(),

  duration: z.string().optional(),
  includedServices: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),

  isActive: z.boolean(),
  displayOrder: z.number().int(),
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

    const result = packageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid package data",
          errors: result.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const existingPackage = await prisma.package.findUnique({
      where: {
        slug: result.data.slug,
      },
    });

    if (existingPackage) {
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

    const createdPackage = await prisma.package.create({
      data: {
        name: result.data.name,
        slug: result.data.slug,
        description: result.data.description,
        price: result.data.price,

        duration: result.data.duration || null,
        includedServices: result.data.includedServices || null,
        imageUrl: result.data.imageUrl || null,

        isActive: result.data.isActive,
        displayOrder: result.data.displayOrder,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: createdPackage,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE_PACKAGE_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create package",
      },
      {
        status: 500,
      }
    );
  }
}