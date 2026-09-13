"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
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
        setError(result.message ?? "Failed to update package.");
        return;
      }

      router.push("/admin/packages");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
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

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {isLoading ? "Updating..." : "Update Package"}
      </button>
    </form>
  );
}