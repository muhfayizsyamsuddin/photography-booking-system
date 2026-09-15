"use client";

import { FormEvent, useState } from "react";
import { appToast } from "@/lib/toast";
import { ChevronDown } from "lucide-react";

type Package = {
  id: string;
  name: string;
  price: number;
};

type AvailabilityBlock = {
  date: string;
  startTime: string | null;
  endTime: string | null;
};

type ConfirmedBooking = {
  date: string;
  time: string;
};

type BookingFormProps = {
  packages: Package[];
  selectedPackageId?: string;
  availabilityBlocks: AvailabilityBlock[];
  confirmedBookings: ConfirmedBooking[];
};

export default function BookingForm({
  packages,
  selectedPackageId,
  availabilityBlocks,
  confirmedBookings,
}: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const today = new Date().toLocaleDateString("en-CA");

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

  const selectedDateBlocks = availabilityBlocks.filter(
    (block) => block.date === selectedDate
  );

  const isFullDayBlocked = selectedDateBlocks.some(
    (block) => !block.startTime && !block.endTime
  );

  const availableTimeSlots = timeSlots.filter((time) => {
    const blockedByAvailability = selectedDateBlocks.some((block) => {
      if (!block.startTime || !block.endTime) {
        return false;
      }

      return time >= block.startTime && time < block.endTime;
    });

    const blockedByConfirmedBooking = confirmedBookings.some(
      (booking) =>
        booking.date === selectedDate &&
        booking.time === time
    );

    return !blockedByAvailability && !blockedByConfirmedBooking;
  });

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
            value={selectedDate}
            onChange={(event) => {
              setSelectedDate(event.target.value);
              setSelectedTime("");
              setIsTimeOpen(false);
            }}
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

          <div className="relative">
            <input
              type="hidden"
              name="bookingTime"
              value={selectedTime}
            />

            <button
              type="button"
              onClick={() => setIsTimeOpen((prev) => !prev)}
              disabled={
                isLoading ||
                !selectedDate ||
                isFullDayBlocked ||
                availableTimeSlots.length === 0
              }
              className="flex w-full items-center justify-between border-0 border-b border-[#bfb7ae] bg-transparent px-0 py-3 text-left text-base text-[#171717] outline-none transition-colors hover:border-[#171717] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className={!selectedTime ? "text-[#8b837a]" : ""}>
                {isFullDayBlocked
                  ? "Unavailable"
                  : availableTimeSlots.length === 0 && selectedDate
                    ? "No available slots"
                    : selectedTime || "Select time"}
              </span>

              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isTimeOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isTimeOpen &&
              !isFullDayBlocked &&
              availableTimeSlots.length > 0 && (
                <div className="absolute left-0 top-full z-30 mt-2 max-h-64 w-full overflow-y-auto border border-[#d8d2ca] bg-[#fcfaf7] shadow-[0_16px_40px_rgba(23,23,23,0.10)]">
                  <div className="grid grid-cols-3 p-2 sm:grid-cols-4">
                    {availableTimeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => {
                          setSelectedTime(time);
                          setIsTimeOpen(false);
                        }}
                        className={`px-3 py-3 text-center text-sm transition-colors ${
                          selectedTime === time
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
          {isFullDayBlocked && (
            <p className="mt-2 text-sm text-red-700">
              This date is unavailable.
            </p>
          )}

          {!isFullDayBlocked &&
            selectedDate &&
            availableTimeSlots.length === 0 && (
              <p className="mt-2 text-sm text-red-700">
                No available time slots for this date.
              </p>
            )}
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
          disabled={isLoading || !selectedTime}
          className="border-b border-[#171717] pb-1 text-sm font-medium text-[#171717] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Send request ↗"}
        </button>
      </div>
    </form>
  );
}