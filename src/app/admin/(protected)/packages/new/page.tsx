import Link from "next/link";

import PackageForm from "./package-form";

export default function NewPackagePage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/packages"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to packages
        </Link>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Add Package
        </h1>
      </div>

      <div className="max-w-2xl rounded-lg border bg-white p-6">
        <PackageForm />
      </div>
    </div>
  );
}