"use client";

import { ChangeEvent, useState } from "react";

import { appToast } from "@/lib/toast";

type UploadedImage = {
  imageUrl: string;
  publicId: string;
};

type ImageUploadProps = {
  value?: string;
  onChange: (image: UploadedImage) => void;
};

export function ImageUpload({
  value,
  onChange,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        appToast.error(
          result.message ?? "Failed to upload image."
        );
        return;
      }

      onChange({
        imageUrl: result.data.imageUrl,
        publicId: result.data.publicId,
      });

      appToast.success("Image uploaded successfully.");
    } catch {
      appToast.error("Something went wrong while uploading.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      {value && (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <img
            src={value}
            alt="Portfolio preview"
            className="h-56 w-full object-cover"
          />
        </div>
      )}

      <div>
        <label
          htmlFor="image-upload"
          className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          {isUploading
            ? "Uploading..."
            : value
              ? "Replace Image"
              : "Upload Image"}
        </label>

        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
      </div>

      {value && (
        <p className="text-xs text-gray-500">
          Choose a new image to replace the current one.
        </p>
      )}
    </div>
  );
}