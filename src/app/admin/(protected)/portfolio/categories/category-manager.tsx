"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { appToast } from "@/lib/toast";

type Category = {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
  _count: {
    portfolios: number;
  };
};

type CategoryManagerProps = {
  initialCategories: Category[];
};

export default function CategoryManager({
  initialCategories,
}: CategoryManagerProps) {
  const router = useRouter();

  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/portfolio-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          displayOrder: Number(displayOrder),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        appToast.error(result.message ?? "Failed to create category.");
        return;
      }

      setCategories((current) => [
        ...current,
        {
          ...result.data,
          _count: {
            portfolios: 0,
          },
        },
      ]);

      setName("");
      setSlug("");
      setDisplayOrder("0");

      appToast.success("Category created.");
      router.refresh();
    } catch {
      appToast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggle(category: Category) {
    try {
      const response = await fetch(
        `/api/admin/portfolio-categories/${category.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !category.isActive,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        appToast.error(result.message ?? "Failed to update category.");
        return;
      }

      setCategories((current) =>
        current.map((item) =>
          item.id === category.id
            ? {
                ...item,
                isActive: result.data.isActive,
              }
            : item
        )
      );

      appToast.success(
        result.data.isActive
          ? "Category enabled."
          : "Category disabled."
      );

      router.refresh();
    } catch {
      appToast.error("Something went wrong.");
    }
  }

  async function handleDelete() {
    if (!categoryToDelete) {
      return;
    }

    if (categoryToDelete._count.portfolios > 0) {
      appToast.error(
        "Remove this category from portfolio items before deleting it."
      );
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/portfolio-categories/${categoryToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        appToast.error(
          result.message ?? "Failed to delete category."
        );
        return;
      }

      setCategories((current) =>
        current.filter(
          (item) => item.id !== categoryToDelete.id
        )
      );

      setCategoryToDelete(null);

      appToast.success("Category deleted.");
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
        className="border border-[#d8d2ca] bg-[#fcfaf7] p-5 sm:p-6"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b7866]">
            New Category
          </p>

          <h2 className="mt-2 font-semibold text-[#171717]">
            Create Portfolio Category
          </h2>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="category-name"
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
            >
              Name
            </label>

            <input
              id="category-name"
              type="text"
              required
              value={name}
              onChange={(event) => {
                const value = event.target.value;
                setName(value);
                setSlug(generateSlug(value));
              }}
              className="mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none focus:border-[#8b7866]"
            />
          </div>

          <div>
            <label
              htmlFor="category-slug"
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
            >
              Slug
            </label>

            <input
              id="category-slug"
              type="text"
              required
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              className="mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none focus:border-[#8b7866]"
            />
          </div>

          <div>
            <label
              htmlFor="category-order"
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
            >
              Display Order
            </label>

            <input
              id="category-order"
              type="number"
              min="0"
              value={displayOrder}
              onChange={(event) => setDisplayOrder(event.target.value)}
              className="mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none focus:border-[#8b7866]"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer bg-[#171717] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Category"}
          </button>
        </div>
      </form>

      <section className="border border-[#d8d2ca] bg-[#fcfaf7]">
        <div className="border-b border-[#d8d2ca] px-5 py-4 sm:px-6">
          <h2 className="font-semibold text-[#171717]">
            Categories
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="px-6 py-12">
            <p className="text-sm text-[#6d6963]">
              No categories created yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#e7e1da]">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-[#171717]">
                      {category.name}
                    </p>

                    <span
                      className={`border px-2 py-0.5 text-[10px] font-medium ${
                        category.isActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-[#d8d2ca] bg-[#f6f3ee] text-[#6d6963]"
                      }`}
                    >
                      {category.isActive ? "ACTIVE" : "DISABLED"}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-[#6d6963]">
                    /{category.slug}
                  </p>

                  <p className="mt-2 text-sm text-[#6d6963]">
                    {category._count.portfolios} portfolio item(s)
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(category)}
                    className="cursor-pointer border border-[#d8d2ca] px-3 py-2 text-xs font-medium text-[#171717]"
                  >
                    {category.isActive ? "Disable" : "Enable"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategoryToDelete(category)}
                    className="cursor-pointer border border-red-200 px-3 py-2 text-xs font-medium text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-[#171717]">
              Delete portfolio category
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#6d6963]">
              Are you sure you want to delete{" "}
              <span className="font-medium text-[#171717]">
                &quot;{categoryToDelete.name}&quot;
              </span>
              ? This action cannot be undone.
            </p>

            {categoryToDelete._count.portfolios > 0 && (
              <p className="mt-3 text-sm text-red-700">
                This category is still assigned to{" "}
                {categoryToDelete._count.portfolios} portfolio item(s).
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setCategoryToDelete(null)}
                className="cursor-pointer rounded-lg border border-[#d8d2ca] bg-white px-4 py-2.5 text-sm font-medium text-[#171717] transition-colors hover:bg-[#f6f3ee] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  isDeleting ||
                  categoryToDelete._count.portfolios > 0
                }
                onClick={handleDelete}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}