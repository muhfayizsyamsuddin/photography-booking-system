"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type AvailabilityBlock = {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
};

type Props = {
  blocks: AvailabilityBlock[];
};

export default function AvailabilityForm({ blocks }: Props) {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [isFullDay, setIsFullDay] = useState(true);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/admin/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          startTime: isFullDay ? null : startTime,
          endTime: isFullDay ? null : endTime,
          reason: reason.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to create availability block");
        return;
      }

      toast.success("Availability block created");

      setDate("");
      setStartTime("");
      setEndTime("");
      setReason("");
      setIsFullDay(true);

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create availability block");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Delete this availability block?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/admin/availability/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to delete availability block");
        return;
      }

      toast.success("Availability block deleted");

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete availability block");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <section className="border border-[#d8d2ca] bg-[#fcfaf7] p-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8b7866]">
            New Block
          </p>

          <h2 className="mt-2 text-xl font-semibold text-[#171717]">
            Block schedule
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#6d6963]">
            Mark a full date or specific time range as unavailable.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="date"
              className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b7866]"
            >
              Date
            </label>

            <input
              id="date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
              disabled={loading}
              className="mt-2 w-full cursor-pointer border border-[#d8d2ca] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors focus:border-[#8b7866]"
            />
          </div>

          <label className="flex items-center gap-3 text-sm text-[#171717]">
            <input
              type="checkbox"
              checked={isFullDay}
              onChange={(event) => setIsFullDay(event.target.checked)}
              disabled={loading}
              className="h-4 w-4 accent-[#171717] cursor-pointer"
            />

            Block full day
          </label>

          {!isFullDay && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startTime"
                  className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b7866]"
                >
                  Start
                </label>

                <input
                  id="startTime"
                  type="time"
                  required
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  disabled={loading}
                  className="mt-2 w-full border border-[#d8d2ca] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors focus:border-[#8b7866]"
                />
              </div>

              <div>
                <label
                  htmlFor="endTime"
                  className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b7866]"
                >
                  End
                </label>

                <input
                  id="endTime"
                  type="time"
                  required
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  disabled={loading}
                  className="mt-2 w-full border border-[#d8d2ca] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors focus:border-[#8b7866]"
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="reason"
              className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b7866]"
            >
              Reason
            </label>

            <textarea
              id="reason"
              rows={3}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              disabled={loading}
              placeholder="Optional"
              className="mt-2 w-full resize-none border border-[#d8d2ca] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors focus:border-[#8b7866]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : "Block Schedule"}
          </button>
        </form>
      </section>

      <section className="border border-[#d8d2ca] bg-[#fcfaf7]">
        <div className="border-b border-[#d8d2ca] px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8b7866]">
            Current Blocks
          </p>

          <h2 className="mt-2 text-xl font-semibold text-[#171717]">
            Unavailable schedule
          </h2>
        </div>

        {blocks.length === 0 ? (
          <div className="px-6 py-14">
            <p className="text-sm text-[#6d6963]">
              No availability blocks found.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#d8d2ca]">
                    <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                      Time
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                      Reason
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {blocks.map((block) => (
                    <tr
                      key={block.id}
                      className="border-b border-[#e7e1da] last:border-b-0"
                    >
                      <td className="px-6 py-5 text-sm font-medium text-[#171717]">
                        {new Date(block.date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          timeZone: "UTC",
                        })}
                      </td>

                      <td className="px-6 py-5 text-sm text-[#6d6963]">
                        {block.startTime && block.endTime
                          ? `${block.startTime} – ${block.endTime}`
                          : "Full day"}
                      </td>

                      <td className="px-6 py-5 text-sm text-[#6d6963]">
                        {block.reason || "—"}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(block.id)}
                          disabled={deletingId === block.id}
                          className="text-sm cursor-pointer font-medium text-red-700 transition-opacity hover:opacity-60 disabled:opacity-50"
                        >
                          {deletingId === block.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#d8d2ca] md:hidden">
              {blocks.map((block) => (
                <article key={block.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-[#171717]">
                        {new Date(block.date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          timeZone: "UTC",
                        })}
                      </p>

                      <p className="mt-1 text-sm text-[#6d6963]">
                        {block.startTime && block.endTime
                          ? `${block.startTime} – ${block.endTime}`
                          : "Full day"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(block.id)}
                      disabled={deletingId === block.id}
                      className="text-xs cursor-pointer font-medium text-red-700"
                    >
                      {deletingId === block.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>

                  {block.reason && (
                    <p className="mt-4 border-t border-[#e7e1da] pt-4 text-sm leading-6 text-[#6d6963]">
                      {block.reason}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}