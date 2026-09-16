import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const addonSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).optional().nullable(),
  price: z.number().int().min(0),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
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

    const packageData = await prisma.package.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!packageData) {
      return NextResponse.json(
        {
          success: false,
          message: "Package not found",
        },
        {
          status: 404,
        }
      );
    }

    const addons = await prisma.packageAddon.findMany({
      where: {
        packageId: id,
      },
      orderBy: [
        {
          displayOrder: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: addons,
    });
  } catch (error) {
    console.error("GET_PACKAGE_ADDONS_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load package add-ons",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
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

    const packageData = await prisma.package.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!packageData) {
      return NextResponse.json(
        {
          success: false,
          message: "Package not found",
        },
        {
          status: 404,
        }
      );
    }

    const body = await request.json();
    const result = addonSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid add-on data",
          errors: result.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const addon = await prisma.packageAddon.create({
      data: {
        name: result.data.name,
        description: result.data.description || null,
        price: result.data.price,
        isActive: result.data.isActive ?? true,
        displayOrder: result.data.displayOrder ?? 0,
        packageId: id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Package add-on created",
        data: addon,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE_PACKAGE_ADDON_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create package add-on",
      },
      {
        status: 500,
      }
    );
  }
}