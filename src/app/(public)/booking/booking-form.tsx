"use client";

import { FormEvent, useState } from "react";
import { appToast } from "@/lib/toast";

type Package = {
  id: string;
  name: string;
  price: number;
};

type BookingFormProps = {
  packages: Package[];
  selectedPackageId?: string;
};

export default function BookingForm({
  packages,
  selectedPackageId,
}: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      clientName: formData.get("clientName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      packageId: formData.get("packageId"),
      bookingDate: formData.get("bookingDate"),
      bookingTime: formData.get("bookingTime"),
      location: formData.get("location"),
      notes: formData.get("notes"),
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        appToast.error(
          result.message ?? "Failed to submit booking."
        );
        return;
      }

      appToast.success(
        "Booking request submitted successfully."
      );

      form.reset();
    } catch {
      appToast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-3 block text-xs uppercase tracking-[0.16em] text-[#8b7866]">
            Your Name
          </label>

          <input
            name="clientName"
            required
            className="w-full border-0 border-b border-[#bfb7ae] bg-transparent px-0 py-3 text-base text-[#171717] outline-none transition placeholder:text-[#aaa198] focus:border-[#171717]"
          />
        </div>

        <div>
          <label className="mb-3 block text-xs uppercase tracking-[0.16em] text-[#8b7866]">
            WhatsApp / Phone
          </label>

          <input
            name="phone"
            required
            className="w-full border-0 border-b border-[#bfb7ae] bg-transparent px-0 py-3 text-base text-[#171717] outline-none transition focus:border-[#171717]"
          />
        </div>

        <div>
          <label className="mb-3 block text-xs uppercase tracking-[0.16em] text-[#8b7866]">
            Email
          </label>

          <input
            name="email"
            type="email"
            className="w-full border-0 border-b border-[#bfb7ae] bg-transparent px-0 py-3 text-base text-[#171717] outline-none transition focus:border-[#171717]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-3 block text-xs uppercase tracking-[0.16em] text-[#8b7866]">
            Package
          </label>

          <select
            name="packageId"
            required
            defaultValue={selectedPackageId ?? ""}
            className="w-full border-0 border-b border-[#bfb7ae] bg-transparent px-0 py-3 text-base text-[#171717] outline-none focus:border-[#171717]"
          >
            <option value="" disabled>
              Select package
            </option>

            {packages.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} — Rp {item.price.toLocaleString("id-ID")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-3 block text-xs uppercase tracking-[0.16em] text-[#8b7866]">
            Date
          </label>

          <input
            name="bookingDate"
            type="date"
            required
            className="w-full border-0 border-b border-[#bfb7ae] bg-transparent px-0 py-3 text-base text-[#171717] outline-none focus:border-[#171717]"
          />
        </div>

        <div>
          <label className="mb-3 block text-xs uppercase tracking-[0.16em] text-[#8b7866]">
            Time
          </label>

          <input
            name="bookingTime"
            type="time"
            required
            className="w-full border-0 border-b border-[#bfb7ae] bg-transparent px-0 py-3 text-base text-[#171717] outline-none focus:border-[#171717]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-3 block text-xs uppercase tracking-[0.16em] text-[#8b7866]">
            Location
          </label>

          <input
            name="location"
            required
            className="w-full border-0 border-b border-[#bfb7ae] bg-transparent px-0 py-3 text-base text-[#171717] outline-none focus:border-[#171717]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-3 block text-xs uppercase tracking-[0.16em] text-[#8b7866]">
            Tell me about your session
          </label>

          <textarea
            name="notes"
            rows={5}
            className="w-full resize-none border-0 border-b border-[#bfb7ae] bg-transparent px-0 py-3 text-base leading-7 text-[#171717] outline-none focus:border-[#171717]"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="border-b border-[#171717] pb-1 text-sm font-medium text-[#171717] disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Send request ↗"}
        </button>
      </div>
    </form>
  );
}