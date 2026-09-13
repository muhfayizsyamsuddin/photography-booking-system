"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type BookingStatusFormProps = {
  bookingId: string;
  currentStatus: string;
};

const statuses = [
  "NEW",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];

export default function BookingStatusForm({
  bookingId,
  currentStatus,
}: BookingStatusFormProps) {
  const router = useRouter();

  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message ?? "Failed to update status.");
        return;
      }

      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2"
      >
        {statuses.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {isLoading ? "Updating..." : "Update Status"}
      </button>
    </form>
  );
}