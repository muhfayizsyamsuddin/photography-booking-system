import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

const deleteSchema = z.object({
  publicId: z.string().min(1),
});

export async function DELETE(request: Request) {
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

    const result = deleteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid public id",
        },
        {
          status: 400,
        }
      );
    }

    await cloudinary.uploader.destroy(result.data.publicId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE_UPLOAD_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete uploaded image",
      },
      {
        status: 500,
      }
    );
  }
}