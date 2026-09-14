"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f3ee] px-6">
      <div className="max-w-md text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8b7866]">
          Something went wrong
        </p>

        <h1 className="mt-4 font-serif text-4xl text-[#171717]">
          We couldn&apos;t load this page.
        </h1>

        <p className="mt-4 text-sm leading-6 text-[#6d6963]">
          Please try again. If the problem continues, return to the previous
          page and retry your action.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-7 border-b border-[#171717] pb-1 text-sm font-medium text-[#171717]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}