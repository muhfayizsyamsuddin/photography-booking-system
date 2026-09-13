"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { appToast } from "@/lib/toast";
import { ImageUpload } from "@/components/ui/image-upload";

type PortfolioData = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string;
  imagePublicId: string | null;
  location: string | null;
  photographyType: string | null;
  isPublished: boolean;
  displayOrder: number;
};

type EditPortfolioFormProps = {
  portfolio: PortfolioData;
};

export default function EditPortfolioForm({
  portfolio,
}: EditPortfolioFormProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(portfolio.imageUrl);
  const [imagePublicId, setImagePublicId] = useState(
    portfolio.imagePublicId ?? ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
      const response = await fetch(
        `/api/admin/portfolio/${portfolio.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        appToast.error(
          result.message ?? "Failed to update portfolio item."
        );
        return;
      }

      appToast.success("Portfolio item updated successfully.");

      router.push("/admin/portfolio");
      router.refresh();
    } catch {
      appToast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/portfolio/${portfolio.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        appToast.error(
          result.message ?? "Failed to delete portfolio item."
        );
        return;
      }

      appToast.success("Portfolio item deleted successfully.");

      setShowDeleteConfirm(false);

      router.push("/admin/portfolio");
      router.refresh();
    } catch {
      appToast.error("Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Title
          </label>

          <input
            name="title"
            defaultValue={portfolio.title}
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
            defaultValue={portfolio.slug}
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
            defaultValue={portfolio.description ?? ""}
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
            defaultValue={portfolio.location ?? ""}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Photography Type
          </label>

          <input
            name="photographyType"
            defaultValue={portfolio.photographyType ?? ""}
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
            defaultValue={portfolio.displayOrder}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            name="isPublished"
            type="checkbox"
            defaultChecked={portfolio.isPublished}
          />

          <span className="text-sm font-medium">
            Published
          </span>
        </label>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update Portfolio"}
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            Delete Portfolio
          </button>
        </div>
      </form>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete portfolio item"
        description={`Are you sure you want to delete "${portfolio.title}"? This action cannot be undone.`}
        confirmLabel="Delete portfolio"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}