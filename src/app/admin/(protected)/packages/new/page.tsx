import Link from "next/link";

import PackageForm from "./package-form";

export default function NewPackagePage() {
  return (
    <div className="space-y-10">
      <header className="border-b border-[#d8d2ca] pb-8">
        <Link
          href="/admin/packages"
          className="text-sm text-[#6d6963] transition-colors hover:text-[#171717]"
        >
          ← Back to packages
        </Link>

        <p className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-[#8b7866]">
          Package Management
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#171717]">
          Add Package
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d6963]">
          Create a new photography package and make it available for booking.
        </p>
      </header>

      <section className="max-w-3xl border border-[#d8d2ca] bg-[#fcfaf7]">
        <div className="border-b border-[#d8d2ca] px-5 py-4 sm:px-6">
          <h2 className="font-semibold text-[#171717]">
            Package Information
          </h2>

          <p className="mt-1 text-sm text-[#6d6963]">
            Enter the package details, pricing, and availability.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <PackageForm />
        </div>
      </section>
    </div>
  );
}