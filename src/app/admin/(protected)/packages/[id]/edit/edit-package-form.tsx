"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { appToast } from "@/lib/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type PackageData = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  duration: string | null;
  includedServices: string | null;
  imageUrl: string | null;
  isActive: boolean;
  displayOrder: number;
};

type EditPackageFormProps = {
  packageData: PackageData;
};

const inputClassName =
  "mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#a39b92] focus:border-[#8b7866] disabled:cursor-not-allowed disabled:opacity-60";

const labelClassName =
  "text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]";

export default function EditPackageForm({
  packageData,
}: EditPackageFormProps) {
  const router = useRouter();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

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
      const response = await fetch(
        `/api/admin/packages/${packageData.id}`,
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
          result.message ?? "Failed to update package."
        );
        return;
      }

      appToast.success("Package updated successfully.");

      router.push("/admin/packages");
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
        `/api/admin/packages/${packageData.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        appToast.error(
          result.message ?? "Failed to remove package."
        );
        return;
      }

      if (result.action === "disabled") {
        appToast.warning(
          "Package has booking history and was deactivated."
        );
      } else {
        appToast.success("Package deleted successfully.");
      }

      setShowDeleteConfirm(false);

      router.push("/admin/packages");
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
            <label htmlFor="name" className={labelClassName}>
              Name
            </label>

            <input
              id="name"
              name="name"
              defaultValue={packageData.name}
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
              defaultValue={packageData.slug}
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
            defaultValue={packageData.description}
            rows={4}
            required
            disabled={isLoading || isDeleting}
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
              defaultValue={packageData.price}
              required
              disabled={isLoading || isDeleting}
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
              defaultValue={packageData.duration ?? ""}
              disabled={isLoading || isDeleting}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="includedServices"
            className={labelClassName}
          >
            Included Services
          </label>

          <textarea
            id="includedServices"
            name="includedServices"
            defaultValue={packageData.includedServices ?? ""}
            rows={3}
            disabled={isLoading || isDeleting}
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
            defaultValue={packageData.imageUrl ?? ""}
            disabled={isLoading || isDeleting}
            className={inputClassName}
          />

          <p className="mt-2 text-xs leading-5 text-[#6d6963]">
            Optional. Used when you want to associate a cover image with this
            package.
          </p>
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
              defaultValue={packageData.displayOrder}
              disabled={isLoading || isDeleting}
              className={inputClassName}
            />
          </div>

          <div className="flex items-end">
            <label className="flex w-full cursor-pointer items-center gap-3 border border-[#d8d2ca] bg-[#fcfaf7] px-4 py-3">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={packageData.isActive}
                disabled={isLoading || isDeleting}
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

        <div className="flex flex-col gap-3 border-t border-[#d8d2ca] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isLoading || isDeleting}
            className="border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete Package
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={isLoading || isDeleting}
              onClick={() => router.push("/admin/packages")}
              className="border border-[#d8d2ca] px-4 py-2.5 text-sm font-medium text-[#171717] transition-colors hover:bg-[#f6f3ee] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || isDeleting}
              className="bg-[#171717] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Package"}
            </button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Remove package"
        description={`Are you sure you want to remove "${packageData.name}"? If this package already has booking history, it will be deactivated instead of permanently deleted.`}
        confirmLabel="Remove package"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}