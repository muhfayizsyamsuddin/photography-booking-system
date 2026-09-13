"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { appToast } from "@/lib/toast";

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

const inputClassName =
  "mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#a39b92] focus:border-[#8b7866] disabled:cursor-not-allowed disabled:opacity-60";

const labelClassName =
  "text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]";

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

  const originalPublicId = portfolio.imagePublicId ?? "";

  async function cleanupUploadedImage(publicId: string) {
    if (!publicId || publicId === originalPublicId) {
      return;
    }

    try {
      await fetch("/api/admin/upload/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicId,
        }),
      });
    } catch {
      // Cleanup failure should not block the main UX.
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!imageUrl) {
      appToast.error("Please upload a portfolio image.");
      return;
    }

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
        await cleanupUploadedImage(imagePublicId);

        appToast.error(
          result.message ?? "Failed to update portfolio item."
        );

        return;
      }

      appToast.success("Portfolio item updated successfully.");

      router.push("/admin/portfolio");
      router.refresh();
    } catch {
      await cleanupUploadedImage(imagePublicId);

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
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className={labelClassName}>
              Title
            </label>

            <input
              id="title"
              name="title"
              defaultValue={portfolio.title}
              required
              disabled={isLoading || isDeleting}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="slug" className={labelClassName}>
              Slug
            </label>

            <input
              id="slug"
              name="slug"
              defaultValue={portfolio.slug}
              required
              disabled={isLoading || isDeleting}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className={labelClassName}>
            Description
          </label>

          <textarea
            id="description"
            name="description"
            defaultValue={portfolio.description ?? ""}
            rows={4}
            disabled={isLoading || isDeleting}
            className={`${inputClassName} resize-y`}
          />
        </div>

        <div>
          <p className={labelClassName}>
            Portfolio Image
          </p>

          <div className="mt-2">
            <ImageUpload
              value={imageUrl}
              onChange={async (image) => {
                if (
                  imagePublicId &&
                  imagePublicId !== originalPublicId
                ) {
                  await cleanupUploadedImage(imagePublicId);
                }

                setImageUrl(image.imageUrl);
                setImagePublicId(image.publicId);
              }}
            />
          </div>

          <p className="mt-2 text-xs leading-5 text-[#6d6963]">
            Upload a replacement image if you want to change the project cover.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="location" className={labelClassName}>
              Location
            </label>

            <input
              id="location"
              name="location"
              defaultValue={portfolio.location ?? ""}
              disabled={isLoading || isDeleting}
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="photographyType"
              className={labelClassName}
            >
              Photography Type
            </label>

            <input
              id="photographyType"
              name="photographyType"
              defaultValue={portfolio.photographyType ?? ""}
              disabled={isLoading || isDeleting}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="displayOrder"
              className={labelClassName}
            >
              Display Order
            </label>

            <input
              id="displayOrder"
              name="displayOrder"
              type="number"
              min="0"
              defaultValue={portfolio.displayOrder}
              disabled={isLoading || isDeleting}
              className={inputClassName}
            />
          </div>

          <div className="flex items-end">
            <label className="flex w-full cursor-pointer items-center gap-3 border border-[#d8d2ca] bg-[#fcfaf7] px-4 py-3">
              <input
                name="isPublished"
                type="checkbox"
                defaultChecked={portfolio.isPublished}
                disabled={isLoading || isDeleting}
                className="h-4 w-4 accent-[#171717]"
              />

              <span>
                <span className="block text-sm font-medium text-[#171717]">
                  Published
                </span>

                <span className="mt-0.5 block text-xs text-[#6d6963]">
                  Show this project on the public portfolio.
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#d8d2ca] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isLoading || isDeleting}
            className="border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete Portfolio
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={isLoading || isDeleting}
              onClick={() => router.push("/admin/portfolio")}
              className="border border-[#d8d2ca] px-4 py-2.5 text-sm font-medium text-[#171717] transition-colors hover:bg-[#f6f3ee] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || isDeleting}
              className="bg-[#171717] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Portfolio"}
            </button>
          </div>
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