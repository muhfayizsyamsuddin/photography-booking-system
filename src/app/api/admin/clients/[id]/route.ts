import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const clientSchema = z.object({
  notes: z.string().trim().max(2000).nullable().optional(),
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

    const body = await request.json();
    const result = clientSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid client data",
          errors: result.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const client = await prisma.client.findUnique({
      where: {
        id,
      },
    });

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          message: "Client not found",
        },
        {
          status: 404,
        }
      );
    }

    const updatedClient = await prisma.client.update({
      where: {
        id,
      },
      data: {
        notes: result.data.notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Client notes updated",
      data: updatedClient,
    });
  } catch (error) {
    console.error("UPDATE_CLIENT_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update client",
      },
      {
        status: 500,
      }
    );
  }
}