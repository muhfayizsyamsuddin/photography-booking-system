import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import EditPackageForm from "./edit-package-form";
import PackageAddons from "./package-addons";

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
    include: {
      addons: {
        orderBy: [
          {
            displayOrder: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
      },
    },
  });

  if (!packageData) {
    notFound();
  }

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
          Edit Package
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#6d6963]">
          Update package information, pricing, availability, and display settings.
        </p>
      </header>

      <section className="max-w-3xl border border-[#d8d2ca] bg-[#fcfaf7]">
        <div className="border-b border-[#d8d2ca] px-5 py-4 sm:px-6">
          <h2 className="font-semibold text-[#171717]">
            Package Information
          </h2>

          <p className="mt-1 text-sm text-[#6d6963]">
            Editing{" "}
            <span className="font-medium text-[#171717]">
              {packageData.name}
            </span>
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <EditPackageForm packageData={packageData} />
        </div>
      </section>

      <section className="max-w-3xl">
        <div className="mb-5">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8b7866]">
            Optional Services
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#171717]">
            Package Add-ons
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#6d6963]">
            Manage optional services and additional pricing for this package.
          </p>
        </div>

        <PackageAddons
          packageId={packageData.id}
          initialAddons={packageData.addons}
        />
      </section>
    </div>
  );
}