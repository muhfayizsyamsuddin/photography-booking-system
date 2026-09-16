"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { appToast } from "@/lib/toast";

type ClientNotesFormProps = {
  clientId: string;
  initialNotes: string | null;
};

export default function ClientNotesForm({
  clientId,
  initialNotes,
}: ClientNotesFormProps) {
  const router = useRouter();

  const [notes, setNotes] = useState(initialNotes ?? "");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/clients/${clientId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: notes.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        appToast.error(
          result.message ?? "Failed to update client notes."
        );
        return;
      }

      appToast.success("Client notes updated.");

      router.refresh();
    } catch {
      appToast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="client-notes"
          className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
        >
          Internal Notes
        </label>

        <textarea
          id="client-notes"
          rows={5}
          maxLength={2000}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          disabled={isLoading}
          placeholder="Add private notes about this client..."
          className="mt-2 w-full resize-none border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-3 text-sm leading-6 text-[#171717] outline-none transition-colors focus:border-[#8b7866] disabled:cursor-not-allowed disabled:opacity-60"
        />

        <p className="mt-2 text-xs text-[#6d6963]">
          Visible to admin only.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || notes === (initialNotes ?? "")}
          className="cursor-pointer bg-[#171717] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:bg-[#d8d2ca] disabled:text-[#8b7866]"
        >
          {isLoading ? "Saving..." : "Save Notes"}
        </button>
      </div>
    </form>
  );
}