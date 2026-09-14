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
  const today = new Date().toLocaleDateString("en-CA");

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
          <label 
            className="mb-3 block text-xs uppercase tracking-[0.16em] text-[#8b7866]"
            htmlFor="clientName"
          >
            Your Name
          </label>

          <input
            id="clientName"
            name="clientName"
            required
            disabled={isLoading}
            className="w-full border-0 border-b border-[#bfb7ae] bg-transparent px-0 py-3 text-base text-[#171717] outline-none transition placeholder:text-[#aaa198] focus:border-[#171717]"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-3 block text-xs uppercase tracking-[0.16em] text-[#8b7866]"
          >
            WhatsApp / Phone
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            required
            minLength={8}
            maxLength={20}
            pattern="[0-9+ ()-]+"
            placeholder="0812 3456 7890"
            disabled={isLoading}
            className="w-full border-0 border-b border-[#bfb7ae] bg-transparent px-0 py-3 text-base text-[#171717] outline-none transition focus:border-[#171717]"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-3 block text-xs uppercase tracking-[0.16em] text-[#8b7866]"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            disabled={isLoading}
            className="w-full border-0 border-b border-[#bfb7ae] bg-transparent px-0 py-3 text-base text-[#171717] outline-none transition focus:border-[#171717]"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="packageId"
            className="mb-3 block text-xs uppercase tracking-[0.16em] text-[#8b7866]"
          >
            Package
          </label>

          <select
            id="packageId"
            name="packageId"
            required
            defaultValue={selectedPackageId ?? ""}
            disabled={isLoading}
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
          <label
            htmlFor="bookingDate"
            className="mb-3 block text-xs uppercase tracking-[0.16em] text-[#8b7866]"
          >
            Date
          </label>

          <input
            id="bookingDate"
            name="bookingDate"
            type="date"
            min={today}
            required
            disabled={isLoading}
            className="w-full border-0 border-b border-[#bfb7ae] bg-transparent px-0 py-3 text-base text-[#171717] outline-none focus:border-[#171717]"
          />
        </div>

        <div>
          <label
            htmlFor="bookingTime"
            className="mb-3 block text-xs uppercase tracking-[0.16em] text-[#8b7866]"
          >
            Time
          </label>

          <input
            id="bookingTime"
            name="bookingTime"
            type="time"
            required
            disabled={isLoading}
            className="w-full border-0 border-b border-[#bfb7ae] bg-transparent px-0 py-3 text-base text-[#171717] outline-none focus:border-[#171717]"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="location"
            className="mb-3 block text-xs uppercase tracking-[0.16em] text-[#8b7866]"
          >
            Location
          </label>

          <input
            id="location"
            name="location"
            required
            disabled={isLoading}
            className="w-full border-0 border-b border-[#bfb7ae] bg-transparent px-0 py-3 text-base text-[#171717] outline-none focus:border-[#171717]"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="notes"
            className="mb-3 block text-xs uppercase tracking-[0.16em] text-[#8b7866]"
          >
            Tell me about your session
          </label>

          <textarea
            id="notes"
            name="notes"
            rows={5}
            disabled={isLoading}
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