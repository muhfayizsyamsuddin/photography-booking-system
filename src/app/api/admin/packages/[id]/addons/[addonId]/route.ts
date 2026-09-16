import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateAddonSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(500).nullable().optional(),
  price: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

type RouteContext = {
  params: Promise<{
    id: string;
    addonId: string;
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
    const { id, addonId } = await context.params;

    const addon = await prisma.packageAddon.findFirst({
      where: {
        id: addonId,
        packageId: id,
      },
    });

    if (!addon) {
      return NextResponse.json(
        {
          success: false,
          message: "Add-on not found",
        },
        {
          status: 404,
        }
      );
    }

    const body = await request.json();
    const result = updateAddonSchema.safeParse(body);

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

    const updatedAddon = await prisma.packageAddon.update({
      where: {
        id: addonId,
      },
      data: {
        ...(result.data.name !== undefined && {
          name: result.data.name,
        }),
        ...(result.data.description !== undefined && {
          description: result.data.description || null,
        }),
        ...(result.data.price !== undefined && {
          price: result.data.price,
        }),
        ...(result.data.isActive !== undefined && {
          isActive: result.data.isActive,
        }),
        ...(result.data.displayOrder !== undefined && {
          displayOrder: result.data.displayOrder,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Package add-on updated",
      data: updatedAddon,
    });
  } catch (error) {
    console.error("UPDATE_PACKAGE_ADDON_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update package add-on",
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
    const { id, addonId } = await context.params;

    const addon = await prisma.packageAddon.findFirst({
      where: {
        id: addonId,
        packageId: id,
      },
    });

    if (!addon) {
      return NextResponse.json(
        {
          success: false,
          message: "Add-on not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.packageAddon.delete({
      where: {
        id: addonId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Package add-on deleted",
    });
  } catch (error) {
    console.error("DELETE_PACKAGE_ADDON_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete package add-on",
      },
      {
        status: 500,
      }
    );
  }
}