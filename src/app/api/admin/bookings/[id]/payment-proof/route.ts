import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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

    const booking = await prisma.booking.findUnique({
      where: {
        id,
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found",
        },
        {
          status: 404,
        }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment proof image is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: "Only image files are allowed",
        },
        {
          status: 400,
        }
      );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "Image must be smaller than 5 MB",
        },
        {
          status: 400,
        }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadedImage = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "photography-booking-system/payment-proofs",
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) {
              reject(error ?? new Error("Upload failed"));
              return;
            }

            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        )
        .end(buffer);
    });

    if (booking.paymentProofId) {
      await cloudinary.uploader.destroy(
        booking.paymentProofId
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        paymentProofUrl: uploadedImage.secure_url,
        paymentProofId: uploadedImage.public_id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment proof uploaded",
      data: {
        paymentProofUrl: updatedBooking.paymentProofUrl,
        paymentProofId: updatedBooking.paymentProofId,
      },
    });
  } catch (error) {
    console.error("UPLOAD_PAYMENT_PROOF_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload payment proof",
      },
      {
        status: 500,
      }
    );
  }
}