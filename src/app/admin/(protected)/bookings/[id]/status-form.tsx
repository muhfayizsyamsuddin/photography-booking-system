"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { appToast } from "@/lib/toast";

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === currentStatus) {
      appToast.info("Status has not changed.");
      return;
    }

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
        appToast.error(result.message ?? "Failed to update status.");
        return;
      }

      appToast.success("Booking status updated.");

      router.refresh();
    } catch {
      appToast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="status"
          className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
        >
          Status
        </label>

        <select
          id="status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          disabled={isLoading}
          className="mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors focus:border-[#8b7866] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading || status === currentStatus}
        className="w-full bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:bg-[#d8d2ca] disabled:text-[#8b7866]"
      >
        {isLoading ? "Updating..." : "Update Status"}
      </button>
    </form>
  );
}