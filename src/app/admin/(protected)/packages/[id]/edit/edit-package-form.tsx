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
        appToast.success(
          "Package deleted successfully."
        );
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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Name
          </label>

          <input
            name="name"
            defaultValue={packageData.name}
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
            defaultValue={packageData.slug}
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
            defaultValue={packageData.description}
            rows={4}
            required
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Price
          </label>

          <input
            name="price"
            type="number"
            min="0"
            defaultValue={packageData.price}
            required
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Duration
          </label>

          <input
            name="duration"
            defaultValue={packageData.duration ?? ""}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Included Services
          </label>

          <textarea
            name="includedServices"
            defaultValue={packageData.includedServices ?? ""}
            rows={3}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Image URL
          </label>

          <input
            name="imageUrl"
            type="url"
            defaultValue={packageData.imageUrl ?? ""}
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
            defaultValue={packageData.displayOrder}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={packageData.isActive}
          />

          <span className="text-sm font-medium">
            Active
          </span>
        </label>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update Package"}
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
          >
            Delete Package
          </button>
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