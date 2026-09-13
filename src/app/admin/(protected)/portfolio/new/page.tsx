import Link from "next/link";

import PortfolioForm from "./portfolio-form";

export default function NewPortfolioPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/portfolio"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to portfolio
        </Link>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Add Portfolio
        </h1>
      </div>

      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
        <PortfolioForm />
      </div>
    </div>
  );
}