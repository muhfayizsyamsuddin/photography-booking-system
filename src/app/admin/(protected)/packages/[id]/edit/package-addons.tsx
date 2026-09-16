"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { appToast } from "@/lib/toast";

type PackageAddon = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
  displayOrder: number;
};

type PackageAddonsProps = {
  packageId: string;
  initialAddons: PackageAddon[];
};

export default function PackageAddons({
  packageId,
  initialAddons,
}: PackageAddonsProps) {
  const router = useRouter();

  const [addons, setAddons] = useState(initialAddons);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addonToDelete, setAddonToDelete] = useState<PackageAddon | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/admin/packages/${packageId}/addons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description: description.trim() || null,
            price: Number(price),
            displayOrder: Number(displayOrder),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        appToast.error(
          result.message ?? "Failed to create add-on."
        );
        return;
      }

      setAddons((current) => [...current, result.data]);
      setName("");
      setDescription("");
      setPrice("");
      setDisplayOrder("0");

      appToast.success("Add-on created.");

      router.refresh();
    } catch {
      appToast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggle(addon: PackageAddon) {
    try {
      const response = await fetch(
        `/api/admin/packages/${packageId}/addons/${addon.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !addon.isActive,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        appToast.error(
          result.message ?? "Failed to update add-on."
        );
        return;
      }

      setAddons((current) =>
        current.map((item) =>
          item.id === addon.id ? result.data : item
        )
      );

      appToast.success(
        result.data.isActive
          ? "Add-on enabled."
          : "Add-on disabled."
      );

      router.refresh();
    } catch {
      appToast.error("Something went wrong.");
    }
  }

  async function handleDelete() {
    if (!addonToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/packages/${packageId}/addons/${addonToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        appToast.error(
          result.message ?? "Failed to delete add-on."
        );
        return;
      }

      setAddons((current) =>
        current.filter(
          (item) => item.id !== addonToDelete.id
        )
      );

      setAddonToDelete(null);

      appToast.success("Add-on deleted.");

      router.refresh();
    } catch {
      appToast.error("Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleCreate}
        className="space-y-5 border border-[#d8d2ca] bg-[#fcfaf7] p-5 sm:p-6"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b7866]">
            New Add-on
          </p>

          <h3 className="mt-2 font-semibold text-[#171717]">
            Add Optional Service
          </h3>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="addon-name"
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
            >
              Name
            </label>

            <input
              id="addon-name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none focus:border-[#8b7866]"
            />
          </div>

          <div>
            <label
              htmlFor="addon-price"
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
            >
              Price
            </label>

            <input
              id="addon-price"
              type="number"
              min="0"
              step="1000"
              required
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none focus:border-[#8b7866]"
            />

            <p className="mt-2 text-xs text-[#6d6963]">
              Rp {Number(price || 0).toLocaleString("id-ID")}
            </p>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="addon-description"
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
            >
              Description
            </label>

            <textarea
              id="addon-description"
              rows={3}
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              className="mt-2 w-full resize-none border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none focus:border-[#8b7866]"
            />
          </div>

          <div>
            <label
              htmlFor="addon-order"
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
            >
              Display Order
            </label>

            <input
              id="addon-order"
              type="number"
              min="0"
              value={displayOrder}
              onChange={(event) =>
                setDisplayOrder(event.target.value)
              }
              className="mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none focus:border-[#8b7866]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer bg-[#171717] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Add Add-on"}
          </button>
        </div>
      </form>

      <div className="border border-[#d8d2ca] bg-[#fcfaf7]">
        <div className="border-b border-[#d8d2ca] px-5 py-4 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b7866]">
            Package Add-ons
          </p>

          <h3 className="mt-2 font-semibold text-[#171717]">
            Optional Services
          </h3>
        </div>

        {addons.length === 0 ? (
          <div className="px-6 py-12">
            <p className="text-sm text-[#6d6963]">
              No add-ons created yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#e7e1da]">
            {addons.map((addon) => (
              <div
                key={addon.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-[#171717]">
                      {addon.name}
                    </p>

                    <span
                      className={`border px-2 py-0.5 text-[10px] font-medium ${
                        addon.isActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-[#d8d2ca] bg-[#f6f3ee] text-[#6d6963]"
                      }`}
                    >
                      {addon.isActive ? "ACTIVE" : "DISABLED"}
                    </span>
                  </div>

                  {addon.description && (
                    <p className="mt-1 text-sm text-[#6d6963]">
                      {addon.description}
                    </p>
                  )}

                  <p className="mt-2 text-sm font-medium text-[#171717]">
                    Rp {addon.price.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(addon)}
                    className="cursor-pointer border border-[#d8d2ca] px-3 py-2 text-xs font-medium text-[#171717] transition-colors hover:border-[#8b7866]"
                  >
                    {addon.isActive ? "Disable" : "Enable"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddonToDelete(addon)}
                    className="cursor-pointer border border-red-200 px-3 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {addonToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-[#171717]">
              Delete package add-on
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#6d6963]">
              Are you sure you want to delete{" "}
              <span className="font-medium text-[#171717]">
                &quot;{addonToDelete.name}&quot;
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setAddonToDelete(null)}
                className="cursor-pointer rounded-lg border border-[#d8d2ca] bg-white px-4 py-2.5 text-sm font-medium text-[#171717] transition-colors hover:bg-[#f6f3ee] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete add-on"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}