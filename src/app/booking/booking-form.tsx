"use client";

import { FormEvent, useState } from "react";

type Package = {
  id: string;
  name: string;
  price: number;
};

type BookingFormProps = {
  packages: Package[];
};

export default function BookingForm({
  packages,
}: BookingFormProps) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
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
        setError(result.message ?? "Failed to submit booking.");
        return;
      }

      setSuccess(
        "Booking request submitted. We will contact you for confirmation."
      );

      form.reset();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="clientName"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Name
        </label>

        <input
          id="clientName"
          name="clientName"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          WhatsApp / Phone
        </label>

        <input
          id="phone"
          name="phone"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
        />
      </div>

      <div>
        <label
          htmlFor="packageId"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Package
        </label>

        <select
          id="packageId"
          name="packageId"
          required
          defaultValue=""
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
        >
          <option value="" disabled>
            Select package
          </option>

          {packages.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} - Rp {item.price.toLocaleString("id-ID")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="bookingDate"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Date
        </label>

        <input
          id="bookingDate"
          name="bookingDate"
          type="date"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
        />
      </div>

      <div>
        <label
          htmlFor="bookingTime"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Time
        </label>

        <input
          id="bookingTime"
          name="bookingTime"
          type="time"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
        />
      </div>

      <div>
        <label
          htmlFor="location"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Location
        </label>

        <input
          id="location"
          name="location"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Notes
        </label>

        <textarea
          id="notes"
          name="notes"
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-green-600">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white disabled:opacity-50"
      >
        {isLoading ? "Submitting..." : "Submit Booking"}
      </button>
    </form>
  );
}