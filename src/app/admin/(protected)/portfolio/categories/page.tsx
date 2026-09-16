import Link from "next/link";

import { prisma } from "@/lib/prisma";
import CategoryManager from "./category-manager";

export default async function PortfolioCategoriesPage() {
  const categories = await prisma.portfolioCategory.findMany({
    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
    include: {
      _count: {
        select: {
          portfolios: true,
        },
      },
    },
  });

  return (
    <div className="space-y-10">
      <header className="border-b border-[#d8d2ca] pb-8">
        <Link
          href="/admin/portfolio"
          className="text-sm text-[#6d6963] transition-colors hover:text-[#171717]"
        >
          ← Back to portfolio
        </Link>

        <p className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-[#8b7866]">
          Portfolio Management
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#171717]">
          Portfolio Categories
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d6963]">
          Organize portfolio work into categories for easier browsing and filtering.
        </p>
      </header>

      <CategoryManager initialCategories={categories} />
    </div>
  );
}