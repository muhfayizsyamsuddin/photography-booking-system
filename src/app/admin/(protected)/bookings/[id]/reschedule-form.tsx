"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { appToast } from "@/lib/toast";

type RescheduleFormProps = {
  bookingId: string;
  currentDate: string;
  currentTime: string;
};

export default function RescheduleForm({
  bookingId,
  currentDate,
  currentTime,
}: RescheduleFormProps) {
  const router = useRouter();

  const [bookingDate, setBookingDate] = useState(currentDate);
  const [bookingTime, setBookingTime] = useState(currentTime);
  const [isLoading, setIsLoading] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      bookingDate === currentDate &&
      bookingTime === currentTime
    ) {
      appToast.info("Schedule has not changed.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/admin/bookings/${bookingId}/reschedule`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingDate,
            bookingTime,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        appToast.error(
          result.message ?? "Failed to reschedule booking."
        );
        return;
      }

      appToast.success("Booking rescheduled.");

      router.refresh();
    } catch {
      appToast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
    <div className="grid gap-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
      <div>
        <label
          htmlFor="reschedule-date"
          className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
        >
          Date
        </label>

        <input
          id="reschedule-date"
          type="date"
          value={bookingDate}
          onChange={(event) => setBookingDate(event.target.value)}
          disabled={isLoading}
          required
          className="mt-2 w-full cursor-pointer border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors focus:border-[#8b7866] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div>
        <label
          htmlFor="reschedule-time"
          className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
        >
          Time
        </label>

        <div className="relative mt-2">
          <button
            type="button"
            onClick={() => setIsTimeOpen((prev) => !prev)}
            disabled={isLoading}
            className="flex w-full cursor-pointer items-center justify-between border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-left text-sm text-[#171717] outline-none transition-colors hover:border-[#8b7866] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{bookingTime || "Select time"}</span>

            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                isTimeOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isTimeOpen && (
            <div className="absolute left-0 top-full z-30 mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] shadow-[0_16px_40px_rgba(23,23,23,0.10)]">
              <div className="grid grid-cols-3 p-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      setBookingTime(time);
                      setIsTimeOpen(false);
                    }}
                    className={`px-3 py-3 text-center text-sm transition-colors ${
                      bookingTime === time
                        ? "bg-[#171717] text-white"
                        : "text-[#171717] hover:bg-[#f0ece6]"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={
          isLoading ||
          (bookingDate === currentDate &&
            bookingTime === currentTime)
        }
        className="h-10.5 min-w-36 bg-[#171717] px-5 text-sm font-medium text-white transition-opacity hover:opacity-85 cursor-pointer disabled:cursor-not-allowed disabled:bg-[#d8d2ca] disabled:text-[#8b7866]"
      >
        {isLoading ? "Updating..." : "Reschedule"}
      </button>
    </div>

    <p className="mt-3 text-xs leading-5 text-[#6d6963]">
      Please ensure that the selected date and time are available for booking.
    </p>
  </form>
  );
}