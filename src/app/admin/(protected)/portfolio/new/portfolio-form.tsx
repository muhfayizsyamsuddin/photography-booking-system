"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { ImageUpload } from "@/components/ui/image-upload";
import { appToast } from "@/lib/toast";

const inputClassName =
  "mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#a39b92] focus:border-[#8b7866] disabled:cursor-not-allowed disabled:opacity-60";

const labelClassName =
  "text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]";

export default function PortfolioForm() {
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className={labelClassName}>
            Title
          </label>

          <input
            id="title"
            name="title"
            required
            placeholder="Graduation Session at UNHAS"
            disabled={isLoading}
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
            required
            placeholder="graduation-session-unhas"
            disabled={isLoading}
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
          rows={4}
          placeholder="Describe this photography project."
          disabled={isLoading}
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
            onChange={(image) => {
              setImageUrl(image.imageUrl);
              setImagePublicId(image.publicId);
            }}
          />
        </div>

        <p className="mt-2 text-xs leading-5 text-[#6d6963]">
          Upload the main image that will represent this project on the public
          portfolio.
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
            placeholder="Makassar, South Sulawesi"
            disabled={isLoading}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="photographyType" className={labelClassName}>
            Photography Type
          </label>

          <input
            id="photographyType"
            name="photographyType"
            placeholder="Graduation, Wedding, Couples..."
            disabled={isLoading}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="displayOrder" className={labelClassName}>
            Display Order
          </label>

          <input
            id="displayOrder"
            name="displayOrder"
            type="number"
            min="0"
            defaultValue={0}
            disabled={isLoading}
            className={inputClassName}
          />
        </div>

        <div className="flex items-end">
          <label className="flex w-full cursor-pointer items-center gap-3 border border-[#d8d2ca] bg-[#fcfaf7] px-4 py-3">
            <input
              name="isPublished"
              type="checkbox"
              defaultChecked
              disabled={isLoading}
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

      <div className="flex flex-col gap-3 border-t border-[#d8d2ca] pt-6 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => router.push("/admin/portfolio")}
          className="border border-[#d8d2ca] px-4 py-2.5 text-sm font-medium text-[#171717] transition-colors hover:bg-[#f6f3ee] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#171717] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create Portfolio"}
        </button>
      </div>
    </form>
  );
}