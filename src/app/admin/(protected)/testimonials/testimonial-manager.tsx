"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { appToast } from "@/lib/toast";

type Testimonial = {
  id: string;
  clientName: string;
  clientContext: string | null;
  quote: string;
  isPublished: boolean;
  displayOrder: number;
};

type TestimonialManagerProps = {
  initialTestimonials: Testimonial[];
};

export default function TestimonialManager({
  initialTestimonials,
}: TestimonialManagerProps) {
  const router = useRouter();

  const [testimonials, setTestimonials] =
    useState(initialTestimonials);

  const [clientName, setClientName] = useState("");
  const [clientContext, setClientContext] = useState("");
  const [quote, setQuote] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [testimonialToDelete, setTestimonialToDelete] =
    useState<Testimonial | null>(null);

  async function handleCreate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName,
          clientContext: clientContext.trim() || null,
          quote,
          displayOrder: Number(displayOrder),
          isPublished: true,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        appToast.error(
          result.message ?? "Failed to create testimonial."
        );
        return;
      }

      setTestimonials((current) => [
        ...current,
        result.data,
      ]);

      setClientName("");
      setClientContext("");
      setQuote("");
      setDisplayOrder("0");

      appToast.success("Testimonial created.");

      router.refresh();
    } catch {
      appToast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggle(testimonial: Testimonial) {
    try {
      const response = await fetch(
        `/api/admin/testimonials/${testimonial.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isPublished: !testimonial.isPublished,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        appToast.error(
          result.message ?? "Failed to update testimonial."
        );
        return;
      }

      setTestimonials((current) =>
        current.map((item) =>
          item.id === testimonial.id
            ? {
                ...item,
                isPublished: result.data.isPublished,
              }
            : item
        )
      );

      appToast.success(
        result.data.isPublished
          ? "Testimonial published."
          : "Testimonial unpublished."
      );

      router.refresh();
    } catch {
      appToast.error("Something went wrong.");
    }
  }

  async function handleDelete() {
    if (!testimonialToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/testimonials/${testimonialToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        appToast.error(
          result.message ?? "Failed to delete testimonial."
        );
        return;
      }

      setTestimonials((current) =>
        current.filter(
          (item) => item.id !== testimonialToDelete.id
        )
      );

      setTestimonialToDelete(null);

      appToast.success("Testimonial deleted.");

      router.refresh();
    } catch {
      appToast.error("Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="space-y-8">
        <form
          onSubmit={handleCreate}
          className="border border-[#d8d2ca] bg-[#fcfaf7] p-5 sm:p-6"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b7866]">
              New Testimonial
            </p>

            <h2 className="mt-2 font-semibold text-[#171717]">
              Add Client Feedback
            </h2>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="clientName"
                className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
              >
                Client Name
              </label>

              <input
                id="clientName"
                type="text"
                required
                value={clientName}
                onChange={(event) =>
                  setClientName(event.target.value)
                }
                disabled={isSubmitting}
                className="mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none focus:border-[#8b7866]"
              />
            </div>

            <div>
              <label
                htmlFor="clientContext"
                className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
              >
                Context
              </label>

              <input
                id="clientContext"
                type="text"
                value={clientContext}
                onChange={(event) =>
                  setClientContext(event.target.value)
                }
                placeholder="Graduation Session"
                disabled={isSubmitting}
                className="mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none focus:border-[#8b7866]"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="quote"
                className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
              >
                Testimonial
              </label>

              <textarea
                id="quote"
                rows={5}
                required
                value={quote}
                onChange={(event) =>
                  setQuote(event.target.value)
                }
                disabled={isSubmitting}
                className="mt-2 w-full resize-none border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm leading-6 text-[#171717] outline-none focus:border-[#8b7866]"
              />
            </div>

            <div>
              <label
                htmlFor="displayOrder"
                className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
              >
                Display Order
              </label>

              <input
                id="displayOrder"
                type="number"
                min="0"
                value={displayOrder}
                onChange={(event) =>
                  setDisplayOrder(event.target.value)
                }
                disabled={isSubmitting}
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
              {isSubmitting
                ? "Creating..."
                : "Create Testimonial"}
            </button>
          </div>
        </form>

        <section className="border border-[#d8d2ca] bg-[#fcfaf7]">
          <div className="border-b border-[#d8d2ca] px-5 py-4 sm:px-6">
            <h2 className="font-semibold text-[#171717]">
              Testimonials
            </h2>
          </div>

          {testimonials.length === 0 ? (
            <div className="px-6 py-12">
              <p className="text-sm text-[#6d6963]">
                No testimonials created yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#e7e1da]">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between sm:px-6"
                >
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-[#171717]">
                        {testimonial.clientName}
                      </p>

                      <span
                        className={`border px-2 py-0.5 text-[10px] font-medium ${
                          testimonial.isPublished
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-[#d8d2ca] bg-[#f6f3ee] text-[#6d6963]"
                        }`}
                      >
                        {testimonial.isPublished
                          ? "PUBLISHED"
                          : "UNPUBLISHED"}
                      </span>
                    </div>

                    {testimonial.clientContext && (
                      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#8b7866]">
                        {testimonial.clientContext}
                      </p>
                    )}

                    <p className="mt-3 text-sm leading-6 text-[#6d6963]">
                      “{testimonial.quote}”
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggle(testimonial)
                      }
                      className="cursor-pointer border border-[#d8d2ca] px-3 py-2 text-xs font-medium text-[#171717] transition-colors hover:border-[#8b7866]"
                    >
                      {testimonial.isPublished
                        ? "Unpublish"
                        : "Publish"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setTestimonialToDelete(testimonial)
                      }
                      className="cursor-pointer border border-red-200 px-3 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={Boolean(testimonialToDelete)}
        title="Delete testimonial"
        description={
          testimonialToDelete
            ? `Are you sure you want to delete the testimonial from "${testimonialToDelete.clientName}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete testimonial"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setTestimonialToDelete(null)}
      />
    </>
  );
}