"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ui/image-upload";
import { appToast } from "@/lib/toast";

export default function PortfolioForm() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const payload = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      imageUrl,
      imagePublicId,
      location: formData.get("location"),
      photographyType: formData.get("photographyType"),
      displayOrder: Number(formData.get("displayOrder")),
      isPublished: formData.get("isPublished") === "on",
    };

    try {
      if (!imageUrl) {
        appToast.error("Please upload a portfolio image.");
        setIsLoading(false);
        return;
      }
      const response = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        appToast.error(
          result.message ?? "Failed to create portfolio item."
        );
        return;
      }

      appToast.success("Portfolio item created successfully.");

      router.push("/admin/portfolio");
      router.refresh();
    } catch {
      appToast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Title
        </label>

        <input
          name="title"
          required
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Slug
        </label>

        <input
          name="slug"
          required
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Description
        </label>

        <textarea
          name="description"
          rows={4}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Portfolio Image
        </label>

        <ImageUpload
          value={imageUrl}
          onChange={(image) => {
            setImageUrl(image.imageUrl);
            setImagePublicId(image.publicId);
          }}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Location
        </label>

        <input
          name="location"
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Photography Type
        </label>

        <input
          name="photographyType"
          placeholder="Wedding, Graduation, Family..."
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Display Order
        </label>

        <input
          name="displayOrder"
          type="number"
          defaultValue={0}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          name="isPublished"
          type="checkbox"
          defaultChecked
        />

        <span className="text-sm font-medium">
          Published
        </span>
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {isLoading ? "Creating..." : "Create Portfolio"}
      </button>
    </form>
  );
}