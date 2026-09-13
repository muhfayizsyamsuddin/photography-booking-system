"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function PackageForm() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
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
        setError(result.message ?? "Failed to create package.");
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
        <label className="mb-1 block text-sm font-medium">Name</label>

        <input
          name="name"
          required
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Slug</label>

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
          required
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Price</label>

        <input
          name="price"
          type="number"
          min="0"
          required
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Duration</label>

        <input
          name="duration"
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Included Services
        </label>

        <textarea
          name="includedServices"
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
          name="isActive"
          type="checkbox"
          defaultChecked
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
        {isLoading ? "Creating..." : "Create Package"}
      </button>
    </form>
  );
}