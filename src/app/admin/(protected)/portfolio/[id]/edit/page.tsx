import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import EditPortfolioForm from "./edit-portfolio-form";

type EditPortfolioPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPortfolioPage({
  params,
}: EditPortfolioPageProps) {
  const { id } = await params;

  const portfolio = await prisma.portfolio.findUnique({
    where: {
      id,
    },
  });

  if (!portfolio) {
    notFound();
  }

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
          Edit Portfolio
        </h1>
      </div>

      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
        <EditPortfolioForm portfolio={portfolio} />
      </div>
    </div>
  );
}