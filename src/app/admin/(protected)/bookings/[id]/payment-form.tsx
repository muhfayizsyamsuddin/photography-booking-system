"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { appToast } from "@/lib/toast";

type PaymentFormProps = {
  bookingId: string;
  initialDepositAmount: number;
  initialTotalPayment: number;
  initialPaymentStatus: string;
  initialPaymentProofUrl?: string | null;
};

const paymentStatuses = [
  "UNPAID",
  "PARTIALLY_PAID",
  "PAID",
];

export default function PaymentForm({
  bookingId,
  initialDepositAmount,
  initialTotalPayment,
  initialPaymentStatus,
  initialPaymentProofUrl,
}: PaymentFormProps) {
  const router = useRouter();

  const [depositAmount, setDepositAmount] = useState(
    initialDepositAmount.toString()
  );

  const [totalPayment, setTotalPayment] = useState(
    initialTotalPayment.toString()
  );

  const [paymentStatus, setPaymentStatus] = useState(
    initialPaymentStatus
  );
  const [paymentProofUrl, setPaymentProofUrl] = useState(
  initialPaymentProofUrl ?? ""
);

  const [isUploading, setIsUploading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/admin/bookings/${bookingId}/payment`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            depositAmount: Number(depositAmount),
            totalPayment: Number(totalPayment),
            paymentStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        appToast.error(
          result.message ?? "Failed to update payment information."
        );
        return;
      }

      appToast.success("Payment information updated.");

      router.refresh();
    } catch {
      appToast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleProofUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    try {
      const response = await fetch(
        `/api/admin/bookings/${bookingId}/payment-proof`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        appToast.error(
          result.message ?? "Failed to upload payment proof."
        );
        return;
      }

      setPaymentProofUrl(result.data.paymentProofUrl);

      appToast.success("Payment proof uploaded.");

      router.refresh();
    } catch {
      appToast.error("Something went wrong.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label
            htmlFor="depositAmount"
            className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
          >
            Deposit
          </label>

          <input
            id="depositAmount"
            type="number"
            min="0"
            step="1000"
            value={depositAmount}
            onChange={(event) => setDepositAmount(event.target.value)}
            disabled={isLoading}
            className="mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors focus:border-[#8b7866] disabled:cursor-not-allowed disabled:opacity-60"
          />
          <p className="mt-2 text-xs text-[#6d6963]">
            Rp {Number(depositAmount || 0).toLocaleString("id-ID")}
          </p>
        </div>

        <div>
          <label
            htmlFor="totalPayment"
            className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
          >
            Total Paid
          </label>

          <input
            id="totalPayment"
            type="number"
            min="0"
            step="1000"
            value={totalPayment}
            onChange={(event) => setTotalPayment(event.target.value)}
            disabled={isLoading}
            className="mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors focus:border-[#8b7866] disabled:cursor-not-allowed disabled:opacity-60"
          />
          <p className="mt-2 text-xs text-[#6d6963]">
            Rp {Number(totalPayment || 0).toLocaleString("id-ID")}
          </p>
        </div>

        <div>
          <label
            htmlFor="paymentStatus"
            className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
          >
            Payment Status
          </label>

          <select
            id="paymentStatus"
            value={paymentStatus}
            onChange={(event) =>
              setPaymentStatus(event.target.value)
            }
            disabled={isLoading}
            className="mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors focus:border-[#8b7866] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="border-t border-[#e7e1da] pt-5">
          <label
            htmlFor="paymentProof"
            className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
          >
            Payment Proof
          </label>

          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {paymentProofUrl ? (
                <a
                  href={paymentProofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#171717] underline underline-offset-4 transition-opacity hover:opacity-60"
                >
                  View uploaded proof ↗
                </a>
              ) : (
                <p className="text-sm text-[#6d6963]">
                  No payment proof uploaded.
                </p>
              )}
            </div>

            <label
              htmlFor="paymentProof"
              className="cursor-pointer border border-[#d8d2ca] px-4 py-2.5 text-sm font-medium text-[#171717] transition-colors hover:bg-[#f6f3ee]"
            >
              {isUploading
                ? "Uploading..."
                : paymentProofUrl
                  ? "Replace Proof"
                  : "Upload Proof"}
            </label>

            <input
              id="paymentProof"
              type="file"
              accept="image/*"
              disabled={isUploading || isLoading}
              onChange={handleProofUpload}
              className="hidden"
            />
          </div>

          <p className="mt-2 text-xs text-[#6d6963]">
            Image files only, maximum 5 MB.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer bg-[#171717] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Update Payment"}
        </button>
      </div>
    </form>
  );
}