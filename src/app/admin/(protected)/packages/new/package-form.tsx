"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/slug";
import { appToast } from "@/lib/toast";

const inputClassName =
  "mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#a39b92] focus:border-[#8b7866] disabled:cursor-not-allowed disabled:opacity-60";

const labelClassName =
  "text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]";

export default function PackageForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      duration: formData.get("duration"),
      includedServices: formData.get("includedServices"),
      imageUrl: formData.get("imageUrl"),
      displayOrder: Number(formData.get("displayOrder")),
      isActive: formData.get("isActive") === "on",
    };

    try {
      const response = await fetch("/api/admin/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        appToast.error(result.message ?? "Failed to create package.");
        return;
      }

      appToast.success("Package created successfully.");

      router.push("/admin/packages");
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
          <label htmlFor="name" className={labelClassName}>
            Name
          </label>

          <input
            id="name"
            name="name"
            required
            placeholder="Graduation Basic"
            value={name}
            onChange={(event) => {
              const value = event.target.value;

              setName(value);
              setSlug(generateSlug(value));
            }}
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
            placeholder="graduation-basic"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
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
          required
          placeholder="Describe this photography package."
          disabled={isLoading}
          className={`${inputClassName} resize-y`}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className={labelClassName}>
            Price
          </label>

          <input
            id="price"
            name="price"
            type="number"
            min="0"
            required
            placeholder="500000"
            disabled={isLoading}
            className={inputClassName}
          />

          <p className="mt-2 text-xs text-[#6d6963]">
            Enter the amount in Indonesian Rupiah.
          </p>
        </div>

        <div>
          <label htmlFor="duration" className={labelClassName}>
            Duration
          </label>

          <input
            id="duration"
            name="duration"
            placeholder="1 hour"
            disabled={isLoading}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label htmlFor="includedServices" className={labelClassName}>
          Included Services
        </label>

        <textarea
          id="includedServices"
          name="includedServices"
          rows={3}
          placeholder="1 photographer, edited photos, online delivery"
          disabled={isLoading}
          className={`${inputClassName} resize-y`}
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className={labelClassName}>
          Image URL
        </label>

        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://..."
          disabled={isLoading}
          className={inputClassName}
        />

        <p className="mt-2 text-xs leading-5 text-[#6d6963]">
          Optional. Used when you want to associate a cover image with this
          package.
        </p>
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
              name="isActive"
              type="checkbox"
              defaultChecked
              disabled={isLoading}
              className="h-4 w-4 accent-[#171717]"
            />

            <span>
              <span className="block text-sm font-medium text-[#171717]">
                Active Package
              </span>

              <span className="mt-0.5 block text-xs text-[#6d6963]">
                Make this package available for booking.
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[#d8d2ca] pt-6 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => router.push("/admin/packages")}
          className="border border-[#d8d2ca] px-4 py-2.5 text-sm font-medium text-[#171717] transition-colors hover:bg-[#f6f3ee] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#171717] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create Package"}
        </button>
      </div>
    </form>
  );
}