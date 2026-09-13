import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import EditPackageForm from "./edit-package-form";

type EditPackagePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPackagePage({
  params,
}: EditPackagePageProps) {
  const { id } = await params;

  const packageData = await prisma.package.findUnique({
    where: {
      id,
    },
  });

  if (!packageData) {
    notFound();
  }

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
          Edit Package
        </h1>
      </div>

      <div className="max-w-2xl rounded-lg border bg-white p-6">
        <EditPackageForm packageData={packageData} />
      </div>
    </div>
  );
}